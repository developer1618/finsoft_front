<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img :src="logoUrl" alt="FinSoft" class="h-16 w-auto mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-white">Новый пароль</h1>
        <p class="mt-2 text-sm text-gray-400">
          Придумайте новый надёжный пароль
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="resetSuccess"
        class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircleIcon class="w-10 h-10 text-green-400" />
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">Пароль изменён!</h2>
        <p class="text-gray-300 mb-6">
          Ваш пароль успешно обновлён. Теперь вы можете войти в систему с новым паролем.
        </p>
        <RouterLink
          to="/login"
          class="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
        >
          Войти в систему
        </RouterLink>
      </div>

      <!-- Invalid Token Message -->
      <div
        v-else-if="tokenInvalid"
        class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <ExclamationTriangleIcon class="w-10 h-10 text-red-400" />
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">Ссылка недействительна</h2>
        <p class="text-gray-300 mb-6">
          Срок действия ссылки для сброса пароля истёк или она уже была использована.
        </p>
        <RouterLink
          to="/forgot-password"
          class="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
        >
          Запросить новую ссылку
        </RouterLink>
      </div>

      <!-- Form -->
      <form
        v-else
        @submit.prevent="handleSubmit"
        class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8"
      >
        <div class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Новый пароль
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="Минимум 6 символов"
                class="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-300" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-300" />
              </button>
            </div>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">
              Подтвердите пароль
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password_confirmation"
                v-model="passwordConfirmation"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Повторите пароль"
                class="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <p v-if="passwordMismatch" class="mt-2 text-sm text-red-400">
              Пароли не совпадают
            </p>
          </div>

          <div v-if="error" class="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p class="text-sm text-red-400">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading || passwordMismatch"
            class="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
            <span v-else>Сохранить пароль</span>
          </button>
        </div>

        <div class="mt-6 text-center">
          <RouterLink
            to="/login"
            class="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Вернуться к входу
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
  LockClosedIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import api from "../services/api";
import logoUrl from "../assets/finsoft-logo.svg";

const route = useRoute();

const password = ref("");
const passwordConfirmation = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");
const resetSuccess = ref(false);
const tokenInvalid = ref(false);

const token = computed(() => route.query.token as string);
const email = computed(() => route.query.email as string);

const passwordMismatch = computed(() => {
  return passwordConfirmation.value.length > 0 && password.value !== passwordConfirmation.value;
});

onMounted(() => {
  if (!token.value || !email.value) {
    tokenInvalid.value = true;
  }
});

const handleSubmit = async () => {
  if (password.value !== passwordConfirmation.value) {
    error.value = "Пароли не совпадают";
    return;
  }

  if (password.value.length < 6) {
    error.value = "Пароль должен содержать минимум 6 символов";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await api.post("/auth/reset-password", {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    resetSuccess.value = true;
  } catch (err: any) {
    if (err?.message?.includes("token") || err?.message?.includes("invalid")) {
      tokenInvalid.value = true;
    } else {
      error.value = err?.message || "Не удалось сбросить пароль. Попробуйте позже.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
