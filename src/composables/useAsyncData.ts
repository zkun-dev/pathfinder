/**
 * 异步数据获取 Composable
 * 提供统一的加载状态、错误处理和重试机制
 */

import { ref, type Ref } from 'vue'
import { logger } from '@/utils/logger'
import { getErrorMessage } from '@/utils/utils'

interface UseAsyncDataOptions {
  /** 是否立即执行 */
  immediate?: boolean
  /** 默认错误消息 */
  defaultErrorMessage?: string
}

export function useAsyncData<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncDataOptions = {}
) {
  const { immediate = true, defaultErrorMessage = '加载失败' } = options

  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 执行异步函数
   */
  const execute = async (): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null

      const result = await asyncFn()
      data.value = result
      return result
    } catch (err) {
      const errorMessage = getErrorMessage(err, defaultErrorMessage)
      error.value = errorMessage
      logger.error('数据加载失败', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 重试
   */
  const retry = () => {
    return execute()
  }

  /**
   * 重置状态
   */
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // 如果设置了立即执行，则在创建时执行
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset,
  }
}
