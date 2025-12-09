<template>
  <div class="space-y-8">

    <!-- Таблица операций -->
    <DataTable
      title="Кассовые операции"
      description="История всех кассовых операций"
      :headers="['Дата', 'Сумма в сом', 'Сумма в $']"
      :data="tableData"
      :is-manager-view="isManagerView"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import { getCurrentRole } from "../stores/auth";
import { useCashierStore } from "../stores/cashier";
import { storeToRefs } from "pinia";
import { Currency } from "../types";

const cashierStore = useCashierStore();
const { operations } = storeToRefs(cashierStore);

const formatNum = (n: number) => n.toLocaleString("ru-RU");

const tableData = computed(() => {
  return operations.value.map((op) => ({
    id: op.id,
    Дата: op.date,
    "Сумма в сом": op.currency === Currency.TJS ? formatNum(op.amount) : "",
    "Сумма в $": op.currency === Currency.USD ? formatNum(op.amount) : "",
    original: op,
  }));
});

const isManagerView = computed(() => getCurrentRole() === "manager");

const parseAmount = (somValue: any, usdValue: any): { amount: number; currency: Currency } => {
  // Handle number or string input
  const somNum = typeof somValue === 'number' ? somValue : parseFloat(String(somValue || '').replace(/\s/g, "").replace(",", ".")) || 0;
  const usdNum = typeof usdValue === 'number' ? usdValue : parseFloat(String(usdValue || '').replace(/\s/g, "").replace(",", ".")) || 0;
  
  if (somNum > 0) {
    return { amount: somNum, currency: Currency.TJS };
  }
  if (usdNum > 0) {
    return { amount: usdNum, currency: Currency.USD };
  }
  return { amount: 0, currency: Currency.TJS };
};

const handleAdd = async (data: Record<string, any>) => {
  try {
    const { amount, currency } = parseAmount(data["Сумма в сом"], data["Сумма в $"]);
    
    if (!data["Дата"] || !amount) {
      alert("Заполните дату и одну из сумм");
      return;
    }

    await cashierStore.createOperation({
      date: data["Дата"],
      type: "Приход",
      amount,
      currency,
      description: "",
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при создании");
  }
};

const handleEdit = async (data: Record<string, any>) => {
  try {
    const id = data.original?.id || data.id;
    const { amount, currency } = parseAmount(data["Сумма в сом"], data["Сумма в $"]);

    if (!id) {
      alert("Ошибка: ID записи не найден");
      return;
    }

    if (!data["Дата"] || !amount) {
      alert("Заполните дату и одну из сумм");
      return;
    }

    await cashierStore.updateOperation(id, {
      date: data["Дата"],
      type: data.original?.type || "Приход",
      amount,
      currency,
      description: data.original?.description || "",
    });
  } catch (e: any) {
    alert(e?.message || "Ошибка при обновлении");
  }
};

const handleDelete = async (row: Record<string, any>) => {
  try {
    const id = row.original?.id || row.id;
    await cashierStore.deleteOperation(id);
  } catch {
    alert("Ошибка при удалении");
  }
};

onMounted(() => {
  cashierStore.fetchOperations();
});
</script>
