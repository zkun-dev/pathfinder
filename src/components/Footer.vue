<template>
  <footer
    :class="[
      'py-6 md:py-8 text-center transition-colors duration-300',
      isDark ? 'border-t border-white/10' : 'border-t border-gray-300/30',
    ]"
  >
    <div class="max-w-6xl mx-auto px-4">
      <!-- 网站信息 -->
      <div class="mb-4 md:mb-6">
        <h3
          :class="[
            'text-lg md:text-xl font-bold mb-2 transition-colors duration-300',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          PathFinder
        </h3>
        <p
          :class="[
            'text-xs md:text-sm transition-colors duration-300',
            isDark ? 'text-gray-400' : 'text-gray-500',
          ]"
        >
          记录成长足迹，展示技能与项目
        </p>
      </div>

      <!-- 快速导航 -->
      <div class="mb-4 md:mb-6">
        <div class="flex flex-wrap justify-center gap-3 md:gap-4">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.href"
            :class="[
              'text-xs md:text-sm transition-colors duration-300 hover:underline',
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900',
            ]"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- 社交媒体链接 -->
      <div
        v-if="socialLinks && socialLinks.length > 0"
        class="flex justify-center space-x-4 md:space-x-6 mb-4 md:mb-6"
      >
        <a
          v-for="(link, index) in socialLinks"
          :key="index"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'transition-colors duration-300 hover:scale-110',
            isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-500 hover:text-gray-900',
          ]"
          :title="link.name"
        >
          <i :class="`fa-brands ${link.icon} text-lg md:text-xl`"></i>
        </a>
      </div>

      <!-- 版权信息 -->
      <div
        :class="[
          'text-xs md:text-sm transition-colors duration-300',
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      >
        <p>© {{ currentYear }} {{ name }}. 保留所有权利。</p>
        <p class="mt-1">
          使用
          <span
            :class="[
              'font-semibold',
              isDark ? 'text-purple-400' : 'text-purple-600',
            ]"
          >
            Vue 3
          </span>
          +
          <span
            :class="[
              'font-semibold',
              isDark ? 'text-blue-400' : 'text-blue-600',
            ]"
          >
            TypeScript
          </span>
          构建
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { NAV_ITEMS } from '@/constants';
import type { SocialLink } from '@/types';

defineProps<{
  name: string;
  socialLinks: SocialLink[];
}>();

const { isDark } = useTheme();

const currentYear = computed(() => new Date().getFullYear());
const navItems = NAV_ITEMS;
</script>
