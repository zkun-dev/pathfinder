<template>
  <div 
    class="loading-spinner-wrapper" 
    :class="containerClass"
    style="display: flex; align-items: center; justify-content: center; margin: 0; padding: 0; height: 100%; width: 100%;"
  >
    <div 
      class="loading-spinner"
      :class="[
        sizeClass,
        isDark ? 'loading-spinner-dark' : 'loading-spinner-light'
      ]"
    >
      <!-- 外层渐变环 -->
      <div class="spinner-outer-ring"></div>
      <!-- 中层渐变环 -->
      <div class="spinner-middle-ring"></div>
      <!-- 内层脉冲点 -->
      <div class="spinner-dot"></div>
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
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  }
  return sizes[props.size]
})
</script>

<style scoped>
.loading-spinner-wrapper {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100%;
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.loading-spinner {
  position: relative;
  display: inline-block;
}

.spinner-sm {
  width: 40px;
  height: 40px;
}

.spinner-md {
  width: 64px;
  height: 64px;
}

.spinner-lg {
  width: 96px;
  height: 96px;
}

/* 外层渐变环 - 顺时针旋转 */
.spinner-outer-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top: 3px solid;
  border-right: 3px solid;
  border-top-color: currentColor;
  border-right-color: currentColor;
  opacity: 0.8;
  animation: spin-outer 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

/* 中层渐变环 - 逆时针旋转 */
.spinner-middle-ring {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 2px solid transparent;
  border-bottom: 2px solid;
  border-left: 2px solid;
  border-bottom-color: currentColor;
  border-left-color: currentColor;
  opacity: 0.6;
  animation: spin-middle 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
}

/* 中心脉冲点 */
.spinner-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20%;
  height: 20%;
  border-radius: 50%;
  background: currentColor;
  transform: translate(-50%, -50%);
  animation: pulse-dot 1.5s ease-in-out infinite;
  box-shadow: 0 0 10px currentColor;
}

/* 浅色主题 - 蓝紫色渐变 */
.loading-spinner-light {
  color: #6366f1;
}

.loading-spinner-light .spinner-outer-ring {
  border-top-color: #6366f1;
  border-right-color: #8b5cf6;
}

.loading-spinner-light .spinner-middle-ring {
  border-bottom-color: #8b5cf6;
  border-left-color: #a78bfa;
}

.loading-spinner-light .spinner-dot {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.6);
}

/* 深色主题 - 亮紫色渐变 */
.loading-spinner-dark {
  color: #818cf8;
}

.loading-spinner-dark .spinner-outer-ring {
  border-top-color: #818cf8;
  border-right-color: #a78bfa;
}

.loading-spinner-dark .spinner-middle-ring {
  border-bottom-color: #a78bfa;
  border-left-color: #c4b5fd;
}

.loading-spinner-dark .spinner-dot {
  background: linear-gradient(135deg, #818cf8, #a78bfa);
  box-shadow: 0 0 12px rgba(129, 140, 248, 0.6);
}

/* 动画定义 */
@keyframes spin-outer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-middle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse-dot {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.7;
  }
}

/* 响应式尺寸调整 */
.spinner-sm .spinner-dot {
  width: 25%;
  height: 25%;
}

.spinner-lg .spinner-dot {
  width: 18%;
  height: 18%;
}
</style>
