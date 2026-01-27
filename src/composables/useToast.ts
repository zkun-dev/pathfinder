import { ref } from 'vue'
import type { Ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

// 单例模式：确保全局只有一个 toast 实例
let toastInstance: ReturnType<typeof createToast> | null = null

function createToast() {
  const toasts: Ref<Toast[]> = ref([])
  let toastId = 0

  const show = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = toastId++
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration = 3000) => show(message, 'success', duration)
  const error = (message: string, duration = 3000) => show(message, 'error', duration)
  const warning = (message: string, duration = 3000) => show(message, 'warning', duration)
  const info = (message: string, duration = 3000) => show(message, 'info', duration)

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
}

export const useToast = () => {
  if (!toastInstance) {
    toastInstance = createToast()
  }
  return toastInstance
}
