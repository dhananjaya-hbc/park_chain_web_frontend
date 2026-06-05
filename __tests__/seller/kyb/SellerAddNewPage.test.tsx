import React from 'react';
import { render, screen } from '@testing-library/react';
import SellerNewPage from '@/app/(protected)/seller/addnew/page';

const mockSearchParamsGet = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockSearchParamsGet,
  }),
}));

jest.mock('@/app/(protected)/seller/addnew/Components/Main', () => ({
  __esModule: true,
  default: ({ kybId }: { kybId?: string }) => (
    <div data-testid="main-component">Main:{kybId ?? 'none'}</div>
  ),
}));

jest.mock('@/app/(protected)/seller/addnew/Components/KYBModal', () => ({
  __esModule: true,
  default: () => <div data-testid="kyb-modal">KYB Modal</div>,
}));

describe('Seller Add New Page KYB Gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParamsGet.mockImplementation(() => null);
  });

  test('renders Main with kybId and no modal when kybId query is present', () => {
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === 'kybId') return 'kyb-77';
      return null;
    });

    render(<SellerNewPage />);

    expect(screen.getByTestId('main-component').textContent).toContain('Main:kyb-77');
    expect(screen.queryByTestId('kyb-modal')).toBeNull();
  });

  test('renders Main without modal when kyb=done', () => {
    mockSearchParamsGet.mockImplementation((key: string) => {
      if (key === 'kyb') return 'done';
      return null;
    });

    render(<SellerNewPage />);

    expect(screen.getByTestId('main-component').textContent).toContain('Main:none');
    expect(screen.queryByTestId('kyb-modal')).toBeNull();
  });

  test('renders KYB modal and blurred Main when KYB is not done', () => {
    const { container } = render(<SellerNewPage />);

    expect(screen.getByTestId('kyb-modal')).toBeTruthy();
    expect(screen.getByTestId('main-component').textContent).toContain('Main:none');

    const blurredContainer = container.querySelector('.blur-sm.pointer-events-none');
    expect(blurredContainer).toBeTruthy();
  });
});
