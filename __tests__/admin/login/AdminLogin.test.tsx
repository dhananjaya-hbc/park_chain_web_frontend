import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLoginPage from "@/app/(auth)/admin-login/page";
import apiService from "@/lib/api/apiService";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/stores/sessionStore";

// 1. Mock the necessary modules
jest.mock("@/lib/api/apiService");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/lib/stores/sessionStore");

describe("Admin Login Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSessionStore as unknown as jest.Mock).mockReturnValue({ setRole: jest.fn() });
    
    // Clear localStorage to ensure a clean test state
    Object.getPrototypeOf(localStorage).setItem = jest.fn();
  });

  it("renders the admin login form correctly", () => {
    render(<AdminLoginPage />);
    expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@parkchain.com/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login as Admin/i })).toBeInTheDocument();
  });

  it("shows an error message when login fails", async () => {
    // Mock a failed API call
    (apiService.post as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/admin@parkchain.com/), { target: { value: 'wrong@admin.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole("button", { name: /Login as Admin/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("successfully logs in, stores token and wallet, then redirects", async () => {
    // Mock a successful API response
    const mockResponse = {
      token: "mock-admin-jwt-token",
      user: {
        wallet_address: "rAdminWalletAddress123",
        role: "admin"
      }
    };
    (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

    render(<AdminLoginPage />);
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/admin@parkchain.com/), { target: { value: 'admin@parkchain.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'securepassword' } });
    
    // Click Login
    fireEvent.click(screen.getByRole("button", { name: /Login as Admin/i }));

    await waitFor(() => {
      // 2. Verify token was stored via apiService
      expect(apiService.setToken).toHaveBeenCalledWith("mock-admin-jwt-token");
      
      // 3. Verify admin wallet address was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('admin_wallet', 'rAdminWalletAddress123');
      
      // 4. Verify cookie was set (optional check)
      expect(document.cookie).toContain("park_chain_role=admin");
      
      // 5. Verify redirection to admin dashboard
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it("shows loading state while processing login", async () => {
    // Mock a slow API response that stays pending
    (apiService.post as jest.Mock).mockImplementation(() => new Promise(() => {
      // Never resolves - keeps component in loading state
    }));

    render(<AdminLoginPage />);
    
    // Fill in form fields
    fireEvent.change(screen.getByPlaceholderText(/admin@parkchain.com/), { target: { value: 'admin@parkchain.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password' } });
    
    const loginButton = screen.getByRole("button", { name: /Login as Admin/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Logging in/i)).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
