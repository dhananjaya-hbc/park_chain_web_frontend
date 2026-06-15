import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/app/(auth)/login/page';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/lib/stores/sessionStore';
import apiService from '@/lib/api/apiService';
import { getRoleDashboard } from '@/lib/utils/roleUtils';

type MockXumm = {
  on: jest.Mock;
  off: jest.Mock;
  logout: jest.Mock<Promise<void>, []>;
  authorize: jest.Mock<Promise<void>, []>;
  __setMockAccount: (account: string | null) => void;
};

type XamanMockModule = {
  xumm: MockXumm | null;
  __setMockXummInstance: (instance: MockXumm | null) => void;
};

const getXamanMockModule = (): XamanMockModule => {
  return jest.requireMock('@/lib/web3/xaman') as XamanMockModule;
};

const getMockXumm = (): MockXumm => {
  const currentXumm = getXamanMockModule().xumm;
  if (!currentXumm) {
    throw new Error('Expected mocked xumm instance to be defined in test.');
  }
  return currentXumm;
};

const getXummEventHandler = (event: 'success' | 'retrieved') => {
  const mockXumm = getMockXumm();
  const handlerCall = (mockXumm.on as jest.Mock).mock.calls.find(
    (call: unknown[]) => call[0] === event
  );
  if (!handlerCall) {
    throw new Error(`Expected Xumm \"${event}\" handler to be registered.`);
  }
  return handlerCall[1] as () => Promise<void>;
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock stores
jest.mock('@/lib/stores/sessionStore', () => ({
  useSessionStore: jest.fn(),
}));

// Mock API service
jest.mock('@/lib/api/apiService', () => ({
  post: jest.fn(),
  setToken: jest.fn(),
}));

// Mock roleUtils
jest.mock('@/lib/utils/roleUtils', () => ({
  getRoleDashboard: jest.fn(),
}));

// Mock Xaman
jest.mock('@/lib/web3/xaman', () => {
  // Let tests override these if needed
  let mockAccount: string | null = 'rMockWalletAddress123';
  const createMockXumm = () => ({
    on: jest.fn(),
    off: jest.fn(),
    logout: jest.fn().mockResolvedValue(undefined),
    authorize: jest.fn().mockResolvedValue(undefined),
    get user() {
      return {
        get account() {
          return Promise.resolve(mockAccount);
        }
      };
    },
    __setMockAccount: (account: string | null) => {
      mockAccount = account;
    },
  });

  let mockXummInstance: ReturnType<typeof createMockXumm> | null = createMockXumm();

  return {
    get xumm() {
      return mockXummInstance;
    },
    __setMockXummInstance: (instance: ReturnType<typeof createMockXumm> | null) => {
      mockXummInstance = instance;
    },
  };
});

describe('Seller LoginPage', () => {
  let mockRouterPush: jest.Mock;
  let mockSetRole: jest.Mock;
  const originalCookie = document.cookie;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    cleanup();

    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    mockSetRole = jest.fn();
    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      setRole: mockSetRole,
    });

    (getRoleDashboard as jest.Mock).mockReturnValue('/seller/dashboard');
    getMockXumm().__setMockAccount('rMockWalletAddress123');

    // Simple cookie mocking for document.cookie setter
    let cookieValue = '';
    Object.defineProperty(document, 'cookie', {
      get: () => cookieValue,
      set: (val: string) => { cookieValue = val; },
      configurable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(document, 'cookie', {
      value: originalCookie,
      configurable: true
    });
  });

  it('renders login page with connect button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Park Chain')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your seller account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect with Xaman Wallet/i })).toBeInTheDocument();
  });

  it('shows error if xumm is not initialized when clicking connect', async () => {
    const xamanMock = getXamanMockModule();
    const originalXumm = xamanMock.xumm;

    xamanMock.__setMockXummInstance(null);

    try {
      render(<LoginPage />);

      const button = screen.getByRole('button', { name: /Connect with Xaman Wallet/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Xaman SDK is not initialized yet. Please refresh.')).toBeInTheDocument();
      });
    } finally {
      xamanMock.__setMockXummInstance(originalXumm);
    }
  });

  it('triggers Xaman login process on button click', async () => {
    const mockXumm = getMockXumm();
    render(<LoginPage />);
    
    const button = screen.getByRole('button', { name: /Connect with Xaman Wallet/i });
    fireEvent.click(button);

    expect(mockXumm.logout).toHaveBeenCalledTimes(1);
    
    await waitFor(() => {
      expect(mockXumm.authorize).toHaveBeenCalledTimes(1);
    });
    
    expect(screen.getByText('Connecting your wallet...')).toBeInTheDocument();
    expect(screen.getByText('Setting up account...')).toBeInTheDocument(); // button loading state
  });

  it('handles Xaman login error', async () => {
    const mockXumm = getMockXumm();
    mockXumm.authorize.mockRejectedValueOnce(new Error('Auth failed'));
    
    render(<LoginPage />);
    
    const button = screen.getByRole('button', { name: /Connect with Xaman Wallet/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to connect with Xaman. Please try again.')).toBeInTheDocument();
    });
    
    // Loading state should be removed
    expect(screen.queryByText('Connecting your wallet...')).not.toBeInTheDocument();
  });

  it('registers with backend when Xaman success event fires and navigates to KYC', async () => {
    (apiService.post as jest.Mock).mockResolvedValueOnce({
      token: 'mock-jwt-token',
      user: {
        kyc_status: 'PENDING'
      }
    });

    render(<LoginPage />);

    // Simulate Xaman success event
    const successHandler = getXummEventHandler('success');
    
    // Call the success handler directly
    await successHandler();

    await waitFor(() => {
      expect(apiService.post).toHaveBeenCalledWith(expect.any(String), {
        wallet_address: 'rMockWalletAddress123',
        role: 'seller',
      });
    });

    expect(apiService.setToken).toHaveBeenCalledWith('mock-jwt-token');
    expect(mockSetRole).toHaveBeenCalledWith('seller');
    expect(document.cookie).toContain('park_chain_role=seller');
    
    // Redirects to KYC since status is not APPROVED
    expect(mockRouterPush).toHaveBeenCalledWith('/kyc');
  });

  it('redirects to dashboard when KYC is APPROVED and profile is completed', async () => {
    (apiService.post as jest.Mock).mockResolvedValueOnce({
      token: 'mock-jwt-token',
      user: {
        kyc_status: 'APPROVED',
        profileCompleted: true
      }
    });

    render(<LoginPage />);

    const successHandler = getXummEventHandler('success');
    await successHandler();
    
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/seller/dashboard');
    });
  });

  it('redirects to complete-profile when KYC is APPROVED but profileCompleted is false', async () => {
    (apiService.post as jest.Mock).mockResolvedValueOnce({
      token: 'mock-jwt-token',
      user: {
        kyc_status: 'APPROVED',
        profileCompleted: false
      }
    });

    render(<LoginPage />);

    const successHandler = getXummEventHandler('success');
    await successHandler();
    
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/seller/complete-profile');
    });
  });

  it('handles backend registration failure correctly', async () => {
    (apiService.post as jest.Mock).mockRejectedValueOnce(new Error('Backend error'));

    render(<LoginPage />);

    const successHandler = getXummEventHandler('success');
    await successHandler();

    await waitFor(() => {
      expect(screen.getByText('Backend error')).toBeInTheDocument();
    });
    
    // Ensure loading state stopped
    expect(screen.queryByText('Setting up account...')).not.toBeInTheDocument();
  });

  it('handles missing account from Xaman nicely', async () => {
    getMockXumm().__setMockAccount(null);
    render(<LoginPage />);

    const successHandler = getXummEventHandler('success');
    await successHandler();

    // Since account wasn't retrieved, it shouldn't proceed to backend
    expect(apiService.post).not.toHaveBeenCalled();
  });

  it('cleans up Xaman listeners on unmount', () => {
    const mockXumm = getMockXumm();
    const { unmount } = render(<LoginPage />);
    
    const successHandler = getXummEventHandler('success');
    const retrievedHandler = getXummEventHandler('retrieved');
    
    unmount();

    expect(mockXumm.off).toHaveBeenCalledWith('success', successHandler);
    expect(mockXumm.off).toHaveBeenCalledWith('retrieved', retrievedHandler);
  });
});
