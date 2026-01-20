<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto min-w-[300px] max-w-md rounded-lg shadow-xl border p-4 flex items-start gap-3 transition-all duration-300',
            getToastClass(toast.type),
          ]"
        >
          <div :class="['flex-shrink-0', getIconClass(toast.type)]">
            <i :class="[getIcon(toast.type), 'text-lg']"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'text-sm font-medium',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ toast.message }}
            </p>
          </div>
          <button
            @click="remove(toast.id)"
            :class="[
              'flex-shrink-0 p-1 rounded transition-colors',
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <i class="fa-solid fa-times text-sm"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { useToast, type ToastType } from '@/composables/useToast';

const { isDark } = useTheme();
const { toasts, remove } = useToast();

const getToastClass = (type: ToastType) => {
  const base = isDark.value
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  switch (type) {
    case 'success':
      return `${base} ${isDark.value ? 'border-green-500/30' : 'border-green-200'}`;
    case 'error':
      return `${base} ${isDark.value ? 'border-red-500/30' : 'border-red-200'}`;
    case 'warning':
      return `${base} ${isDark.value ? 'border-yellow-500/30' : 'border-yellow-200'}`;
    case 'info':
      return `${base} ${isDark.value ? 'border-blue-500/30' : 'border-blue-200'}`;
    default:
      return base;
  }
};

const getIconClass = (type: ToastType) => {
  switch (type) {
    case 'success':
      return isDark.value ? 'text-green-400' : 'text-green-600';
    case 'error':
      return isDark.value ? 'text-red-400' : 'text-red-600';
    case 'warning':
      return isDark.value ? 'text-yellow-400' : 'text-yellow-600';
    case 'info':
      return isDark.value ? 'text-blue-400' : 'text-blue-600';
    default:
      return '';
  }
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'fa-solid fa-circle-check';
    case 'error':
      return 'fa-solid fa-circle-exclamation';
    case 'warning':
      return 'fa-solid fa-triangle-exclamation';
    case 'info':
      return 'fa-solid fa-circle-info';
    default:
      return 'fa-solid fa-info-circle';
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
