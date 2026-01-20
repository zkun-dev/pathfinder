<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <ThreeDBackground />

    <div
      :class="[
        'absolute inset-0 z-0 transition-opacity duration-500',
        isDark
          ? 'bg-gradient-to-b from-black/50 via-black/70 to-black/90'
          : 'bg-gradient-to-b from-white/50 via-white/70 to-white/90',
      ]"
    ></div>

    <div class="relative z-10 container mx-auto px-4 pt-28">
      <Header :nav-items="[]" />

      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div
          :class="[
            'inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent',
            isDark ? 'border-white' : 'border-gray-900',
          ]"
        ></div>
      </div>

      <!-- 内容区域 -->
      <div v-else class="max-w-6xl mx-auto">
        <!-- 页面头部 -->
        <div class="flex justify-between items-start mb-12">
          <h1
            :class="[
              'text-4xl md:text-5xl font-bold transition-colors',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ title }}
          </h1>
          <button
            @click="$router.push('/')"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105',
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            ]"
          >
            <i class="fa-solid fa-arrow-left"></i>
            返回首页
          </button>
        </div>

        <!-- 插槽内容 -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useTheme } from '@/composables/useTheme';
import Header from '@/components/Header.vue';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

defineProps<{
  title: string;
  loading?: boolean;
}>();

const { isDark } = useTheme();
</script>
