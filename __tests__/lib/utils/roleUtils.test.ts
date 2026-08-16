import {
  ROLE_ROUTES,
  getRoleDashboard,
  isAuthorizedForRoute,
  saveRoleToStorage,
  getRoleFromStorage,
  clearRoleFromStorage,
} from '@/lib/utils/roleUtils';
import { UserRole } from '@/types';

describe('roleUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    // clear document cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  describe('getRoleDashboard', () => {
    test('returns correct dashboard route for admin', () => {
      expect(getRoleDashboard('admin')).toBe('/admin/dashboard');
    });

    test('returns correct dashboard route for seller', () => {
      expect(getRoleDashboard('seller')).toBe('/seller/dashboard');
    });
  });

  describe('isAuthorizedForRoute', () => {
    test('authorizes admin for /admin routes', () => {
      expect(isAuthorizedForRoute('admin', '/admin/dashboard')).toBe(true);
      expect(isAuthorizedForRoute('admin', '/admin/bookings')).toBe(true);
      expect(isAuthorizedForRoute('seller', '/admin/dashboard')).toBe(false);
    });

    test('authorizes seller for /seller routes', () => {
      expect(isAuthorizedForRoute('seller', '/seller/dashboard')).toBe(true);
      expect(isAuthorizedForRoute('seller', '/seller/spots')).toBe(true);
      expect(isAuthorizedForRoute('admin', '/seller/dashboard')).toBe(false);
    });

    test('authorizes any role for public routes', () => {
      expect(isAuthorizedForRoute('admin', '/')).toBe(true);
      expect(isAuthorizedForRoute('seller', '/login')).toBe(true);
    });
  });

  describe('Storage Helpers', () => {
    test('saveRoleToStorage saves role in localStorage and cookie', () => {
      saveRoleToStorage('admin');
      expect(localStorage.getItem('park_chain_role')).toBe('admin');
      expect(document.cookie).toContain('park_chain_role=admin');
    });

    test('getRoleFromStorage retrieves valid role', () => {
      localStorage.setItem('park_chain_role', 'seller');
      expect(getRoleFromStorage()).toBe('seller');
    });

    test('getRoleFromStorage returns null for invalid or missing role', () => {
      expect(getRoleFromStorage()).toBeNull();
      localStorage.setItem('park_chain_role', 'superadmin');
      expect(getRoleFromStorage()).toBeNull();
    });

    test('clearRoleFromStorage removes role from localStorage', () => {
      saveRoleToStorage('seller');
      clearRoleFromStorage();
      expect(localStorage.getItem('park_chain_role')).toBeNull();
    });
  });
});
