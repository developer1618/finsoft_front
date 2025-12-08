import { computed, reactive } from 'vue';
import { post } from '../services/api';

export type UserRole = 'admin' | 'manager';

export type AuthUser = {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  token?: string;
};

const STORAGE_KEY = 'finsoft_auth_user';

type StoredUser = AuthUser;

const loadUserFromStorage = (): StoredUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as StoredUser;
    if (!parsed.id || !parsed.role) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persistUser = (user: StoredUser | null) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (user) {
    const sanitizedUser = {
      ...user,
      token: user.token,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedUser));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const state = reactive<{ user: StoredUser | null }>({
  user: loadUserFromStorage(),
});

export const authState = state;

export type LoginResult = {
  success: boolean;
  user?: AuthUser;
  message?: string;
};

export const login = async (
  username: string,
  password: string
): Promise<LoginResult> => {
  if (!username.trim() || !password) {
    return { success: false, message: 'Введите логин и пароль' };
  }

  try {
    const response = await post<{
      user: {
        id: string;
        username: string;
        email?: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        avatar: string;
        phone?: string;
      };
      token: string;
    }>('/auth/login', { username: username.trim(), password });

    if (response.success && response.data) {
      const user: AuthUser = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        role: response.data.user.role,
        avatar: response.data.user.avatar,
        phone: response.data.user.phone,
        token: response.data.token,
      };

      state.user = user;
      persistUser(user);

      return { success: true, user };
    }

    return { success: false, message: 'Неверный ответ сервера' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка при входе в систему';
    return { success: false, message };
  }
};

export const logout = async () => {
  try {
    await post('/auth/logout', {});
  } catch {
  } finally {
    state.user = null;
    persistUser(null);
  }
};

export const useAuth = () => {
  const user = computed(() => state.user);
  const isAuthenticated = computed(() => Boolean(state.user));
  const isAdmin = computed(() => state.user?.role === 'admin');
  const isManager = computed(() => state.user?.role === 'manager');

  return {
    user,
    isAuthenticated,
    isAdmin,
    isManager,
    login,
    logout,
  };
};

export const getCurrentRole = (): UserRole | null => state.user?.role ?? null;

export const getToken = (): string | null => state.user?.token ?? null;

export const refreshUserData = (userData: Partial<AuthUser>) => {
  if (state.user) {
    state.user = { ...state.user, ...userData };
    persistUser(state.user);
  }
};
