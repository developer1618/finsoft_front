import { computed, reactive } from "vue";

export type UserRole = "admin" | "manager";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar: string;
};

const STORAGE_KEY = "finsoft_auth_user";

type StoredUser = AuthUser;

const loadUserFromStorage = (): StoredUser | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredUser;
  } catch (error) {
    console.error("Не удалось прочитать пользователя", error);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persistUser = (user: StoredUser | null) => {
  if (typeof window === "undefined") {
    return;
  }
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const state = reactive<{ user: StoredUser | null }>({
  user: loadUserFromStorage(),
});

const credentialMatrix: Array<{
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar: string;
}> = [
  {
    email: "admin",
    password: "admin",
    role: "admin",
    firstName: "Имя",
    lastName: "Фамилия",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=256&h=256&q=80",
  },
  {
    email: "manager",
    password: "manager",
    role: "manager",
    firstName: "Амирҷон",
    lastName: "Назиров",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=256&h=256&q=80",
  },
];

export const authState = state;

export type LoginResult = {
  success: boolean;
  user?: AuthUser;
  message?: string;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const account = credentialMatrix.find(
    (item) => item.email === normalizedEmail
  );

  if (!account || account.password !== password) {
    return { success: false, message: "Неверный логин или пароль" };
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    role: account.role,
    avatar: account.avatar,
  };

  state.user = user;
  persistUser(user);

  return { success: true, user };
};

export const logout = () => {
  state.user = null;
  persistUser(null);
};

export const useAuth = () => {
  const user = computed(() => state.user);
  const isAuthenticated = computed(() => Boolean(state.user));
  const isAdmin = computed(() => state.user?.role === "admin");
  const isManager = computed(() => state.user?.role === "manager");

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
