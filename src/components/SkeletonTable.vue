<template>
  <div class="space-y-6">
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="i in columns"
              :key="i"
              class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="row in rows" :key="row">
            <td v-for="col in columns" :key="col" class="px-6 py-4">
              <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between">
      <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      <div class="flex gap-2">
        <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows?: number;
  columns?: number;
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 5,
});
</script>
