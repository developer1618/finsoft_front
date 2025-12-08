<template>
  <div class="space-y-10">
    <div class="border-b border-gray-900/10 pb-10">
      <h2 class="text-base/7 font-semibold text-gray-900">Профиль</h2>
      <p class="mt-1 text-sm/6 text-gray-600">
        Обновите личные данные и загрузите фотографию профиля
      </p>
    </div>

    <!-- Success/Error messages -->
    <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <form class="space-y-8" @submit.prevent="saveProfile">
      <section class="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6 space-y-6">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Фотография и данные</h3>
          <p class="mt-1 text-sm text-gray-500">
            Обновите аватар и личную информацию.
          </p>
        </div>

        <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <div class="space-y-4 md:basis-1/3 md:flex-shrink-0">
            <div class="flex items-center gap-x-6">
              <div
                class="size-24 flex-none cursor-pointer overflow-hidden rounded-xl bg-gray-100 object-cover outline outline-1 outline-black/5 transition hover:outline-indigo-400"
                role="button"
                tabindex="0"
                @click="triggerPhotoSelect"
                @keydown.enter.prevent="triggerPhotoSelect"
              >
                <img
                  v-if="profile.photoUrl"
                  :src="profile.photoUrl"
                  alt="Аватар пользователя"
                  class="size-full object-cover"
                />
                <div
                  v-else
                  class="flex size-full items-center justify-center text-2xl font-semibold text-gray-400"
                >
                  {{ initials }}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-100"
                  @click="triggerPhotoSelect"
                >
                  Изменить фото
                </button>
                <p class="mt-2 text-xs text-gray-500">JPG, GIF или PNG. До 5 МБ.</p>
              </div>
            </div>

            <input
              ref="photoInput"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              class="sr-only"
              @change="handlePhotoChange"
            />
            <p v-if="photoError" class="text-sm text-rose-600">{{ photoError }}</p>
          </div>

          <div class="space-y-4 md:basis-2/3">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-sm font-medium text-gray-700">
                Имя
                <input
                  v-model="profile.firstName"
                  type="text"
                  required
                  class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Введите имя"
                />
              </label>

              <label class="block text-sm font-medium text-gray-700">
                Фамилия
                <input
                  v-model="profile.lastName"
                  type="text"
                  required
                  class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Введите фамилию"
                />
              </label>
            </div>

            <label class="block text-sm font-medium text-gray-700">
              Email
              <input
                v-model="profile.email"
                type="email"
                required
                class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                placeholder="you@example.com"
              />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              Телефон
              <input
                v-model="profile.phone"
                type="tel"
                class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                placeholder="+992 90 123 45 67"
              />
            </label>

            <div class="pt-2">
              <p class="text-sm text-gray-500">
                <span class="font-medium text-gray-700">Роль:</span>
                <span class="ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                  :class="isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ isAdmin ? 'Администратор' : 'Менеджер' }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6 space-y-6">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Смена пароля</h3>
          <p class="mt-1 text-sm text-gray-500">Оставьте пустым, если не хотите менять пароль.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <label class="block text-sm font-medium text-gray-700">
            Текущий пароль
            <input
              v-model="passwordData.currentPassword"
              type="password"
              minlength="8"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              placeholder="Введите текущий пароль"
            />
          </label>

          <label class="block text-sm font-medium text-gray-700">
            Новый пароль
            <input
              v-model="passwordData.newPassword"
              type="password"
              minlength="8"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              placeholder="Введите новый пароль"
            />
          </label>
        </div>
      </section>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="resetForm"
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Сбросить
        </button>
        <button
          type="submit"
          :disabled="isSaving"
          class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          <svg
            v-if="isSaving"
            class="-ml-0.5 mr-2 size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Сохранить
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import { useAuth, authState } from "../stores/auth";
import { put } from "../services/api";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
};

const { user, isAdmin } = useAuth();

const profile = reactive<Profile>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  photoUrl: null,
});

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
});

const isSaving = ref(false);
const photoError = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const photoInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (user.value) {
    profile.firstName = user.value.firstName || '';
    profile.lastName = user.value.lastName || '';
    profile.email = user.value.email || '';
    profile.photoUrl = user.value.avatar || null;
  }
});

const initials = computed(() => {
  const first = profile.firstName?.[0] ?? "";
  const last = profile.lastName?.[0] ?? "";
  const value = `${first}${last}`.toUpperCase().trim();
  return value || "?";
});

const handlePhotoChange = (event: Event) => {
  photoError.value = null;
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (!file) {
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    photoError.value = "Файл превышает 5 МБ";
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    profile.photoUrl = reader.result as string;
  };
  reader.onerror = () => {
    photoError.value = "Не удалось загрузить изображение";
  };
  reader.readAsDataURL(file);
};

const triggerPhotoSelect = () => {
  photoInput.value?.click();
};

const saveProfile = async () => {
  isSaving.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  try {
    const updateData: Record<string, any> = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    };

    if (profile.phone) {
      updateData.phone = profile.phone;
    }

    if (profile.photoUrl && profile.photoUrl.startsWith('data:')) {
      updateData.avatar = profile.photoUrl;
    }

    if (passwordData.currentPassword && passwordData.newPassword) {
      updateData.currentPassword = passwordData.currentPassword;
      updateData.newPassword = passwordData.newPassword;
    }

    const response = await put<{ user: any }>('/auth/profile', updateData);

    if (response.success && response.data) {
      if (authState.user) {
        authState.user.firstName = profile.firstName;
        authState.user.lastName = profile.lastName;
        authState.user.email = profile.email;
        if (response.data.user?.avatar) {
          authState.user.avatar = response.data.user.avatar;
        }
        localStorage.setItem('finsoft_auth_user', JSON.stringify(authState.user));
      }

      successMessage.value = 'Профиль успешно обновлён';
      
      passwordData.currentPassword = '';
      passwordData.newPassword = '';
    } else {
      errorMessage.value = 'Не удалось обновить профиль';
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Ошибка при сохранении профиля';
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  if (user.value) {
    profile.firstName = user.value.firstName || '';
    profile.lastName = user.value.lastName || '';
    profile.email = user.value.email || '';
    profile.photoUrl = user.value.avatar || null;
  }
  passwordData.currentPassword = '';
  passwordData.newPassword = '';
  photoError.value = null;
  successMessage.value = null;
  errorMessage.value = null;
};
</script>
