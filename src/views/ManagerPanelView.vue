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
              :class="[
                'flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br',
                card.bgClass,
                card.borderClass,
              ]"
            >
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ card.title }}
                </p>
                <p :class="['mt-2 text-2xl font-semibold', card.valueClass]">
                  {{ card.value }}
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  {{ card.subtitle }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <component :is="card.icon" class="h-8 w-8" :class="card.iconClass" />
              </div>
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
import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  CubeIcon,
  DocumentCurrencyDollarIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";

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
    subtitle: "Финансовый отчёт",
    icon: BanknotesIcon,
    iconClass: "text-green-600",
    route: "/manager/income-expense",
    bgClass: "from-green-50 to-green-100",
    borderClass: "border-green-500",
    valueClass: "text-green-600",
  },
  {
    id: "varzob-expense",
    title: "Расход Варзоб",
    value: "72 000 TJS",
    subtitle: "Контроль затрат",
    icon: ArrowTrendingDownIcon,
    iconClass: "text-rose-600",
    route: "/manager/varzob-expense",
    bgClass: "from-rose-50 to-rose-100",
    borderClass: "border-rose-500",
    valueClass: "text-rose-600",
  },
  {
    id: "chinese-cargo",
    title: "Китайские грузы",
    value: "1,248 кг",
    subtitle: "Статусы поставок",
    icon: TruckIcon,
    iconClass: "text-orange-600",
    route: "/manager/chinese-cargo",
    bgClass: "from-orange-50 to-orange-100",
    borderClass: "border-orange-500",
    valueClass: "text-orange-600",
  },
  {
    id: "capsule-workshop",
    title: "Цех капсулы",
    value: "856 шт",
    subtitle: "Производство капсул",
    icon: CubeIcon,
    iconClass: "text-blue-600",
    route: "/manager/capsule-workshop",
    bgClass: "from-blue-50 to-blue-100",
    borderClass: "border-blue-500",
    valueClass: "text-blue-600",
  },
  {
    id: "cup-workshop",
    title: "Цех стакана",
    value: "1,234 шт",
    subtitle: "Выпуск стаканов",
    icon: ArchiveBoxIcon,
    iconClass: "text-purple-600",
    route: "/manager/cup-workshop",
    bgClass: "from-purple-50 to-purple-100",
    borderClass: "border-purple-500",
    valueClass: "text-purple-600",
  },
  {
    id: "warehouse",
    title: "Склад цех",
    value: "320 позиций",
    subtitle: "Остатки на складе",
    icon: BuildingStorefrontIcon,
    iconClass: "text-teal-600",
    route: "/manager/warehouse",
    bgClass: "from-teal-50 to-teal-100",
    borderClass: "border-teal-500",
    valueClass: "text-teal-600",
  },
  {
    id: "factory-warehouse",
    title: "Склад завод",
    value: "12 тонн",
    subtitle: "Запасы сырья",
    icon: BuildingOffice2Icon,
    iconClass: "text-cyan-600",
    route: "/manager/factory-warehouse",
    bgClass: "from-cyan-50 via-sky-50 to-cyan-100",
    borderClass: "border-cyan-500",
    valueClass: "text-cyan-700",
  },
  {
    id: "debts",
    title: "Долги",
    value: "95 000 сом / 16 000 $",
    subtitle: "Управление задолженностями",
    icon: DocumentCurrencyDollarIcon,
    iconClass: "text-rose-600",
    route: "/manager/debts",
    bgClass: "from-rose-50 to-rose-100",
    borderClass: "border-rose-500",
    valueClass: "text-rose-600",
  },
];
</script>
