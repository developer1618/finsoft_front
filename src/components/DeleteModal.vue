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
              <XMarkIcon class="w-7 h-7" />
            </button>
          </div>

          <div class="px-6 py-6">
            <p class="text-gray-700 text-center">
              Вы уверены, что хотите удалить эту запись? Это действие невозможно
              отменить.
            </p>
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
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DeleteModal",
};
</script>

<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/outline";

interface Props {
  isOpen: boolean;
  title: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const close = () => {
  emit("close");
};

const confirm = () => {
  emit("confirm");
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
