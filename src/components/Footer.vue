<template>
  <footer
    :class="[
      'py-12 text-center mt-20 transition-colors duration-300',
      isDark ? 'border-t border-white/10' : 'border-t border-gray-300/30',
    ]"
  >
    <div class="flex justify-center space-x-6 mb-6">
      <a
        v-for="(link, index) in socialLinks"
        :key="index"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        :class="[
          'transition-colors duration-300',
          isDark
            ? 'text-gray-400 hover:text-white'
            : 'text-gray-500 hover:text-gray-900',
        ]"
      >
        <i :class="`fa-brands ${link.icon} text-2xl`"></i>
      </a>
    </div>
    <p
      :class="[
        'transition-colors duration-300',
        isDark ? 'text-gray-500' : 'text-gray-400',
      ]"
    >
      © 2026 {{ name }}. 保留所有权利。
    </p>
  </footer>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import type { SocialLink } from '@/types';

defineProps<{
  name: string;
  socialLinks: SocialLink[];
}>();

const { isDark } = useTheme();
</script>
