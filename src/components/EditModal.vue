<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Фон -->
        <div class="absolute inset-0 bg-black/50" @click="close"></div>

        <!-- Модальное окно -->
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
        >
          <!-- Заголовок -->
          <div
            class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
          >
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Содержимое формы -->
          <div class="px-6 py-4 space-y-4">
            <div v-for="header in headers" :key="header" class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                {{ header }}
              </label>
              <input
                v-if="header === 'Дата'"
                v-model="formData[header]"
                type="date"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
              <select
                v-else-if="header === 'Статус'"
                v-model="formData[header]"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Выберите статус</option>
                <option value="Заказано">Заказано</option>
                <option value="Не заказано">Не заказано</option>
                <option value="Отправлено">Отправлено</option>
              </select>
              <select
                v-else-if="header === 'Тип'"
                v-model="formData[header]"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="">Выберите тип</option>
                <option value="Доход">Доход</option>
                <option value="Расход">Расход</option>
              </select>
              <input
                v-else
                v-model="formData[header]"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <!-- Кнопки действий -->
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
  name: "EditModal",
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

interface Props {
  isOpen: boolean;
  title: string;
  headers: string[];
  initialData?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
});

const emit = defineEmits<{
  close: [];
  confirm: [data: Record<string, any>];
}>();

const formData = ref<Record<string, any>>({});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.initialData) {
      formData.value = { ...props.initialData };
    }
  }
);

const close = () => {
  emit("close");
};

const confirm = () => {
  emit("confirm", formData.value);
  formData.value = {};
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
