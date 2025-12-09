<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
    <header class="bg-white shadow-sm px-4 py-5 sm:px-6">
      <div class="flex items-center justify-between gap-4">
        <RouterLink
          to="/manager/profile"
          class="flex items-center gap-4 flex-1 cursor-pointer hover:opacity-80 transition-opacity rounded-lg px-3 py-2 hover:bg-slate-50"
        >
          <img
            :src="userAvatar"
            alt="FinSoft"
            class="h-12 w-auto rounded-lg shadow-sm"
          />
          <div>
            <h2 class="text-lg text-gray-900">
              {{ userName }}
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
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Доход / Расход -->
            <RouterLink
              to="/manager/income-expense"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-green-50 to-green-100 border-green-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Доход / Расход</p>
                <p class="mt-2 text-2xl font-semibold text-green-600">
                  {{ incomeExpenseTotals.dollarLine }}
                </p>
                <p v-if="incomeExpenseTotals.somLine" class="mt-1 text-xl font-semibold text-green-600">
                  {{ incomeExpenseTotals.somLine }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <BanknotesIcon class="h-8 w-8 text-green-600" />
              </div>
            </RouterLink>

            <!-- Расход Варзоб -->
            <RouterLink
              to="/manager/varzob-expense"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-rose-50 to-rose-100 border-rose-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Расход Варзоб</p>
                <p class="mt-2 text-2xl font-semibold text-rose-600">
                  {{ varzobTotals }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <ArrowTrendingDownIcon class="h-8 w-8 text-rose-600" />
              </div>
            </RouterLink>

            <!-- Китайские грузы -->
            <RouterLink
              to="/manager/chinese-cargo"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-orange-50 to-orange-100 border-orange-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Китайские грузы</p>
                <p class="mt-2 text-2xl font-semibold text-orange-600">
                  {{ cargoTotals }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <TruckIcon class="h-8 w-8 text-orange-600" />
              </div>
            </RouterLink>

            <!-- Цех капсулы -->
            <RouterLink
              to="/manager/capsule-workshop"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-blue-50 to-blue-100 border-blue-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Цех капсулы</p>
                <p class="mt-2 text-2xl font-semibold text-blue-600">
                  {{ capsuleTotals }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <CubeIcon class="h-8 w-8 text-blue-600" />
              </div>
            </RouterLink>

            <!-- Цех стакана -->
            <RouterLink
              to="/manager/cup-workshop"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-purple-50 to-purple-100 border-purple-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600">Цех стакана</p>
                <p class="mt-2 text-2xl font-semibold text-purple-600">
                  {{ cupTotals }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <ArchiveBoxIcon class="h-8 w-8 text-purple-600" />
              </div>
            </RouterLink>

            <!-- Склад завод -->
            <RouterLink
              to="/manager/factory-warehouse"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-cyan-50 via-sky-50 to-cyan-100 border-cyan-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-cyan-900">Склад завод</p>
                <p class="mt-2 text-2xl font-semibold text-cyan-700">
                  {{ factoryTotals }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <BuildingOffice2Icon class="h-8 w-8 text-cyan-600" />
              </div>
            </RouterLink>

            <!-- Долги -->
            <RouterLink
              to="/manager/debts"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-red-50 to-red-100 border-red-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-700">Долги</p>
                <p class="mt-2 text-2xl font-semibold text-red-600">
                  {{ debtsTotals }}
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <DocumentCurrencyDollarIcon class="h-8 w-8 text-red-600" />
              </div>
            </RouterLink>

            <!-- Касса -->
            <RouterLink
              to="/manager/cashier"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-amber-50 to-amber-100 border-amber-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-700">Касса</p>
                <p class="mt-2 text-2xl font-semibold text-amber-600">
                  Управление
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <CalculatorIcon class="h-8 w-8 text-amber-600" />
              </div>
            </RouterLink>

            <!-- Товары -->
            <RouterLink
              to="/manager/products"
              class="flex items-center justify-between rounded-2xl border-l-4 px-4 py-4 shadow-md transition hover:shadow-lg hover:scale-[1.02] bg-linear-to-br from-indigo-50 to-indigo-100 border-indigo-500"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-700">Товары</p>
                <p class="mt-2 text-2xl font-semibold text-indigo-600">
                  Справочник
                </p>
              </div>
              <div class="rounded-xl bg-white/70 p-3 shadow-sm">
                <ShoppingBagIcon class="h-8 w-8 text-indigo-600" />
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
import { computed, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { useAuth } from "../stores/auth";
import { useExpensesStore } from "../stores/expenses";
import { useDebtsStore } from "../stores/debts";
import { useWarehouseStore } from "../stores/warehouse";
import { useWorkshopsStore } from "../stores/workshops";
import { storeToRefs } from "pinia";
import logoUrl from "../assets/finsoft-logo.svg";
import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  CalculatorIcon,
  CubeIcon,
  DocumentCurrencyDollarIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
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

const isOnDashboard = computed(() => route.path === "/manager");

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

const expensesStore = useExpensesStore();
const debtsStore = useDebtsStore();
const warehouseStore = useWarehouseStore();
const workshopsStore = useWorkshopsStore();

const { transactions, varzobExpenses } = storeToRefs(expensesStore);
const { debts } = storeToRefs(debtsStore);
const { factoryItems } = storeToRefs(warehouseStore);
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

onMounted(() => {
  expensesStore.fetchTransactions();
  expensesStore.fetchVarzobExpenses();
  debtsStore.fetchDebts();
  warehouseStore.fetchItems();
  warehouseStore.fetchFactoryItems();
  workshopsStore.fetchCargo();
  workshopsStore.fetchCapsuleItems();
  workshopsStore.fetchCupItems();
});
</script>
