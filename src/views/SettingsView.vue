<template>
  <div class="space-y-10">
    <div class="border-b border-gray-900/10 pb-8">
      <h2 class="text-xl font-semibold text-gray-900">Настройки</h2>
      <p class="mt-2 text-sm text-gray-600">
        Управление пользователями, ролями и настройками меню
      </p>
    </div>

    <!-- Управление пользователями -->
    <section
      class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Пользователи</h3>
          <p class="text-sm text-gray-500 mt-1">
            Управление учётными записями и правами доступа
          </p>
        </div>
        <button
          @click="openAddUserModal"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <UserPlusIcon class="h-4 w-4 mr-2" />
          Добавить
        </button>
      </div>

      <!-- Загрузка -->
      <div v-if="usersLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Список пользователей -->
      <div v-else class="overflow-hidden rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Логин
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="user.avatar || defaultAvatar"
                    :alt="user.firstName"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-sm text-gray-600">{{ user.username }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800',
                  ]"
                >
                  {{ user.role === 'admin' ? 'Администратор' : 'Менеджер' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                <button
                  @click="editUser(user)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                  title="Редактировать"
                >
                  <PencilSquareIcon class="h-5 w-5" />
                </button>
                <button
                  @click="confirmDeleteUser(user)"
                  class="text-red-600 hover:text-red-900"
                  title="Удалить"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                Нет пользователей
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Пункты меню -->
    <section
      class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6"
    >
      <div>
        <h3 class="text-base font-semibold text-gray-900">Пункты меню</h3>
        <p class="text-sm text-gray-500 mt-1">
          Переключите видимость нужных разделов. Настройка применяется как к
          боковому меню, так и к карточкам на главной.
        </p>
      </div>

      <ul class="divide-y divide-gray-100">
        <li
          v-for="menu in menuOptions"
          :key="menu.id"
          class="flex items-center justify-between py-4"
        >
          <div>
            <p class="text-sm font-semibold text-gray-900">
              {{ menu.name }}
            </p>
            <p class="text-xs text-gray-500">{{ menu.description }}</p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="isVisible(menu.id)"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors',
              isVisible(menu.id) ? 'bg-green-500' : 'bg-gray-200',
            ]"
            @click="toggleVisibility(menu.id)"
          >
            <span class="sr-only">Переключить раздел {{ menu.name }}</span>
            <span
              :class="[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                isVisible(menu.id) ? 'translate-x-5' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </li>
      </ul>
    </section>

    <!-- Модальное окно добавления/редактирования пользователя -->
    <Teleport to="body">
      <div
        v-if="showUserModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/50" @click="closeUserModal"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingUser ? 'Редактировать пользователя' : 'Добавить пользователя' }}
            </h3>
            <button @click="closeUserModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveUser" class="px-6 py-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Имя</label>
                <input
                  v-model="userForm.firstName"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Фамилия</label>
                <input
                  v-model="userForm.lastName"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Логин</label>
              <input
                v-model="userForm.username"
                type="text"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ editingUser ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль' }}
              </label>
              <input
                v-model="userForm.password"
                type="password"
                :required="!editingUser"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Роль</label>
              <select
                v-model="userForm.role"
                required
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="admin">Администратор</option>
                <option value="manager">Менеджер</option>
              </select>
            </div>

            <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="closeUserModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="userSaving"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50"
              >
                {{ userSaving ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Модальное окно подтверждения удаления -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 z-10 p-6">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-center text-gray-900 mb-2">
            Удалить пользователя?
          </h3>
          <p class="text-sm text-center text-gray-500 mb-6">
            Вы уверены, что хотите удалить пользователя 
            <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong>?
            Это действие нельзя отменить.
          </p>
          <div class="flex gap-3 justify-center">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              @click="deleteUser"
              :disabled="userDeleting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 disabled:opacity-50"
            >
              {{ userDeleting ? 'Удаление...' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import api from "../services/api";
import defaultAvatar from "../assets/finsoft-logo.svg";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager';
  avatar?: string;
}

interface MenuOption {
  id: string;
  name: string;
  description: string;
}

const MENU_VISIBILITY_KEY = "finsoft_menu_visibility";
const MENU_VISIBILITY_EVENT = "menu-visibility-changed";

const menuOptions: MenuOption[] = [
  {
    id: "dashboard",
    name: "Главная",
    description: "Карточки и обзор основных метрик",
  },
  {
    id: "income-expense",
    name: "Доход / Расход",
    description: "Учёт финансовых операций",
  },
  {
    id: "varzob-expense",
    name: "Расход Варзоб",
    description: "Отдельный контроль затрат",
  },
  {
    id: "chinese-cargo",
    name: "Китайские грузы",
    description: "Статусы поставок",
  },
  {
    id: "capsule-workshop",
    name: "Цех капсулы",
    description: "Производственные показатели",
  },
  {
    id: "cup-workshop",
    name: "Цех стакана",
    description: "Статистика по второму цеху",
  },
  {
    id: "warehouse",
    name: "Склад цех",
    description: "Остатки на складе цеха",
  },
  {
    id: "factory-warehouse",
    name: "Склад завод",
    description: "Запасы на основном складе",
  },
  {
    id: "debts",
    name: "Долги",
    description: "Управление задолженностями клиентов",
  },
];

const defaultVisibility = menuOptions.reduce<Record<string, boolean>>(
  (acc, option) => ({ ...acc, [option.id]: true }),
  {}
);

const menuVisibility = ref<Record<string, boolean>>({ ...defaultVisibility });

const loadVisibility = () => {
  if (typeof window === "undefined") {
    return;
  }
  const stored = window.localStorage.getItem(MENU_VISIBILITY_KEY);
  if (!stored) {
    return;
  }
  try {
    const parsed = JSON.parse(stored) as Record<string, boolean>;
    menuVisibility.value = { ...defaultVisibility, ...parsed };
  } catch (error) {
    console.error("Не удалось прочитать настройки меню", error);
  }
};

const persistVisibility = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    MENU_VISIBILITY_KEY,
    JSON.stringify(menuVisibility.value)
  );
  window.dispatchEvent(
    new CustomEvent(MENU_VISIBILITY_EVENT, {
      detail: { ...menuVisibility.value },
    })
  );
};

const toggleVisibility = (id: string) => {
  menuVisibility.value[id] = !menuVisibility.value[id];
};

const isVisible = (id: string) => menuVisibility.value[id] ?? true;

const users = ref<User[]>([]);
const usersLoading = ref(false);
const showUserModal = ref(false);
const editingUser = ref<User | null>(null);
const userSaving = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);
const userDeleting = ref(false);

const userForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: 'manager' as 'admin' | 'manager',
});

const fetchUsers = async () => {
  usersLoading.value = true;
  try {
    const response = await api.get<{ data: User[] }>('/users');
    if (response.success && response.data) {
      users.value = (response.data as any).data || response.data;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    usersLoading.value = false;
  }
};

const openAddUserModal = () => {
  editingUser.value = null;
  userForm.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'manager',
  };
  showUserModal.value = true;
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
  };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
  editingUser.value = null;
};

const saveUser = async () => {
  userSaving.value = true;
  try {
    const payload: any = {
      first_name: userForm.value.firstName,
      last_name: userForm.value.lastName,
      username: userForm.value.username,
      email: userForm.value.email,
      role: userForm.value.role,
    };

    if (userForm.value.password) {
      payload.password = userForm.value.password;
      payload.password_confirmation = userForm.value.password;
    }

    if (editingUser.value) {
      await api.put(`/users/${editingUser.value.id}`, payload);
    } else {
      await api.post('/users', payload);
    }

    await fetchUsers();
    closeUserModal();
  } catch (error: any) {
    console.error('Failed to save user:', error);
    alert(error?.message || 'Ошибка при сохранении пользователя');
  } finally {
    userSaving.value = false;
  }
};

const confirmDeleteUser = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  userDeleting.value = true;
  try {
    await api.delete(`/users/${userToDelete.value.id}`);
    await fetchUsers();
    showDeleteModal.value = false;
    userToDelete.value = null;
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    alert(error?.message || 'Ошибка при удалении пользователя');
  } finally {
    userDeleting.value = false;
  }
};

onMounted(() => {
  loadVisibility();
  fetchUsers();
});

watch(
  menuVisibility,
  () => {
    persistVisibility();
  },
  { deep: true }
);
</script>
