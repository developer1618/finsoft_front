<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import api from "../services/api";
import logoUrl from "../assets/finsoft-logo.svg";

const email = ref("");
const loading = ref(false);
const error = ref("");
const emailSent = ref(false);
const countdown = ref(0);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdown.value = 60;
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval!);
    }
  }, 1000);
};

const handleSubmit = async () => {
  if (!email.value) {
    error.value = "Введите email адрес";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await api.post("/auth/forgot-password", { email: email.value });
    emailSent.value = true;
    startCountdown();
  } catch (err: any) {
    error.value = err?.message || "Не удалось отправить письмо. Попробуйте позже.";
  } finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <img
        :src="logoUrl"
        alt="FinSoft"
        class="mx-auto h-16 w-auto"
      />
      <h2
        class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-blue-900"
      >
        Восстановление пароля
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Введите email для получения ссылки на сброс пароля
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <!-- Success Message -->
      <div
        v-if="emailSent"
        class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12 text-center"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Письмо отправлено!</h3>
        <p class="text-gray-600 mb-6">
          Мы отправили ссылку для сброса пароля на <strong class="text-gray-900">{{ email }}</strong>. 
          Проверьте свою почту и следуйте инструкциям.
        </p>
        <p class="text-sm text-gray-500 mb-6">
          Не получили письмо? Проверьте папку "Спам" или попробуйте снова через 
          <span v-if="countdown > 0" class="text-indigo-600 font-medium">{{ countdown }} сек.</span>
          <button v-else @click="handleSubmit" class="text-indigo-600 hover:text-indigo-500 font-semibold">
            отправить повторно
          </button>
        </p>
        <RouterLink
          to="/login"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          ← Вернуться к входу
        </RouterLink>
      </div>

      <!-- Form -->
      <div v-else class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Email адрес</label
            >
            <div class="mt-2">
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                required
                placeholder="example@email.com"
                class="block w-full items-center w-full h-12 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <p v-if="error" class="text-sm text-rose-600">
            {{ error }}
          </p>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="flex items-center w-full h-12 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
            >
              {{ loading ? "Отправка..." : "Отправить ссылку" }}
            </button>
          </div>

          <div class="text-center">
            <RouterLink
              to="/login"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              ← Вернуться к входу
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
