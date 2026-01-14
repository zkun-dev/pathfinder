<template>
  <div 
    :class="[
      'min-h-screen flex items-center justify-center transition-colors duration-300',
      isDark 
        ? 'bg-gradient-to-b from-gray-900 to-black' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    ]"
  >
    <div class="text-center">
      <h1 
        :class="[
          'text-4xl font-bold mb-4 transition-colors duration-300',
          isDark ? 'text-white' : 'text-gray-900'
        ]"
      >
        Other Page
      </h1>
      <p 
        :class="[
          'text-xl transition-colors duration-300',
          isDark ? 'text-gray-300' : 'text-gray-600'
        ]"
      >
        Coming Soon
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();
</script>
