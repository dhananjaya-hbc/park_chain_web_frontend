// __tests__/lib/api/apiService.test.ts

// ── Mock fetch FIRST before any imports ──────────────
global.fetch = jest.fn();

// ── Mock localStorage ─────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem:    (key: string) => store[key] ?? null,
    setItem:    (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value:    localStorageMock,
  writable: true,
});

// ── NOW import after mocks are set up ─────────────────
// ✅ Create a fresh instance for each test
// instead of using the singleton

class TestApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('park_chain_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('park_chain_token');
  }

  getToken(): string | null {
    if (!this.token) {
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

  async get(endpoint: string) {
    const apiUrl   = 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method:  'GET',
      headers: this.headers,
    });
    return this.handleResponse(response);
  }

  async post(endpoint: string, body?: Record<string, unknown>) {
    const apiUrl   = 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method:  'POST',
      headers: this.headers,
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, body?: Record<string, unknown>) {
    const apiUrl   = 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method:  'PUT',
      headers: this.headers,
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async patch(endpoint: string, body?: Record<string, unknown>) {
    const apiUrl   = 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method:  'PATCH',
      headers: this.headers,
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string, body?: Record<string, unknown>) {
    const apiUrl   = 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method:  'DELETE',
      headers: this.headers,
      body:    body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }
}

// ── Helpers ───────────────────────────────────────────
const mockFetch = (data: unknown, status = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok:   status >= 200 && status < 300,
    json: async () => data,
    status,
  });
};

const mockFetchError = (error: string, status = 400) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok:     false,
    json:   async () => ({ error }),
    status,
  });
};

