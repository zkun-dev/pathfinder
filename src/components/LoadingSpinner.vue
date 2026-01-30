<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="text-center">
      <!-- 主加载动画容器 -->
      <div class="relative inline-block">
        <!-- 外层旋转环 -->
        <div
          :class="[
            'absolute inset-0 rounded-full border-4 animate-spin',
            isDark
              ? 'border-white/20 border-t-white/60'
              : 'border-gray-300 border-t-gray-700',
            sizeClass,
          ]"
          style="animation-duration: 1s;"
        ></div>
        
        <!-- 内层旋转环（反向） -->
        <div
          :class="[
            'absolute inset-0 rounded-full border-4 animate-spin',
            isDark
              ? 'border-white/10 border-r-white/50'
              : 'border-gray-200 border-r-gray-600',
            sizeClass,
          ]"
          style="animation-duration: 1.5s; animation-direction: reverse; transform: scale(0.7);"
        ></div>
        
        <!-- 中心脉冲点 -->
        <div
          :class="[
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse',
            isDark ? 'bg-white/40' : 'bg-gray-700/40',
            centerDotSize,
          ]"
        ></div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

interface Props {
  /** 容器类名 */
  containerClass?: string
  /** 是否显示文本 */
  showText?: boolean
  /** 加载文本 */
  text?: string
  /** 尺寸：sm | md | lg */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: '',
  showText: false,
  text: '加载中...',
  size: 'md',
})

const { isDark } = useTheme()

const sizeClass = computed(() => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  }
  return sizes[props.size]
})

const centerDotSize = computed(() => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }
  return sizes[props.size]
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
