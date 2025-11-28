<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="handleClose"></div>
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
        >
          <div
            class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
          >
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="px-6 py-5 space-y-4">
            <div class="text-sm text-gray-600">
              <p v-if="clientName">
                <span class="font-medium text-gray-900">Клиент:</span>
                {{ clientName }}
              </p>
              <p>
                <span class="font-medium text-gray-900">Доступно к оплате:</span>
                {{ remainingDisplay }}
              </p>
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700" for="partial-amount">
                Сумма частичной оплаты
              </label>
              <div class="flex items-center gap-3">
                <input
                  id="partial-amount"
                  v-model="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Введите сумму"
                  class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  @keyup.enter="handleConfirm"
                />
                <span class="text-sm font-medium text-gray-600">
                  {{ currencyLabel }}
                </span>
              </div>
              <p v-if="errorMessage" class="text-sm text-red-600">
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 justify-end border-t border-gray-200 px-6 py-4">
            <button
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "PartialPaymentModal",
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

interface Props {
  isOpen: boolean;
  title: string;
  maxAmount?: number;
  currency?: string;
  clientName?: string;
  remainingLabel?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  confirm: [amount: number];
}>();

const amount = ref<string>("");
const errorMessage = ref<string>("");

const resetState = () => {
  amount.value = "";
  errorMessage.value = "";
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetState();
    }
  }
);

const currencyLabel = computed(() => props.currency ?? "TJS");

const remainingDisplay = computed(() => {
  if (props.remainingLabel) {
    return props.remainingLabel;
  }
  if (typeof props.maxAmount === "number") {
    return `${props.maxAmount.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currencyLabel.value}`;
  }
  return "0";
});

const handleClose = () => {
  emit("close");
};

const handleConfirm = () => {
  const numericAmount = Number(amount.value);
  if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    errorMessage.value = "Введите сумму больше нуля";
    return;
  }

  if (
    typeof props.maxAmount === "number" &&
    numericAmount > props.maxAmount + 1e-6
  ) {
    errorMessage.value = "Сумма не может превышать доступный остаток";
    return;
  }

  emit("confirm", Number(numericAmount.toFixed(2)));
};
</script>
