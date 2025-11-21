<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
    <header class="bg-white shadow-sm px-4 py-5 sm:px-6">
      <div class="flex items-center justify-between gap-4">
        <div class="relative">
          <img
            v-if="user?.avatar"
            :src="user.avatar"
            :alt="`${user.firstName} ${user.lastName}`"
            class="size-16 rounded-xl object-cover shadow-sm"
          />
          <div
            v-else
            class="size-16 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-semibold"
          >
            {{ initials }}
          </div>
          <span
            class="absolute -bottom-1 -right-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 shadow"
          >
            Онлайн
          </span>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500">Менеджер</p>
          <h1 class="text-xl font-semibold text-gray-900">
            {{ user?.firstName }} {{ user?.lastName }}
          </h1>
          <p class="text-sm text-gray-500">Добро пожаловать в FinSoft</p>
        </div>
        <button
          type="button"
          @click="handleLogout"
          class="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Выйти
        </button>
      </div>
    </header>

    <main class="px-4 sm:px-6 pt-6 space-y-6">
      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-4">
        <h2 class="text-sm font-semibold text-gray-500">Ключевые показатели</h2>
        <div class="mt-4 grid grid-cols-1 gap-4">
          <RouterLink
            v-for="card in cards"
            :key="card.id"
            :to="card.route"
            class="flex items-center justify-between rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-slate-50 px-4 py-4 shadow-xs transition hover:-translate-y-0.5 hover:border-indigo-100"
          >
            <div>
              <p class="text-sm text-gray-500">{{ card.title }}</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">
                {{ card.value }}
              </p>
              <p class="mt-1 text-xs text-gray-400">Нажмите, чтобы открыть таблицу</p>
            </div>
            <div class="text-4xl">{{ card.icon }}</div>
          </RouterLink>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-4">
        <h2 class="text-sm font-semibold text-gray-500">Быстрые действия</h2>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <RouterLink
            v-for="quick in quickLinks"
            :key="quick.id"
            :to="quick.route"
            class="flex flex-col rounded-xl border border-gray-100 px-3 py-4 text-center text-sm font-medium text-gray-700 transition hover:border-indigo-200"
          >
            <span class="text-xl">{{ quick.icon }}</span>
            <span class="mt-2">{{ quick.title }}</span>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "../stores/auth";

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};

const initials = computed(() => {
  const first = user.value?.firstName?.[0] ?? "";
  const last = user.value?.lastName?.[0] ?? "";
  const result = `${first}${last}`.trim();
  return result || "M";
});

const cards = [
  {
    id: "income-expense",
    title: "Доход / Расход",
    value: "$45,250 / $28,750",
    icon: "💵",
    route: "/manager/income-expense",
  },
  {
    id: "chinese-cargo",
    title: "Китайские грузы",
    value: "1,248 кг",
    icon: "📦",
    route: "/manager/chinese-cargo",
  },
  {
    id: "varzob-expense",
    title: "Расход Варзоб",
    value: "72 000 TJS",
    icon: "🧾",
    route: "/manager/varzob-expense",
  },
  {
    id: "capsule-workshop",
    title: "Цех капсулы",
    value: "856 шт",
    icon: "⚙️",
    route: "/manager/capsule-workshop",
  },
  {
    id: "cup-workshop",
    title: "Цех стакана",
    value: "1,234 шт",
    icon: "🥤",
    route: "/manager/cup-workshop",
  },
  {
    id: "warehouse",
    title: "Склад цех",
    value: "320 позиций",
    icon: "📊",
    route: "/manager/warehouse",
  },
  {
    id: "factory-warehouse",
    title: "Склад завод",
    value: "12 тонн",
    icon: "🏭",
    route: "/manager/factory-warehouse",
  },
];

const quickLinks = [
  { id: "profile", title: "Профиль", icon: "👤", route: "/manager/profile" },
  { id: "reports", title: "Отчёты", icon: "📈", route: "/manager/reports" },
  { id: "settings", title: "Настройки", icon: "⚙️", route: "/manager/settings" },
  { id: "support", title: "Поддержка", icon: "💬", route: "/manager/reports" },
];
</script>
