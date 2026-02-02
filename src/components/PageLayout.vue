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

    <!-- 头部导航 - 始终显示 -->
    <Header :nav-items="NAV_ITEMS" />

    <!-- 加载状态 - 只占据内容区域，不覆盖头部 -->
    <div 
      v-if="loading" 
      class="fixed top-16 left-0 right-0 bottom-0 z-40"
      style="position: fixed; top: 4rem; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0;"
    >
      <LoadingSpinner size="md" />
    </div>

    <div v-if="!loading" class="relative z-10 container mx-auto px-4 pt-20 md:pt-28">

      <!-- 内容区域 -->
      <div class="max-w-6xl mx-auto">
        <!-- 页面头部 -->
        <div class="flex flex-row justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
          <h1
            :class="[
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-colors flex-1 min-w-0',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ title }}
          </h1>
          <button
            @click="$router.push('/')"
            :class="[
              'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base flex-shrink-0',
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            ]"
          >
            <i class="fa-solid fa-arrow-left text-sm sm:text-base"></i>
            <span class="hidden sm:inline">返回首页</span>
            <span class="sm:hidden">返回</span>
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
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { NAV_ITEMS } from '@/constants';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

defineProps<{
  title: string;
  loading?: boolean;
}>();

const { isDark } = useTheme();
</script>
