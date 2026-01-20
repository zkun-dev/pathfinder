<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div
      :class="[
        'w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300',
        isDark
          ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50'
          : 'bg-gradient-to-br from-gray-100 to-gray-200',
      ]"
    >
      <i
        :class="[
          icon || 'fa-solid fa-inbox',
          'text-4xl transition-colors duration-300',
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      ></i>
    </div>
    <h3
      :class="[
        'text-xl font-semibold mb-2 transition-colors duration-300',
        isDark ? 'text-gray-300' : 'text-gray-700',
      ]"
    >
      {{ title || '暂无数据' }}
    </h3>
    <p
      v-if="description"
      :class="[
        'text-sm text-center max-w-md transition-colors duration-300',
        isDark ? 'text-gray-500' : 'text-gray-500',
      ]"
    >
      {{ description }}
    </p>
    <slot name="action">
      <button
        v-if="actionText && actionHandler"
        @click="actionHandler"
        :class="[
          'mt-6 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105',
          isDark
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
        ]"
      >
        <i :class="[actionIcon || 'fa-solid fa-plus', 'mr-2']"></i>
        {{ actionText }}
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

defineProps<{
  title?: string;
  description?: string;
  icon?: string;
  actionText?: string;
  actionIcon?: string;
  actionHandler?: () => void;
}>();

const { isDark } = useTheme();
</script>
