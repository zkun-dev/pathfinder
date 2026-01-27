<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="text-center">
      <div
        :class="[
          'mb-4 text-4xl transition-colors duration-300',
          isDark ? 'text-red-400' : 'text-red-600',
        ]"
      >
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>
      <p
        :class="[
          'text-lg mb-4 transition-colors duration-300',
          isDark ? 'text-red-400' : 'text-red-600',
        ]"
      >
        {{ message || '加载失败，请稍后重试' }}
      </p>
      <div class="flex gap-3 justify-center">
        <button
          v-if="showRetry"
          @click="$emit('retry')"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white',
          ]"
        >
          <i class="fa-solid fa-rotate-right mr-2"></i>
          重试
        </button>
        <button
          v-if="showBack"
          @click="$emit('back')"
          :class="[
            'px-6 py-2 rounded-lg transition-colors',
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
          ]"
        >
          <i class="fa-solid fa-arrow-left mr-2"></i>
          返回
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

interface Props {
  /** 错误消息 */
  message?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 容器类名 */
  containerClass?: string
}

withDefaults(defineProps<Props>(), {
  message: '加载失败，请稍后重试',
  showRetry: false,
  showBack: false,
  containerClass: '',
})

defineEmits<{
  retry: []
  back: []
}>()

const { isDark } = useTheme()
</script>
