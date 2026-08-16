import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlockSpot from '@/app/(protected)/seller/spots/Componenets/BlockSpot';
import apiService from '@/lib/api/apiService';

jest.mock('@/lib/api/apiService');

describe('BlockSpot Component', () => {
  const mockSpot = {
    id: 'spot-block-1',
    name: 'Sunset Parking Deck',
    address: '100 Beach Blvd',
    description: 'Secure open area deck.',
    imageUrl: 'http://example.com/beach.jpg',
  };

  const mockOnClose = jest.fn();
  const mockOnSpotUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.get as jest.Mock).mockResolvedValue({ block: null });
    (apiService.post as jest.Mock).mockResolvedValue({ success: true, hasConflict: false });
  });

  test('renders spot details in header correctly', () => {
    render(
      <BlockSpot
        spot={mockSpot}
        onClose={mockOnClose}
        onSpotUpdated={mockOnSpotUpdated}
      />
    );

    expect(screen.getByText('Sunset Parking Deck')).toBeInTheDocument();
    expect(screen.getByText('100 Beach Blvd')).toBeInTheDocument();
    expect(screen.getByText('Schedule a Block')).toBeInTheDocument();
  });

  test('shows active block information if returned by API', async () => {
    (apiService.get as jest.Mock).mockResolvedValueOnce({
      block: {
        id: 'blk-1',
        reason: 'Maintenance Work',
        start_time: '2026-08-16T10:00:00Z',
        end_time: '2026-08-16T14:00:00Z',
      },
    });

    render(
      <BlockSpot
        spot={mockSpot}
        onClose={mockOnClose}
        onSpotUpdated={mockOnSpotUpdated}
      />
    );

    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith(expect.stringContaining('spot-block-1/block'));
    });
  });

  test('validates required fields before submitting block', async () => {
    render(
      <BlockSpot
        spot={mockSpot}
        onClose={mockOnClose}
        onSpotUpdated={mockOnSpotUpdated}
      />
    );

    const blockBtn = screen.getByRole('button', { name: 'Block Spot' });
    fireEvent.click(blockBtn);

    expect(await screen.findByText('Please fill in all the fields.')).toBeInTheDocument();
  });

  test('handles conflict check when date and time range is selected', async () => {
    (apiService.post as jest.Mock).mockResolvedValueOnce({ hasConflict: true });

    const { container } = render(
      <BlockSpot
        spot={mockSpot}
        onClose={mockOnClose}
        onSpotUpdated={mockOnSpotUpdated}
      />
    );

    const startDateInput = container.querySelector('#block-start-date') as HTMLInputElement;
    const endDateInput = container.querySelector('#block-end-date') as HTMLInputElement;
    const startTimeInput = container.querySelector('#block-start-time') as HTMLInputElement;
    const endTimeInput = container.querySelector('#block-end-time') as HTMLInputElement;

    fireEvent.change(startDateInput, { target: { value: '2026-08-20' } });
    fireEvent.change(endDateInput, { target: { value: '2026-08-20' } });
    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '14:00' } });

    await waitFor(() => {
      expect(apiService.post).toHaveBeenCalledWith(
        expect.stringContaining('check-conflicts'),
        expect.any(Object)
      );
    });

    expect(await screen.findByText(/Conflicting bookings found/i)).toBeInTheDocument();
  });

  test('successfully submits block request and shows success modal', async () => {
    (apiService.post as jest.Mock)
      .mockResolvedValueOnce({ hasConflict: false }) // check-conflicts
      .mockResolvedValueOnce({ success: true }); // block endpoint

    const { container } = render(
      <BlockSpot
        spot={mockSpot}
        onClose={mockOnClose}
        onSpotUpdated={mockOnSpotUpdated}
      />
    );

    const startDateInput = container.querySelector('#block-start-date') as HTMLInputElement;
    const endDateInput = container.querySelector('#block-end-date') as HTMLInputElement;
    const startTimeInput = container.querySelector('#block-start-time') as HTMLInputElement;
    const endTimeInput = container.querySelector('#block-end-time') as HTMLInputElement;

    fireEvent.change(startDateInput, { target: { value: '2026-08-20' } });
    fireEvent.change(endDateInput, { target: { value: '2026-08-20' } });
    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '14:00' } });
    fireEvent.change(container.querySelector('#block-reason') as HTMLSelectElement, {
      target: { value: 'Maintenance Work' },
    });

    await waitFor(() => {
      expect(screen.getByText(/No conflicting bookings found/i)).toBeInTheDocument();
    });

    const blockBtn = screen.getByRole('button', { name: 'Block Spot' });
    fireEvent.click(blockBtn);

    await waitFor(() => {
      expect(screen.getByText('Spot Blocked Successfully!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Back to Spots'));
    expect(mockOnSpotUpdated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles cancellation and confirm discard popup', () => {
    render(
      <BlockSpot
        spot={mockSpot}
        onClose={mockOnClose}
        onSpotUpdated={mockOnSpotUpdated}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(screen.getByText('Cancel Editing?')).toBeInTheDocument();

    const keepEditingBtn = screen.getByRole('button', { name: 'Keep Editing' });
    fireEvent.click(keepEditingBtn);
    expect(screen.queryByText('Cancel Editing?')).not.toBeInTheDocument();

    fireEvent.click(cancelBtn);
    const yesCancelBtn = screen.getByRole('button', { name: 'Yes, Cancel Editing' });
    fireEvent.click(yesCancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
