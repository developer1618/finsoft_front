<template>
  <div class="flex items-center justify-center">
    <div
      class="animate-spin rounded-full border-4 border-gray-200"
      :class="sizeClass"
      :style="{ borderTopColor: color }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: '#4F46E5', // indigo-600
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  return sizes[props.size];
});
</script>
