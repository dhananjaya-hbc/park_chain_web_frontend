import { UserRole } from '@/types';

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  seller: '/seller/dashboard'
};

export const getRoleDashboard = (role: UserRole): string => {
  return ROLE_ROUTES[role];
};

export const isAuthorizedForRoute = (role: UserRole, pathname: string): boolean => {
  if (pathname.startsWith('/admin')) return role === 'admin';
  if (pathname.startsWith('/seller')) return role === 'seller';
  return true;
};

export const saveRoleToStorage = (role: UserRole): void => {
  localStorage.setItem('park_chain_role', role);
  document.cookie = `park_chain_role=${role}; path=/; max-age=86400; SameSite=Lax`;
};

export const getRoleFromStorage = (): UserRole | null => {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem('park_chain_role') as UserRole | null;
  if (role && ['admin', 'seller'].includes(role)) {
    return role;
  }
  return null;
};

export const clearRoleFromStorage = (): void => {
  localStorage.removeItem('park_chain_role');
  document.cookie = 'park_chain_role=; path=/; max-age=0';
};
