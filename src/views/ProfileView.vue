<template>
  <div class="space-y-10">
    <div class="border-b border-gray-900/10 pb-10">
      <h2 class="text-base/7 font-semibold text-gray-900">Профиль</h2>
      <p class="mt-1 text-sm/6 text-gray-600">
        Обновите личные данные и загрузите фотографию профиля
      </p>
    </div>

    <form
      class="space-y-8"
      @submit.prevent="saveProfile"
    >
      <section class="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6 space-y-6">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Фотография и данные</h3>
          <p class="mt-1 text-sm text-gray-500">
            Сначала обновите аватар, затем заполните личную информацию.
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
                  class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-100"
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

            <label class="block text-sm font-medium text-gray-700">
              Дата рождения
              <input
                v-model="profile.birthDate"
                type="date"
                required
                :max="maxBirthDate"
                class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              Телефон
              <input
                v-model="profile.phone"
                type="tel"
                required
                pattern="^[+0-9\\s()-]{7,20}$"
                class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                placeholder="+992 90 123 45 67"
              />
            </label>

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
          </div>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6 space-y-6">
        <div>
          <h3 class="text-base font-semibold text-gray-900">Смена пароля</h3>
          <p class="mt-1 text-sm text-gray-500">Минимум 8 символов, используйте буквы и цифры.</p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <label class="block text-sm font-medium text-gray-700">
            Текущий пароль
            <input
              v-model="currentPassword"
              type="password"
              minlength="8"
              required
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              placeholder="Введите текущий пароль"
            />
          </label>

          <label class="block text-sm font-medium text-gray-700">
            Новый пароль
            <input
              v-model="newPassword"
              type="password"
              minlength="8"
              required
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
            role="presentation"
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
import { computed, reactive, ref } from "vue";

type Profile = {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  photoUrl: string | null;
};

const initialProfile: Profile = {
  firstName: "Имя",
  lastName: "Фамилия",
  birthDate: "1990-01-01",
  phone: "+992 90 123 45 67",
  email: "you@example.com",
  photoUrl: null,
};

const profile = reactive<Profile>({ ...initialProfile });
const isSaving = ref(false);
const photoError = ref<string | null>(null);
const maxBirthDate = new Date().toISOString().split("T")[0];
const photoInput = ref<HTMLInputElement | null>(null);
const currentPassword = ref("");
const newPassword = ref("");

const initials = computed(() => {
  const first = profile.firstName?.[0] ?? "";
  const last = profile.lastName?.[0] ?? "";
  const value = `${first}${last}`.trim();
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
  await new Promise((resolve) => setTimeout(resolve, 800));
  currentPassword.value = "";
  newPassword.value = "";
  isSaving.value = false;
};

const resetForm = () => {
  Object.assign(profile, initialProfile);
  photoError.value = null;
  currentPassword.value = "";
  newPassword.value = "";
};
</script>
