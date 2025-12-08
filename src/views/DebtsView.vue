<template>
  <DataTable
    title="Долги клиентов"
    description="Контроль задолженностей и статусов оплат"
    :headers="['Дата', 'Клиент', 'Товар', 'Сумма', 'Остаток', 'Статус']"
    :add-headers="['Дата', 'Клиент', 'Товар', 'Сумма', 'Статус']"
    :data="tableData"
    :is-manager-view="isManagerView"
    :status-options="statusOptions"
    default-status="Неоплачено"
    :partial-payment-enabled="true"
    :row-clickable="true"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
    @partial-payment="handlePartialPayment"
    @row-click="openPaymentHistory"
  />
  <PartialPaymentModal
    :is-open="showPartialPayment"
    title="Частичная оплата"
    :max-amount="selectedDebt?.remaining"
    :currency="selectedDebt?.currency"
    :client-name="selectedDebt?.client"
    :remaining-label="selectedDebt ? formatAmount(selectedDebt.remaining, selectedDebt.currency) : ''"
    @close="closePartialPayment"
    @confirm="confirmPartialPayment"
  />
  <PaymentHistoryModal
    :is-open="showPaymentHistory"
    :client-name="selectedDebt?.client"
    :total-amount="selectedDebt ? formatAmount(selectedDebt.total, selectedDebt.currency) : ''"
    :remaining-amount="selectedDebt ? formatAmount(selectedDebt.remaining, selectedDebt.currency) : ''"
    :payments="currentPayments"
    @close="closePaymentHistory"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import PartialPaymentModal from "../components/PartialPaymentModal.vue";
import PaymentHistoryModal from "../components/PaymentHistoryModal.vue";
import { getCurrentRole } from "../stores/auth";
import { useDebtsStore } from "../stores/debts";
import { storeToRefs } from "pinia";
import type { DebtStatus, Currency } from "../types";

const debtsStore = useDebtsStore();
const { debts } = storeToRefs(debtsStore);

const statusOptions = ["Неоплачено", "Частично оплачено", "Оплачено"];

const formatAmount = (value: number, currency: string): string =>
  `${value.toLocaleString("ru-RU")} ${currency}`;

const tableData = computed(() => {
  return debts.value.map((debt) => ({
    id: debt.id,
    Дата: debt.date,
    Клиент: debt.client,
    Товар: debt.product,
    Сумма: formatAmount(debt.totalAmount, debt.currency),
    Остаток: formatAmount(debt.remainingAmount, debt.currency),
    Статус: debt.status,
    original: debt,
    total: debt.totalAmount,
    remaining: debt.remainingAmount,
    currency: debt.currency,
    client: debt.client,
  }));
});

const selectedDebt = ref<any>(null);
const showPartialPayment = ref(false);
const showPaymentHistory = ref(false);
const currentPayments = ref<any[]>([]);

const isManagerView = computed(() => getCurrentRole() === "manager");

onMounted(() => {
  debtsStore.fetchDebts();
});

const parseAmount = (value: string) => {
  if (!value) return { amount: 0, currency: 'сом' as Currency };
  
  const trimmed = value.trim();
  const isDollar = trimmed.startsWith('$');
  const currency = isDollar ? '$' : 'сом';
  const amountStr = trimmed.replace(/[^\d.,]/g, '').replace(',', '.');
  
  return {
    amount: parseFloat(amountStr) || 0,
    currency: currency as Currency
  };
};

const handleAdd = async (data: Record<string, any>) => {
  try {
    const { amount, currency } = parseAmount(data['Сумма'] || '');
    
    if (!data['Дата'] || !data['Клиент'] || !data['Товар']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await debtsStore.createDebt({
      date: data['Дата'],
      client: data['Клиент'],
      product: data['Товар'],
      totalAmount: amount,
      remainingAmount: amount,
      currency,
      status: (data['Статус'] as DebtStatus) || 'Неоплачено'
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при создании");
  }
};

const handleEdit = async (data: Record<string, any>) => {
  try {
    const { amount, currency } = parseAmount(data['Сумма'] || '');
    const { amount: remainingAmount } = parseAmount(data['Остаток'] || '');
    const id = data.original?.id || data.id;
    
    if (!id) {
      alert('Ошибка: ID записи не найден');
      return;
    }
    
    if (!data['Дата'] || !data['Клиент'] || !data['Товар']) {
      alert('Заполните все обязательные поля');
      return;
    }

    await debtsStore.updateDebt(id, {
      date: data['Дата'],
      client: data['Клиент'],
      product: data['Товар'],
      totalAmount: amount,
      remainingAmount: remainingAmount || data.original?.remainingAmount || amount,
      currency,
      status: (data['Статус'] as DebtStatus) || 'Неоплачено'
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    await debtsStore.deleteDebt(row.original.id);
  } catch {
    alert("Ошибка при удалении");
  }
};

const handlePartialPayment = (row: Record<string, any>) => {
  selectedDebt.value = row;
  showPartialPayment.value = true;
};

const closePartialPayment = () => {
  showPartialPayment.value = false;
  selectedDebt.value = null;
};

const confirmPartialPayment = async (amount: number) => {
  if (!selectedDebt.value) return;

  try {
    await debtsStore.makePartialPayment(selectedDebt.value.original.id, {
      amount,
      currency: selectedDebt.value.currency,
      method: 'Наличные' as any,
      date: new Date().toISOString().split('T')[0]
    });
    closePartialPayment();
  } catch {
    alert("Ошибка при оплате");
  }
};

const openPaymentHistory = async (row: Record<string, any>) => {
  selectedDebt.value = row;
  showPaymentHistory.value = true;
  try {
    currentPayments.value = await debtsStore.getPaymentHistory(row.original.id);
  } catch {
    currentPayments.value = [];
  }
};

const closePaymentHistory = () => {
  showPaymentHistory.value = false;
};
</script>
