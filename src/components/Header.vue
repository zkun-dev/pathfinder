<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-4 backdrop-blur-md"
    :class="[
      isDark ? 'bg-black/50 border-b border-white/10' : 'bg-white/80 border-b border-gray-200',
    ]"
  >
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

    <nav v-if="showNav" class="hidden md:flex items-center space-x-4">
      <router-link
        v-for="(item, index) in navItems"
        :key="`nav-${item.label}-${index}`"
        :to="item.href"
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
          'relative px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer',
          isActive(item.href)
            ? isDark
              ? 'text-white bg-white/10 font-semibold'
              : 'text-gray-900 bg-gray-100 font-semibold'
            : isDark
              ? 'text-gray-300 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
        ]"
      >
        {{ item.label }}
        <span
          v-if="isActive(item.href)"
          :class="[
            'absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full',
            isDark ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-600',
          ]"
        ></span>
      </router-link>
    </nav>

    <div class="flex items-center gap-3">
      <button
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0 }"
        @click="toggleTheme"
        :class="[
          'p-2 rounded-lg transition-colors',
          isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        ]"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
      </button>
      <router-link
        to="/admin/login"
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0 }"
        :class="[
          'p-2 rounded-lg transition-colors',
          isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        ]"
        title="管理后台"
      >
        <i class="fa-solid fa-shield-halved"></i>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import type { NavItem } from '@/types';

defineProps<{
  navItems: NavItem[];
}>();

const route = useRoute();
const { toggleTheme, isDark } = useTheme();

// 只在首页显示导航
const showNav = computed(() => route.path === '/');

const isActive = (path: string) => {
  // 基于当前路由路径判断是否激活
  return route.path === path;
};
</script>
