<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogin = () => {
  router.push("/admin");
};
</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-blue-900"
      >
        FinSoft - Автоматизация бизнеса
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Логин</label
            >
            <div class="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                required=""
                placeholder="Введите ваш логин"
                class="block w-full items-center w-full h-12 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
              >Пароль</label
            >
            <div class="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autocomplete="current-password"
                required=""
                placeholder="Введите ваш пароль"
                class="block w-full items-center w-full h-12 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex gap-3">
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 grid-cols-1">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                  />
                  <svg
                    class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      class="opacity-0 group-has-checked:opacity-100"
                      d="M3 8L6 11L11 3.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      class="opacity-0 group-has-indeterminate:opacity-100"
                      d="M3 7H11"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <label for="remember-me" class="block text-sm/6 text-gray-900"
                >Запомнить меня</label
              >
            </div>

            <div class="text-sm/6">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Забыл пароль?</a
              >
            </div>
          </div>

          <div>
            <button
              type="button"
              @click="handleLogin"
              class="flex items-center w-full h-12 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
