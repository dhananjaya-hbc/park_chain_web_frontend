import { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { getRoleFromStorage, saveRoleToStorage, clearRoleFromStorage } from '@/lib/utils/roleUtils';

export function useRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = getRoleFromStorage();
    setRole(storedRole);
    setIsLoading(false);
  }, []);

  const updateRole = (newRole: UserRole) => {
    saveRoleToStorage(newRole);
    setRole(newRole);
  };

  const clearRole = () => {
    clearRoleFromStorage();
    setRole(null);
  };

  return {
    role,
    isLoading,
    updateRole,
    clearRole,
    isAdmin: role === 'admin',
    isSeller: role === 'seller',
    hasRole: role !== null
  };
}
