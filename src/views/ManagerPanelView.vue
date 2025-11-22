<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
    <header class="bg-white shadow-sm px-4 py-5 sm:px-6">
      <div class="flex items-center justify-between gap-4">
        <RouterLink
          to="/manager/profile"
          class="flex items-center gap-4 flex-1 cursor-pointer hover:opacity-80 transition-opacity rounded-lg px-3 py-2 hover:bg-slate-50"
        >
          <img
            :src="logoUrl"
            alt="FinSoft"
            class="h-12 w-auto rounded-lg shadow-sm"
          />
          <div>
            <h2 class="text-lg text-gray-900">
              {{ user?.firstName }} {{ user?.lastName }}
            </h2>
            <p class="text-xs font-semibold text-gray-500">Добро пожаловать!</p>
          </div>
        </RouterLink>
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
      <div v-if="isOnDashboard">
        <section
          class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-4"
        >
          <h2 class="text-sm font-semibold text-gray-500">
            Ключевые показатели
          </h2>
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
                <p class="mt-1 text-xs text-gray-400">
                  Нажмите, чтобы открыть таблицу
                </p>
              </div>
              <div class="text-4xl">{{ card.icon }}</div>
            </RouterLink>
          </div>
        </section>
      </div>

      <RouterView v-else />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAuth } from "../stores/auth";
import logoUrl from "../assets/amir.jpeg";

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();

const isOnDashboard = computed(() => route.path === "/manager");

const handleLogout = () => {
  logout();
  router.push("/login");
};

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
</script>
