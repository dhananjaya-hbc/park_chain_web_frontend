import { renderHook, act } from '@testing-library/react';
import { useAddNewSpotForm } from '@/hooks/useAddNewSpotForm';

describe('useAddNewSpotForm Hook', () => {
  test('initializes with default values', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    expect(result.current.formState.title).toBe('');
    expect(result.current.formState.slots.length).toBe(6);
    expect(result.current.formState.totalSlots).toBe(1);
    expect(result.current.formState.isSubmitting).toBe(false);
  });

  test('updates general info', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    act(() => {
      result.current.setGeneralInfo({
        title: 'New Spot',
        description: 'Secure area',
        address: '123 Test Rd',
      });
    });

    expect(result.current.formState.title).toBe('New Spot');
    expect(result.current.formState.description).toBe('Secure area');
    expect(result.current.formState.address).toBe('123 Test Rd');
  });

  test('updates location coordinates', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    act(() => {
      result.current.setLocation('6.9271', '79.8612');
    });

    expect(result.current.formState.latitude).toBe('6.9271');
    expect(result.current.formState.longitude).toBe('79.8612');
  });

  test('updates slots and total slots', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    act(() => {
      result.current.setSlots([
        { id: 1, slotType: 'Car', slots: 5, rate: '10.00', isCustom: false },
      ]);
      result.current.setTotalSlots(5);
    });

    expect(result.current.formState.slots.length).toBe(1);
    expect(result.current.formState.totalSlots).toBe(5);
  });

  test('updates imageFiles and kybSubmissionId', () => {
    const { result } = renderHook(() => useAddNewSpotForm());
    const mockFile = new File([''], 'spot.png', { type: 'image/png' });

    act(() => {
      result.current.setImageFiles([mockFile]);
      result.current.setKybSubmissionId('kyb-999');
    });

    expect(result.current.formState.imageFiles).toEqual([mockFile]);
    expect(result.current.formState.kybSubmissionId).toBe('kyb-999');
  });

  test('prepareSubmissionPayload validates required fields and builds payload', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    // Fails on empty slots
    expect(() => result.current.prepareSubmissionPayload()).toThrow(
      'Please fill at least one slot row'
    );

    // Partial slot error
    act(() => {
      result.current.setSlots([
        { id: 1, slotType: 'Car', slots: 5, rate: '0', isCustom: false },
      ]);
    });
    expect(() => result.current.prepareSubmissionPayload()).toThrow(
      'Incomplete row(s): Car. Both slot count and hourly rate are required for each row.'
    );

    // Valid slots but missing general info
    act(() => {
      result.current.setSlots([
        { id: 1, slotType: 'Car', slots: 5, rate: '10.00', isCustom: false },
      ]);
    });
    expect(() => result.current.prepareSubmissionPayload()).toThrow('Spot name is required');

    // Complete valid data
    act(() => {
      result.current.setGeneralInfo({
        title: 'Ocean Garage',
        address: '10 Marine Drive',
        description: 'Covered spot',
      });
      result.current.setLocation('6.9', '79.8');
      result.current.setTotalSlots(5);
    });

    const payload = result.current.prepareSubmissionPayload();
    expect(payload).toEqual({
      title: 'Ocean Garage',
      description: 'Covered spot',
      address: '10 Marine Drive',
      latitude: 6.9,
      longitude: 79.8,
      vehicleTypes: ['Car'],
      slotsPerType: [5],
      pricesPerHour: [10],
      totalSlots: 5,
    });
  });

  test('handles invalid coordinates in prepareSubmissionPayload', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    act(() => {
      result.current.setSlots([
        { id: 1, slotType: 'Car', slots: 5, rate: '10.00', isCustom: false },
      ]);
      result.current.setGeneralInfo({
        title: 'Spot',
        address: 'Addr',
      });
      result.current.setLocation('invalid', 'invalid');
    });

    expect(() => result.current.prepareSubmissionPayload()).toThrow('Invalid coordinates');
  });

  test('setSubmissionState and resetForm reset values properly', () => {
    const { result } = renderHook(() => useAddNewSpotForm());

    act(() => {
      result.current.setSubmissionState(true, 'Temporary error');
    });
    expect(result.current.formState.isSubmitting).toBe(true);
    expect(result.current.formState.submitError).toBe('Temporary error');

    act(() => {
      result.current.resetForm();
    });
    expect(result.current.formState.isSubmitting).toBe(false);
    expect(result.current.formState.title).toBe('');
  });
});
