// lib/api/apiService.ts

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('park_chain_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('park_chain_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('park_chain_token');
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('park_chain_token');
    }
    return this.token;
  }

  private get headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Helper to build URL safely — no double slashes
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_URL}${cleanEndpoint}`;
  }

  async get(endpoint: string) {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'GET',
      headers: this.headers,
      cache: 'no-store',
    });
    return this.handleResponse(response);
  }

  async post(endpoint: string, body?: Record<string, unknown>) {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'POST',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, body?: Record<string, unknown>) {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'PUT',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async patch(endpoint: string, body?: Record<string, unknown>) {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'PATCH',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string, body?: Record<string, unknown>) {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'DELETE',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }
    return data;
  }
}

const apiService = new ApiService();
export default apiService;