<template>
  <div>
    <div
      class="hidden bg-gray-900 ring-1 ring-white/10 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center justify-center mt-8 mb-8">
          <img :src="finsoftLogo" alt="FinSoft" class="h-16 w-auto" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <RouterLink
                    :to="item.href"
                    :class="[
                      item.current
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <RouterLink
                to="/admin/settings"
                :class="[
                  route.path === '/admin/settings'
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                ]"
              >
                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                Настройки
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Открыть боковую панель</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>

        <!-- FinSoft Logo -->
        <img :src="logoUrl" alt="FinSoft" class="h-8 w-auto lg:hidden" />

        <div
          class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-end"
        >
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <div
              class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            ></div>

            <Menu as="div" class="relative">
              <MenuButton class="relative flex items-center">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Открыть меню пользователя</span>
                <img
                  class="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
                  :src="userAvatar"
                  :alt="userName"
                />
                <span class="hidden lg:flex lg:items-center">
                  <span
                    class="ml-4 text-sm/6 font-semibold text-gray-900"
                    aria-hidden="true"
                    >{{ userName }}</span
                  >
                  <ChevronDownIcon
                    class="ml-2 size-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-gray-900/5"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <button
                      type="button"
                      @click="
                        item.action ? item.action() : router.push(item.href)
                      "
                      :class="[
                        active ? 'bg-gray-50 outline-hidden' : '',
                        'block w-full text-left px-3 py-1 text-sm/6 text-gray-900',
                      ]"
                    >
                      {{ item.name }}
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <div v-if="route.path === '/admin'">
            <div v-if="isSectionVisible('dashboard')" class="space-y-12">
              <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base/7 font-semibold text-gray-900">
                  Главная панель
                </h2>
                <p class="mt-1 text-sm/6 text-gray-600">
                  Обзор ключевых показателей вашего бизнеса
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-if="isSectionVisible('income-expense')"
                  @click="router.push('/admin/income-expense')"
                  class="bg-linear-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-lg font-medium text-gray-600">
                        Доход / Расход
                      </p>
                      <p class="text-2xl font-bold text-green-600 mt-2">
                        {{ incomeExpenseTotals.dollarLine }}
                      </p>
                      <p v-if="incomeExpenseTotals.somLine" class="text-xl font-bold text-green-600 mt-1">
                        {{ incomeExpenseTotals.somLine }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <BanknotesIcon class="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('chinese-cargo')"
                  @click="router.push('/admin/chinese-cargo')"
                  class="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-lg font-medium text-gray-600">
                        Китайские грузы
                      </p>
                      <p class="text-2xl font-bold text-orange-600 mt-2">
                        {{ cargoTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <TruckIcon class="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('varzob-expense')"
                  @click="router.push('/admin/varzob-expense')"
                  class="bg-linear-to-br from-rose-50 to-rose-100 rounded-lg shadow-md p-6 border-l-4 border-rose-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-lg font-medium text-gray-600">
                        Расход Варзоб
                      </p>
                      <p class="text-2xl font-bold text-rose-600 mt-2">
                        {{ varzobTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <ArrowTrendingDownIcon class="h-8 w-8 text-rose-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('capsule-workshop')"
                  @click="router.push('/admin/capsule-workshop')"
                  class="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-lg font-medium text-gray-600">
                        Цех капсулы
                      </p>
                      <p class="text-2xl font-bold text-blue-600 mt-2">
                        {{ capsuleTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <CubeIcon class="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('cup-workshop')"
                  @click="router.push('/admin/cup-workshop')"
                  class="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-lg font-medium text-gray-600">
                        Цех стакана
                      </p>
                      <p class="text-2xl font-bold text-purple-600 mt-2">
                        {{ cupTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <ArchiveBoxIcon class="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('warehouse')"
                  @click="router.push('/admin/warehouse')"
                  class="bg-linear-to-br from-teal-50 to-teal-100 rounded-lg shadow-md p-6 border-l-4 border-teal-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-lg font-medium text-gray-600">Склад цех</p>
                      <p class="text-2xl font-bold text-teal-600 mt-2">
                        {{ warehouseTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <BuildingStorefrontIcon class="h-8 w-8 text-teal-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('factory-warehouse')"
                  @click="router.push('/admin/factory-warehouse')"
                  class="bg-linear-to-br from-cyan-50 via-sky-50 to-cyan-100 rounded-lg shadow-md p-6 border-l-4 border-cyan-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-lg font-medium text-cyan-900">
                        Склад завод
                      </p>
                      <p class="text-2xl font-bold text-cyan-700 mt-2">
                        {{ factoryTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <BuildingOffice2Icon class="h-8 w-8 text-cyan-600" />
                    </div>
                  </div>
                </div>

                <div
                  v-if="isSectionVisible('debts')"
                  @click="router.push('/admin/debts')"
                  class="bg-linear-to-br from-rose-50 to-rose-100 rounded-lg shadow-md p-6 border-l-4 border-rose-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-lg font-medium text-gray-700">Долги</p>
                      <p class="text-2xl font-bold text-rose-600 mt-2">
                        {{ debtsTotals }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                      <DocumentCurrencyDollarIcon class="h-8 w-8 text-rose-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">
              Главная панель скрыта в настройках. Включите её, чтобы увидеть
              карточки.
            </p>
          </div>
          <RouterView v-else />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  Bars3Icon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentCurrencyDollarIcon,
  HomeIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";
import logoUrl from "../assets/finsoft-logo.svg";
import finsoftLogo from "../assets/finsoft-logo.svg";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { useAuth } from "../stores/auth";
import { useExpensesStore } from "../stores/expenses";
import { useDebtsStore } from "../stores/debts";
import { useWarehouseStore } from "../stores/warehouse";
import { useWorkshopsStore } from "../stores/workshops";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();

const userName = computed(() => {
  if (user.value) {
    return `${user.value.firstName} ${user.value.lastName}`;
  }
  return 'Пользователь';
});

const userAvatar = computed(() => {
  return user.value?.avatar || logoUrl;
});

const expensesStore = useExpensesStore();
const debtsStore = useDebtsStore();
const warehouseStore = useWarehouseStore();
const workshopsStore = useWorkshopsStore();

const { transactions, varzobExpenses } = storeToRefs(expensesStore);
const { debts } = storeToRefs(debtsStore);
const { items: warehouseItems, factoryItems } = storeToRefs(warehouseStore);
const { cargoItems, capsuleItems, cupItems } = storeToRefs(workshopsStore);

const formatNum = (n: number) => n.toLocaleString('ru-RU');

const incomeExpenseTotals = computed(() => {
  if (!transactions.value.length) {
    return { dollarLine: 'Нет данных', somLine: '' };
  }
  const incomeDollar = transactions.value
    .filter(t => t.type === 'Доход' && t.currency === '$')
    .reduce((sum, t) => sum + t.amount, 0);
  const incomeSom = transactions.value
    .filter(t => t.type === 'Доход' && t.currency === 'сом')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseDollar = transactions.value
    .filter(t => t.type === 'Расход' && t.currency === '$')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseSom = transactions.value
    .filter(t => t.type === 'Расход' && t.currency === 'сом')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    dollarLine: `${formatNum(incomeDollar)} $ / ${formatNum(expenseDollar)} $`,
    somLine: `${formatNum(incomeSom)} сом / ${formatNum(expenseSom)} сом`
  };
});

const cargoTotals = computed(() => {
  if (!cargoItems.value.length) return 'Нет данных';
  const totalKg = cargoItems.value.reduce((sum, c) => sum + c.weight, 0);
  const count = cargoItems.value.length;
  return `${formatNum(totalKg)} кг / ${formatNum(count)} шт`;
});

const varzobTotals = computed(() => {
  if (!varzobExpenses.value.length) return 'Нет данных';
  const totalSom = varzobExpenses.value
    .filter(e => e.currency === 'сом')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalDollar = varzobExpenses.value
    .filter(e => e.currency === '$')
    .reduce((sum, e) => sum + e.amount, 0);
  return `${formatNum(totalSom)} сом / ${formatNum(totalDollar)} $`;
});

const capsuleTotals = computed(() => {
  if (!capsuleItems.value.length) return 'Нет данных';
  const total = capsuleItems.value.reduce((sum, item) => sum + item.quantity, 0);
  return `${formatNum(total)} шт`;
});

const cupTotals = computed(() => {
  if (!cupItems.value.length) return 'Нет данных';
  const total = cupItems.value.reduce((sum, item) => sum + item.quantity, 0);
  return `${formatNum(total)} шт`;
});

const warehouseTotals = computed(() => {
  if (!warehouseItems.value.length) return 'Нет данных';
  const total = warehouseItems.value.reduce((sum, i) => sum + i.quantity, 0);
  return `${formatNum(total)} шт`;
});

const factoryTotals = computed(() => {
  if (!factoryItems.value.length) return 'Нет данных';
  const totalKg = factoryItems.value
    .filter(i => i.unit === 'кг')
    .reduce((sum, i) => sum + i.quantity, 0);
  const totalPcs = factoryItems.value
    .filter(i => i.unit === 'шт')
    .reduce((sum, i) => sum + i.quantity, 0);
  return `${formatNum(totalKg)} кг / ${formatNum(totalPcs)} шт`;
});

const debtsTotals = computed(() => {
  if (!debts.value.length) return 'Нет данных';
  const totalSom = debts.value
    .filter(d => d.currency === 'сом')
    .reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalDollar = debts.value
    .filter(d => d.currency === '$')
    .reduce((sum, d) => sum + d.remainingAmount, 0);
  return `${formatNum(totalSom)} сом / ${formatNum(totalDollar)} $`;
});

const MENU_VISIBILITY_KEY = "finsoft_menu_visibility";
const MENU_VISIBILITY_EVENT = "menu-visibility-changed";

type NavItem = {
  id: string;
  name: string;
  href: string;
  icon: any;
};

const navigationBase: NavItem[] = [
  { id: "dashboard", name: "Главная", href: "/admin", icon: HomeIcon },
  {
    id: "income-expense",
    name: "Доход / Расход",
    href: "/admin/income-expense",
    icon: BanknotesIcon,
  },
  {
    id: "varzob-expense",
    name: "Расход Варзоб",
    href: "/admin/varzob-expense",
    icon: ArrowTrendingDownIcon,
  },
  {
    id: "chinese-cargo",
    name: "Китайские грузы",
    href: "/admin/chinese-cargo",
    icon: TruckIcon,
  },
  {
    id: "capsule-workshop",
    name: "Цех капсулы",
    href: "/admin/capsule-workshop",
    icon: CubeIcon,
  },
  {
    id: "cup-workshop",
    name: "Цех стакана",
    href: "/admin/cup-workshop",
    icon: ArchiveBoxIcon,
  },
  {
    id: "warehouse",
    name: "Склад цех",
    href: "/admin/warehouse",
    icon: BuildingStorefrontIcon,
  },
  {
    id: "factory-warehouse",
    name: "Склад завод",
    href: "/admin/factory-warehouse",
    icon: BuildingOffice2Icon,
  },
  {
    id: "debts",
    name: "Долги",
    href: "/admin/debts",
    icon: DocumentCurrencyDollarIcon,
  },
];

const visibilityIds = [
  "dashboard",
  "income-expense",
  "varzob-expense",
  "chinese-cargo",
  "capsule-workshop",
  "cup-workshop",
  "warehouse",
  "factory-warehouse",
  "debts",
];

const defaultVisibility = visibilityIds.reduce<Record<string, boolean>>(
  (acc, id) => ({ ...acc, [id]: true }),
  {}
);

const menuVisibility = ref<Record<string, boolean>>({ ...defaultVisibility });

const isSectionVisible = (id: string) => menuVisibility.value[id] ?? true;

const navigation = computed(() =>
  navigationBase
    .filter((item) => isSectionVisible(item.id))
    .map((item) => ({
      ...item,
      current: route.path === item.href,
    }))
);

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

const handleVisibilityEvent = (event: Event) => {
  const detail = (event as CustomEvent<Record<string, boolean>>).detail;
  if (detail) {
    menuVisibility.value = { ...defaultVisibility, ...detail };
  }
};

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

const userNavigation = [
  { name: "Профиль", href: "/admin/profile" },
  { name: "Выход", href: "/login", action: handleLogout },
];

const sidebarOpen = ref(false);

onMounted(() => {
  loadVisibility();
  if (typeof window !== "undefined") {
    window.addEventListener(MENU_VISIBILITY_EVENT, handleVisibilityEvent);
  }
  
  expensesStore.fetchTransactions();
  expensesStore.fetchVarzobExpenses();
  debtsStore.fetchDebts();
  warehouseStore.fetchItems();
  warehouseStore.fetchFactoryItems();
  workshopsStore.fetchCargo();
  workshopsStore.fetchCapsuleItems();
  workshopsStore.fetchCupItems();
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener(MENU_VISIBILITY_EVENT, handleVisibilityEvent);
  }
});
</script>
