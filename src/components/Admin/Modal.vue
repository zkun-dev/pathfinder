<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4"
        @click.self="handleClose"
      >
        <div
          :class="[
            'w-full max-w-4xl h-[80vh] flex flex-col rounded-xl transition-colors shadow-2xl',
            isDark ? 'bg-gray-800' : 'bg-white',
          ]"
          @click.stop
        >
          <!-- 头部 -->
          <div
            :class="[
              'flex items-center justify-between px-4 py-3 border-b flex-shrink-0',
              isDark ? 'border-gray-700' : 'border-gray-200',
            ]"
          >
            <h3
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              <slot name="title">{{ title }}</slot>
            </h3>
            <button
              @click="handleClose"
              :class="[
                'p-1.5 rounded-lg transition-colors',
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
              ]"
            >
              <i class="fa-solid fa-times text-sm"></i>
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 overflow-y-auto px-4 py-3">
            <slot></slot>
          </div>

          <!-- 脚部 -->
          <div
            v-if="showFooter"
            :class="[
              'flex items-center justify-end gap-2 px-4 py-3 border-t flex-shrink-0',
              isDark ? 'border-gray-700' : 'border-gray-200',
            ]"
          >
            <slot name="footer">
              <button
                type="button"
                @click="handleClose"
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
                type="submit"
                form="modal-form"
                :disabled="loading"
                class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <i v-if="!loading" class="fa-solid fa-floppy-disk mr-1.5 text-xs"></i>
                <i v-else class="fa-solid fa-spinner fa-spin mr-1.5 text-xs"></i>
                {{ loading ? '保存中...' : '保存' }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  loading?: boolean;
  showFooter?: boolean;
}>(), {
  showFooter: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { isDark } = useTheme();

const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
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
