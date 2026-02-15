import { useEffect } from 'react';
import { useSessionStore } from '@/lib/stores/sessionStore';

export function useRole() {
  const { role, isLoading, initSession, setRole, clearSession } = useSessionStore();

  useEffect(() => {
    if (isLoading) {
      initSession();
    }
  }, [isLoading, initSession]);

  return {
    role,
    isLoading,
    updateRole: setRole,
    clearRole: clearSession,
    isAdmin: role === 'admin',
    isSeller: role === 'seller',
    hasRole: role !== null
  };
}
