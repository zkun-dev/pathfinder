<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @mousedown.self="handleBackgroundMouseDown"
        @mouseup.self="handleBackgroundMouseUp"
      >
        <div
          :class="[
            'w-full max-w-md rounded-xl shadow-2xl transition-colors',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
          @mousedown.stop
          @mouseup.stop
        >
          <!-- 头部 -->
          <div
            :class="[
              'flex items-center justify-between px-4 py-3 border-b flex-shrink-0',
              isDark ? 'border-gray-700' : 'border-gray-200',
            ]"
          >
            <div class="flex items-center gap-3 flex-1">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  type === 'danger'
                    ? 'bg-red-500/20 text-red-500'
                    : 'bg-blue-500/20 text-blue-500',
                ]"
              >
                <i
                  :class="[
                    type === 'danger' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-question',
                    'text-sm',
                  ]"
                ></i>
              </div>
              <h3
                :class="[
                  'text-base font-semibold transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ title || '确认操作' }}
              </h3>
            </div>
            <button
              @click="handleCancel"
              :class="[
                'p-1.5 rounded-lg transition-colors flex-shrink-0',
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
              ]"
            >
              <i class="fa-solid fa-times text-sm"></i>
            </button>
          </div>
          
          <!-- 描述信息 -->
          <div
            v-if="description"
            :class="[
              'px-4 py-3 text-sm transition-colors',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            {{ description }}
          </div>

          <!-- 内容 -->
          <div
            v-if="$slots.default"
            :class="[
              'px-4 py-3 text-sm transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            <slot></slot>
          </div>

          <!-- 脚部 -->
          <div
            :class="[
              'flex items-center justify-end gap-2 px-4 py-3 border-t flex-shrink-0',
              isDark ? 'border-gray-700' : 'border-gray-200',
            ]"
          >
            <button
              type="button"
              @click="handleCancel"
              :class="[
                'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
              ]"
            >
              取消
            </button>
            <button
              type="button"
              @click="handleConfirm"
              :class="[
                'px-4 py-2 rounded-lg transition-colors text-sm font-medium',
                type === 'danger'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600',
              ]"
            >
              {{ confirmText || '确认' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

defineProps<{
  modelValue: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const { isDark } = useTheme();

let mouseDownOnBackground = false

const handleBackgroundMouseDown = () => {
  mouseDownOnBackground = true
}

const handleBackgroundMouseUp = () => {
  if (mouseDownOnBackground) {
    handleCancel()
  }
  mouseDownOnBackground = false
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