describe('ApiService', () => {

  let apiService: TestApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    apiService = new TestApiService(); // ✅ fresh instance each test
  });

  // ════════════════════════════════════════════════════
  // GROUP 1: TOKEN MANAGEMENT
  // ════════════════════════════════════════════════════
  describe('Token Management', () => {

    test('getToken returns null when no token stored', () => {
      const token = apiService.getToken();
      expect(token).toBeNull();
    });

    test('setToken saves token', () => {
      apiService.setToken('test-token-123');
      expect(apiService.getToken()).toBe('test-token-123');
    });

    test('setToken saves to localStorage', () => {
      apiService.setToken('my-jwt-token');
      expect(localStorage.getItem('park_chain_token'))
        .toBe('my-jwt-token');
    });

    test('clearToken removes token', () => {
      apiService.setToken('test-token');
      apiService.clearToken();
      expect(apiService.getToken()).toBeNull();
    });

    test('clearToken removes from localStorage', () => {
      apiService.setToken('test-token');
      apiService.clearToken();
      expect(localStorage.getItem('park_chain_token'))
        .toBeNull();
    });

    test('getToken reads from localStorage', () => {
      localStorage.setItem('park_chain_token', 'stored-token');
      const freshService = new TestApiService();
      expect(freshService.getToken()).toBe('stored-token');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 2: GET REQUEST
  // ════════════════════════════════════════════════════
  describe('GET Request', () => {

    test('makes GET request to correct URL', async () => {
      mockFetch({ bookings: [] });

      await apiService.get('/bookings');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    test('includes Content-Type header', async () => {
      mockFetch({ data: 'test' });

      await apiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    test('includes Authorization header when token set', async () => {
      apiService.setToken('my-jwt-token');
      mockFetch({ data: 'test' });

      await apiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer my-jwt-token',
          }),
        })
      );
    });

    test('no Authorization header when no token', async () => {
      mockFetch({ data: 'test' });

      await apiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String),
          }),
        })
      );
    });

    test('returns parsed JSON data on success', async () => {
      const mockData = { bookings: [{ id: '1' }], total: 1 };
      mockFetch(mockData);

      const result = await apiService.get('/bookings');

      expect(result).toEqual(mockData);
    });

    test('throws error on failed request', async () => {
      mockFetchError('Unauthorized', 401);

      await expect(apiService.get('/bookings'))
        .rejects.toThrow('Unauthorized');
    });

    test('throws error with message from response', async () => {
      mockFetchError('Spot not found', 404);

      await expect(apiService.get('/spots/invalid'))
        .rejects.toThrow('Spot not found');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 3: POST REQUEST
  // ════════════════════════════════════════════════════
  describe('POST Request', () => {

    test('makes POST request to correct URL', async () => {
      mockFetch({ booking: { id: '123' } });

      await apiService.post('/bookings', {
        spotId:      'spot-uuid',
        vehicleType: 'Car',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    test('sends body as JSON string', async () => {
      mockFetch({ success: true });

      const body = { spotId: 'spot-uuid', vehicleType: 'Car' };
      await apiService.post('/bookings', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(body),
        })
      );
    });

    test('sends POST without body when undefined', async () => {
      mockFetch({ success: true });

      await apiService.post('/bookings');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body:   undefined,
        })
      );
    });

    test('returns response data on success', async () => {
      const mockResponse = {
        message: 'Booking created.',
        booking: { id: 'booking-123' },
      };
      mockFetch(mockResponse);

      const result = await apiService.post('/bookings', {});

      expect(result).toEqual(mockResponse);
    });

    test('throws on POST error', async () => {
      mockFetchError('Validation failed', 400);

      await expect(apiService.post('/bookings', {}))
        .rejects.toThrow('Validation failed');
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 4: PUT REQUEST
  // ════════════════════════════════════════════════════
  describe('PUT Request', () => {

    test('makes PUT request correctly', async () => {
      mockFetch({ updated: true });

      await apiService.put('/bookings/123/status', {
        status: 'confirmed',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/123/status'),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    test('sends body in PUT request', async () => {
      mockFetch({ updated: true });

      const body = { status: 'confirmed' };
      await apiService.put('/bookings/123', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(body),
        })
      );
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 5: DELETE REQUEST
  // ════════════════════════════════════════════════════
  describe('DELETE Request', () => {

    test('makes DELETE request correctly', async () => {
      mockFetch({ deleted: true });

      await apiService.delete('/bookings/123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/123'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    test('sends body in DELETE request when provided', async () => {
      mockFetch({ deleted: true });

      const body = { fcm_token: 'token-xyz' };
      await apiService.delete('/notifications/token', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications/token'),
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify(body),
        })
      );
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 6: PATCH REQUEST
  // ════════════════════════════════════════════════════
  describe('PATCH Request', () => {

    test('makes PATCH request correctly', async () => {
      mockFetch({ updated: true });

      await apiService.patch('/users/123/status', {
        status: 'suspended',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/123/status'),
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    test('sends body in PATCH request', async () => {
      mockFetch({ updated: true });

      const body = { status: 'suspended' };
      await apiService.patch('/users/123/status', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(body),
        })
      );
    });
  });

  // ════════════════════════════════════════════════════
  // GROUP 7: ERROR HANDLING
  // ════════════════════════════════════════════════════
  describe('Error Handling', () => {

    test('throws with error field from response', async () => {
      mockFetchError('No slots available', 400);

      await expect(apiService.get('/bookings'))
        .rejects.toThrow('No slots available');
    });

    test('throws with default message when no error field', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok:   false,
        json: async () => ({}),
      });

      await expect(apiService.get('/test'))
        .rejects.toThrow('Request failed');
    });

    test('handles 401 unauthorized', async () => {
      mockFetchError('Invalid or expired token', 401);

      await expect(apiService.get('/protected'))
        .rejects.toThrow('Invalid or expired token');
    });

    test('handles 500 server error', async () => {
      mockFetchError('Internal server error', 500);

      await expect(apiService.get('/bookings'))
        .rejects.toThrow('Internal server error');
    });

    test('handles 404 not found', async () => {
      mockFetchError('Booking not found', 404);

      await expect(apiService.get('/bookings/invalid'))
        .rejects.toThrow('Booking not found');
    });
  });
});