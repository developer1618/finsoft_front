<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/50" @click="close"></div>
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
        >
          <div
            class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
          >
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div v-for="header in headers" :key="header" class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                {{ header }}
              </label>
              <FlatPickr
                v-if="header === 'Дата'"
                v-model="formData[header]"
                :config="datePickerConfig"
                @input="(event: InputEvent) => handleDateMaskInput(event, header)"
                placeholder="дд.мм.гггг"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <select
                v-else-if="header === 'Статус'"
                v-model="formData[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option
                  v-for="status in normalizedStatusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
              <select
                v-else-if="header === 'Тип'"
                v-model="formData[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="Доход">Доход</option>
                <option value="Расход">Расход</option>
              </select>
              <div v-else-if="header === 'Количество'" class="space-y-2">
                <div class="flex gap-3">
                  <input
                    v-model="quantityValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Введите число"
                    class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                  <select
                    v-model="quantityUnit"
                    class="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  >
                    <option v-for="unit in quantityUnits" :key="unit" :value="unit">
                      {{ unit }}
                    </option>
                  </select>
                </div>
              </div>
              <select
                v-else-if="header === 'Расположение'"
                v-model="formData[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option v-for="option in warehouseLocations" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <div v-else-if="header === 'Сумма'" class="space-y-2">
                <div class="flex gap-3">
                  <input
                    v-model="sumValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Введите сумму"
                    class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                  <select
                    v-model="sumCurrency"
                    class="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  >
                    <option v-for="currency in currencyOptions" :key="currency" :value="currency">
                      {{ currency }}
                    </option>
                  </select>
                </div>
              </div>
              <input
                v-else
                v-model="formData[header]"
                type="text"
                :placeholder="getPlaceholder(header)"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>
          <div
            class="flex gap-3 justify-end border-t border-gray-200 px-6 py-4"
          >
            <button
              @click="close"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              @click="confirm"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "AddModal",
};
</script>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Flatpickr from "vue-flatpickr-component";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { applyDateMask, displayToIsoDate } from "../utils/dateFormat";

const getPlaceholder = (header: string): string => {
  const placeholders: Record<string, string> = {
    'Код товара': 'Например: WH-001',
    'Название товара': 'Введите название товара',
    'Количество': 'Например: 100',
    'Единица': 'Например: шт, кг, л',
    'Расположение': 'Выберите расположение',
    'Дата': 'Выберите дату',
    'Статус': 'Выберите статус',
    'Тип': 'Выберите тип',
    'Поставщик': 'Введите название поставщика',
    'Цена': 'Введите цену',
    'Сумма': 'Введите сумму',
    'Примечание': 'Введите примечание',
  };
  
  return placeholders[header] || 'Введите значение';
};

const warehouseLocations = ["Склад Капсула", "Склад Стакан"];
type QuantityUnit = "кг" | "шт";
const quantityUnits: QuantityUnit[] = ["кг", "шт"];
type CurrencyOption = "$" | "сом";
const currencyOptions: CurrencyOption[] = ["сом", "$"];

interface Props {
  isOpen: boolean;
  title: string;
  headers: string[];
  statusOptions?: string[];
}

const defaultStatusOptions = [
  "Заказано в Китае",
  "Принято в Душанбе",
];

const props = withDefaults(defineProps<Props>(), {});
const normalizedStatusOptions = computed(() =>
  props.statusOptions && props.statusOptions.length
    ? props.statusOptions
    : defaultStatusOptions
);

const emit = defineEmits<{
  close: [];
  confirm: [data: Record<string, any>];
}>();

const FlatPickr = Flatpickr;
const today = new Date();
const datePickerConfig = {
  dateFormat: "d.m.Y",
  locale: Russian,
  allowInput: true,
  maxDate: today,
};

const formData = ref<Record<string, any>>({});
const quantityValue = ref<string>("");
const quantityUnit = ref<QuantityUnit>("шт");
const sumValue = ref<string>("");
const sumCurrency = ref<CurrencyOption>("сом");

const resetForm = () => {
  formData.value = {};
  quantityValue.value = "";
  quantityUnit.value = "шт";
  sumValue.value = "";
  sumCurrency.value = "сом";
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  }
);

const syncQuantityField = () => {
  if (quantityValue.value) {
    formData.value["Количество"] = `${quantityValue.value} ${quantityUnit.value}`;
  } else {
    delete formData.value["Количество"];
  }
};

watch([quantityValue, quantityUnit], syncQuantityField);

const syncSumField = () => {
  if (!sumValue.value) {
    delete formData.value["Сумма"];
    return;
  }

  formData.value["Сумма"] = sumCurrency.value === "$"
    ? `$${sumValue.value}`
    : `${sumValue.value} сом`;
};

watch([sumValue, sumCurrency], syncSumField);

const convertFormDatesToIso = (data: Record<string, any>) => {
  const payload = { ...data };
  const dateValue = payload["Дата"];
  if (typeof dateValue === "string") {
    const isoValue = displayToIsoDate(dateValue);
    if (isoValue) {
      payload["Дата"] = isoValue;
    }
  }
  return payload;
};

const handleDateMaskInput = (event: Event, header: string) => {
  const target = event.target as HTMLInputElement | null;
  if (!target) {
    return;
  }

  const maskedValue = applyDateMask(target.value);
  target.value = maskedValue;
  formData.value[header] = maskedValue;
};

const close = () => {
  emit("close");
};

const confirm = () => {
  const payload = convertFormDatesToIso(formData.value);
  emit("confirm", payload);
  resetForm();
};

defineExpose({ close, confirm });
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:nth-child(2),
.modal-leave-active > div:nth-child(2) {
  transition: transform 0.3s ease;
}

.modal-enter-from > div:nth-child(2),
.modal-leave-to > div:nth-child(2) {
  transform: scale(0.95);
}
</style>
