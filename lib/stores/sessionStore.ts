import { create } from 'zustand';
import { UserRole } from '@/types';
import { saveRoleToStorage, getRoleFromStorage, clearRoleFromStorage } from '@/lib/utils/roleUtils';

interface SessionState {
  role: UserRole | null;
  isLoading: boolean;

  // Actions
  initSession: () => void;
  setRole: (role: UserRole) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  role: null,
  isLoading: true,

  initSession: () => {
    const storedRole = getRoleFromStorage();
    set({ role: storedRole, isLoading: false });
  },

  setRole: (role: UserRole) => {
    saveRoleToStorage(role);
    set({ role });
  },

  clearSession: () => {
    clearRoleFromStorage();
    set({ role: null });
  },
}));
