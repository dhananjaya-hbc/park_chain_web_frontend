import { renderHook, act } from '@testing-library/react';
import { useFcmToken } from '@/hooks/useFcmToken';
import apiService from '@/lib/api/apiService';
import { getToken } from 'firebase/messaging';

jest.mock('@/lib/api/apiService');
jest.mock('firebase/messaging', () => ({
  getToken: jest.fn(),
}));

jest.mock('@/lib/firebase/app', () => ({
  messaging: {},
}));

describe('useFcmToken Hook', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NEXT_PUBLIC_FIREBASE_VAPID_KEY: 'test-vapid-key' };
    (apiService.post as jest.Mock).mockResolvedValue({ success: true });
    (apiService.delete as jest.Mock).mockResolvedValue({ success: true });
    (apiService.get as jest.Mock).mockResolvedValue({ tokens: [{ token: 'abc' }] });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('registers token with backend successfully', async () => {
    const { result } = renderHook(() => useFcmToken());

    let res: boolean | undefined;
    await act(async () => {
      res = await result.current.registerToken('mock-fcm-token');
    });

    expect(res).toBe(true);
    expect(apiService.post).toHaveBeenCalledWith(
      expect.stringContaining('/notifications/token'),
      expect.objectContaining({
        fcm_token: 'mock-fcm-token',
        device_type: 'web',
      })
    );
  });

  test('removes token from backend', async () => {
    const { result } = renderHook(() => useFcmToken());

    let res: boolean | undefined;
    await act(async () => {
      res = await result.current.removeToken('mock-fcm-token');
    });

    expect(res).toBe(true);
    expect(apiService.delete).toHaveBeenCalledWith(
      expect.stringContaining('/notifications/token'),
      expect.objectContaining({
        fcm_token: 'mock-fcm-token',
      })
    );
  });

  test('lists tokens from backend', async () => {
    const { result } = renderHook(() => useFcmToken());

    let tokens: any;
    await act(async () => {
      tokens = await result.current.listTokens();
    });

    expect(tokens).toEqual([{ token: 'abc' }]);
    expect(apiService.get).toHaveBeenCalledWith(expect.stringContaining('/notifications/tokens'));
  });

  test('initializeFcm succeeds when permission is granted and token returned', async () => {
    (getToken as jest.Mock).mockResolvedValueOnce('firebase-generated-token');
    global.Notification = {
      requestPermission: jest.fn().mockResolvedValue('granted'),
    } as any;

    const { result } = renderHook(() => useFcmToken());

    await act(async () => {
      await result.current.initializeFcm();
    });

    expect(result.current.token).toBe('firebase-generated-token');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('handles permission denied during initializeFcm', async () => {
    global.Notification = {
      requestPermission: jest.fn().mockResolvedValue('denied'),
    } as any;

    const { result } = renderHook(() => useFcmToken());

    await act(async () => {
      await result.current.initializeFcm();
    });

    expect(result.current.error).toBe('Notification permission denied');
    expect(result.current.isLoading).toBe(false);
  });
});
