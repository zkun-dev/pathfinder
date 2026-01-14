<template>
  <header class="flex justify-between items-center py-6">
    <div
      v-motion
      :initial="{ opacity: 0, x: -20 }"
      :enter="{ opacity: 1, x: 0, transition: { duration: 500 } }"
      :class="[
        'text-2xl font-bold transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        PathFinder | 成长足迹
      </span>
    </div>

    <nav class="hidden md:flex items-center space-x-8">
      <a
        v-for="(item, index) in navItems"
        :key="`nav-${item.label}-${index}`"
        :href="item.href"
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 400,
            delay: 100 + index * 50,
            ease: 'easeOut',
          },
        }"
        :visible="{
          opacity: 1,
          y: 0,
        }"
        :class="[
          'transition-colors duration-300',
          isDark
            ? 'text-gray-300 hover:text-white'
            : 'text-gray-600 hover:text-gray-900',
        ]"
      >
        {{ item.label }}
      </a>
    </nav>

    <button
      v-motion
      :initial="{ opacity: 0, x: 20 }"
      :enter="{ opacity: 1, x: 0 }"
      :hover="{ scale: 1.05 }"
      :tap="{ scale: 0.95 }"
      @click="toggleTheme"
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
        isDark
          ? 'bg-white/10 hover:bg-white/20'
          : 'bg-gray-900/10 hover:bg-gray-900/20',
      ]"
    >
      <i v-if="isDark" class="fa-solid fa-sun text-yellow-300 text-sm"></i>
      <i v-else class="fa-solid fa-moon text-blue-600 text-sm"></i>
    </button>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import type { NavItem } from '@/types';

defineProps<{
  navItems: NavItem[];
}>();

const { toggleTheme, isDark } = useTheme();
</script>
