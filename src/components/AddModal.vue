<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="handleClose"></div>
      
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button type="button" @click="handleClose" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <div class="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <div v-for="header in headers" :key="header" class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                {{ header }}
              </label>

              <!-- Date field -->
              <FlatPickr
                v-if="header === 'Дата'"
                :model-value="form[header] || null"
                @update:model-value="(v: any) => form[header] = v"
                :config="dateConfig"
                placeholder="дд.мм.гггг"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />

              <!-- Status select -->
              <select
                v-else-if="header === 'Статус'"
                v-model="form[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Выберите статус</option>
                <option v-for="opt in statusOptionsList" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>

              <!-- Type select -->
              <select
                v-else-if="header === 'Тип'"
                v-model="form[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Выберите тип</option>
                <option value="Доход">Доход</option>
                <option value="Расход">Расход</option>
              </select>

              <!-- Location select -->
              <select
                v-else-if="header === 'Расположение'"
                v-model="form[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Выберите расположение</option>
                <option value="Склад Капсула">Склад Капсула</option>
                <option value="Склад Стакан">Склад Стакан</option>
              </select>

              <!-- Product name select (with dynamic options) -->
              <select
                v-else-if="header === 'Название продукта' && productOptionsList.length > 0"
                v-model="form[header]"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Выберите продукт</option>
                <option v-for="opt in productOptionsList" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>

              <!-- Amount with currency -->
              <div v-else-if="header === 'Сумма'" class="flex gap-2">
                <input
                  v-model="amountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Сумма"
                  class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                <select
                  v-model="amountCurrency"
                  class="w-20 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="сом">сом</option>
                  <option value="$">$</option>
                </select>
              </div>

              <!-- Quantity with unit -->
              <div v-else-if="header === 'Количество'" class="flex gap-2">
                <input
                  v-model="quantityValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Количество"
                  class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                <select
                  v-model="quantityUnit"
                  class="w-20 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="шт">шт</option>
                  <option value="кг">кг</option>
                </select>
              </div>

              <!-- Amount in SOM -->
              <input
                v-else-if="header === 'Сумма в сом'"
                v-model="form[header]"
                type="number"
                min="0"
                step="0.01"
                placeholder="Введите сумму в сом"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />

              <!-- Amount in USD -->
              <input
                v-else-if="header === 'Сумма в $'"
                v-model="form[header]"
                type="number"
                min="0"
                step="0.01"
                placeholder="Введите сумму в $"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />

              <!-- Default text input -->
              <input
                v-else
                v-model="form[header]"
                type="text"
                :placeholder="'Введите ' + header.toLowerCase()"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 justify-end border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import Flatpickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru.js';

interface Props {
  isOpen: boolean;
  title: string;
  headers: string[];
  statusOptions?: string[];
  defaultStatus?: string;
  productOptions?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  statusOptions: () => ['Заказано в Китае', 'Принято в Душанбе'],
  defaultStatus: '',
  productOptions: () => []
});

const emit = defineEmits<{
  close: [];
  confirm: [data: Record<string, any>];
}>();

// Alias for FlatPickr component
const FlatPickr = Flatpickr;

// Date picker config - original format
const today = new Date();
const dateConfig = {
  dateFormat: 'd.m.Y',
  locale: Russian,
  allowInput: true,
  maxDate: today,
};

// Status options
const statusOptionsList = computed(() => props.statusOptions);

// Product options
const productOptionsList = computed(() => props.productOptions || []);

// Form data
const form = ref<Record<string, string>>({});
const amountValue = ref('');
const amountCurrency = ref('сом');
const quantityValue = ref('');
const quantityUnit = ref('шт');
const weightValue = ref('');
const weightUnit = ref('кг');

// Initialize form when component mounts
onMounted(() => {
  initForm();
});

function initForm() {
  const data: Record<string, string> = {};
  props.headers.forEach(h => {
    if (h === 'Статус' && props.defaultStatus) {
      data[h] = props.defaultStatus;
    } else {
      data[h] = '';
    }
  });
  form.value = data;
  amountValue.value = '';
  amountCurrency.value = 'сом';
  quantityValue.value = '';
  quantityUnit.value = 'шт';
  weightValue.value = '';
  weightUnit.value = 'кг';
}

function handleClose() {
  emit('close');
}

function handleSubmit() {
  // Build the payload
  const payload: Record<string, any> = { ...form.value };

  // Convert date from dd.mm.yyyy to yyyy-mm-dd
  if (payload['Дата']) {
    const dateVal = payload['Дата'];
    if (dateVal instanceof Date) {
      const year = dateVal.getFullYear();
      const month = String(dateVal.getMonth() + 1).padStart(2, '0');
      const day = String(dateVal.getDate()).padStart(2, '0');
      payload['Дата'] = `${year}-${month}-${day}`;
    } else if (typeof dateVal === 'string' && dateVal.includes('.')) {
      const parts = dateVal.split('.');
      if (parts.length === 3) {
        payload['Дата'] = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
  }

  // Handle amount field
  if (props.headers.includes('Сумма') && amountValue.value) {
    payload['Сумма'] = amountCurrency.value === '$' 
      ? `$${amountValue.value}` 
      : `${amountValue.value} сом`;
  }

  // Handle quantity field
  if (props.headers.includes('Количество') && quantityValue.value) {
    payload['Количество'] = `${quantityValue.value} ${quantityUnit.value}`;
  }

  // Handle weight field
  if (props.headers.includes('Вес / Штук') && weightValue.value) {
    payload['Вес / Штук'] = `${weightValue.value} ${weightUnit.value}`;
  }

  emit('confirm', payload);
}
</script>

<style scoped>
</style>
