<template>
  <DataTable
    title="Долги клиентов"
    description="Контроль задолженностей и статусов оплат"
    :headers="['Дата', 'Клиент', 'Товар', 'Сумма', 'Остаток', 'Статус']"
    :data="tableData"
    :is-manager-view="isManagerView"
    :status-options="statusOptions"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
    @partial-payment="handlePartialPayment"
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DataTable from "../components/DataTable.vue";
import PartialPaymentModal from "../components/PartialPaymentModal.vue";
import { getCurrentRole } from "../stores/auth";

const statusOptions = ["Неоплачено", "Частично оплачено", "Оплачено"];

type DebtRecord = {
  Дата: string;
  Клиент: string;
  Товар: string;
  Сумма: string;
  Остаток: string;
  Статус: string;
  total: number;
  remaining: number;
  currency: string;
  client: string;
};

const parseAmount = (value: string): { amount: number; currency: string } => {
  const match = value.match(/([\d\s.,]+)/);
  const currencyMatch = value.replace(match?.[0] ?? "", "").trim() || "TJS";
  const amount = Number((match?.[0] ?? "0").replace(/\s/g, "").replace(",", "."));
  return {
    amount: Number.isNaN(amount) ? 0 : amount,
    currency: currencyMatch || "TJS",
  };
};

const formatAmount = (value: number, currency: string): string =>
  `${value.toLocaleString("ru-RU")} ${currency}`;

const seedTableData = (): DebtRecord[] => {
  const raw = [
    {
      Дата: "2025-11-16",
      Клиент: "ООО 'ВостокТрейд'",
      Товар: "Линейка ПЭТ-тар",
      Сумма: "75 000 TJS",
      Остаток: "75 000 TJS",
      Статус: "Неоплачено",
    },
    {
      Дата: "2025-11-14",
      Клиент: "ИП Сайфутдинов",
      Товар: "Крышки Twist-off",
      Сумма: "42 500 TJS",
      Остаток: "17 500 TJS",
      Статус: "Частично оплачено",
    },
    {
      Дата: "2025-11-10",
      Клиент: "ООО 'Логистик Плюс'",
      Товар: "Фитинги для линий",
      Сумма: "18 300 TJS",
      Остаток: "8 300 TJS",
      Статус: "Частично оплачено",
    },
    {
      Дата: "2025-11-05",
      Клиент: "Завод 'АлюминТадж'",
      Товар: "Композитные бочки",
      Сумма: "120 000 TJS",
      Остаток: "120 000 TJS",
      Статус: "Неоплачено",
    },
    {
      Дата: "2025-10-28",
      Клиент: "ООО 'ГрандИмпорт'",
      Товар: "Партия капсул 0.5 л",
      Сумма: "53 400 TJS",
      Остаток: "0 TJS",
      Статус: "Оплачено",
    },
  ];

  return raw.map((item) => {
    const { amount, currency } = parseAmount(item.Сумма);
    const { amount: remainingAmount } = parseAmount(item.Остаток);
    return {
      ...item,
      total: amount,
      remaining: remainingAmount,
      currency,
      client: item.Клиент,
    };
  });
};

const tableData = ref<DebtRecord[]>(seedTableData());
const selectedDebt = ref<DebtRecord | null>(null);
const showPartialPayment = ref(false);

const isManagerView = computed(() => getCurrentRole() === "manager");

const handleAdd = () => {
  alert("Добавление новой задолженности: здесь появится форма добавления");
};

const handleEdit = (row: Record<string, any>) => {
  alert(`Редактирование долга: ${JSON.stringify(row)}`);
};

const handleDelete = (row: Record<string, any>) => {
  const index = tableData.value.findIndex((item) => item === row);
  if (index > -1) {
    tableData.value.splice(index, 1);
  }
};

const handlePartialPayment = (row: DebtRecord) => {
  selectedDebt.value = row;
  showPartialPayment.value = true;
};

const closePartialPayment = () => {
  showPartialPayment.value = false;
  selectedDebt.value = null;
};

const confirmPartialPayment = (amount: number) => {
  if (!selectedDebt.value) {
    return;
  }

  const updatedRemaining = Math.max(selectedDebt.value.remaining - amount, 0);
  selectedDebt.value.remaining = Number(updatedRemaining.toFixed(2));
  selectedDebt.value.Остаток = formatAmount(selectedDebt.value.remaining, selectedDebt.value.currency);

  if (selectedDebt.value.remaining <= 0) {
    selectedDebt.value.Статус = "Оплачено";
  } else if (selectedDebt.value.remaining < selectedDebt.value.total) {
    selectedDebt.value.Статус = "Частично оплачено";
  }

  closePartialPayment();
};
</script>
