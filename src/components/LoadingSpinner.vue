<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="text-center">
      <div
        :class="[
          'inline-block animate-spin rounded-full border-4 border-t-transparent',
          sizeClass,
          isDark ? 'border-white' : 'border-gray-900',
        ]"
      ></div>
      <p
        v-if="showText"
        :class="[
          'mt-4 text-lg transition-colors duration-300',
          isDark ? 'text-gray-400' : 'text-gray-600',
        ]"
      >
        {{ text }}
      </p>
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
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  }
  return sizes[props.size]
})
</script>
