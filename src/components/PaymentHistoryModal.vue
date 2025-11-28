<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="handleClose"></div>
        <div
          class="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden mx-auto"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">История оплат</h3>
              <p v-if="clientName" class="text-sm text-gray-500">{{ clientName }}</p>
            </div>
            <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-7 h-7" />
            </button>
          </div>

          <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div class="space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Общая сумма</span>
                <span class="font-semibold text-gray-900">{{ totalAmountDisplay }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Текущий остаток</span>
                <span class="font-semibold text-gray-900">{{ remainingAmountDisplay }}</span>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg divide-y">
              <div
                v-for="(payment, idx) in payments"
                :key="idx"
                class="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ formatPaymentAmount(payment.amount, payment.currency) }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(payment.date) }}</p>
                </div>
                <span
                  class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                >
                  {{ payment.method }}
                </span>
              </div>
              <p v-if="!payments.length" class="px-4 py-5 text-sm text-gray-500 text-center">
                Еще нет частичных оплат.
              </p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "PaymentHistoryModal",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

interface PaymentEntry {
  date: string;
  amount: number;
  currency: string;
  method: string;
}

interface Props {
  isOpen: boolean;
  clientName?: string;
  totalAmount?: string;
  remainingAmount?: string;
  payments?: PaymentEntry[];
}

const props = withDefaults(defineProps<Props>(), {
  payments: () => [],
});

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => emit("close");

const totalAmountDisplay = computed(() => props.totalAmount ?? "―");
const remainingAmountDisplay = computed(() => props.remainingAmount ?? "―");

const formatPaymentAmount = (amount: number, currency: string) =>
  `${amount.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
</script>
