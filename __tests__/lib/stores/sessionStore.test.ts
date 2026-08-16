import { useSessionStore } from '@/lib/stores/sessionStore';
import * as roleUtils from '@/lib/utils/roleUtils';

describe('sessionStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({ role: null, isLoading: true });
    jest.clearAllMocks();
  });

  test('initSession loads role from storage and sets isLoading false', () => {
    const getRoleSpy = jest.spyOn(roleUtils, 'getRoleFromStorage').mockReturnValue('seller');
    useSessionStore.getState().initSession();

    expect(getRoleSpy).toHaveBeenCalled();
    expect(useSessionStore.getState().role).toBe('seller');
    expect(useSessionStore.getState().isLoading).toBe(false);
  });

  test('setRole saves role to storage and updates state', () => {
    const saveRoleSpy = jest.spyOn(roleUtils, 'saveRoleToStorage');
    useSessionStore.getState().setRole('admin');

    expect(saveRoleSpy).toHaveBeenCalledWith('admin');
    expect(useSessionStore.getState().role).toBe('admin');
  });

  test('clearSession clears storage and resets role to null', () => {
    const clearRoleSpy = jest.spyOn(roleUtils, 'clearRoleFromStorage');
    useSessionStore.getState().setRole('seller');
    useSessionStore.getState().clearSession();

    expect(clearRoleSpy).toHaveBeenCalled();
    expect(useSessionStore.getState().role).toBeNull();
  });
});
