import { twMerge } from 'tailwind-merge'
import { logger } from './logger'

/**
 * 合并 Tailwind CSS 类名
 * 替代 clsx，使用 Vue 原生方式
 */
export function cn(...inputs: (string | boolean | null | undefined)[]) {
  const classes = inputs.filter(Boolean).join(' ')
  return twMerge(classes)
}

/**
 * 格式化日期
 * @param dateString - 日期字符串或 Date 对象
 * @param options - Intl.DateTimeFormatOptions 选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('zh-CN', options)
}

/**
 * 格式化日期为简短格式 (YYYY-MM-DD)
 */
export function formatDateShort(dateString: string | Date | null | undefined): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-')
}

/**
 * 安全的 JSON 解析
 * @param jsonString - JSON 字符串
 * @param defaultValue - 解析失败时的默认值
 * @returns 解析后的对象或默认值
 */
export function safeJsonParse<T = any>(
  jsonString: string,
  defaultValue: T | null = null
): T | null {
  if (!jsonString || !jsonString.trim()) return defaultValue
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    return defaultValue
  }
}

/**
 * 提取错误消息
 * @param error - 错误对象
 * @param defaultMessage - 默认错误消息
 * @returns 错误消息字符串
 */
export function getErrorMessage(error: unknown, defaultMessage = '操作失败'): string {
  if (error instanceof Error) {
    return error.message || defaultMessage
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object') {
    if ('message' in error) {
      return String(error.message) || defaultMessage
    }
    if ('error' in error) {
      return String(error.error) || defaultMessage
    }
    if ('status' in error && typeof error.status === 'number') {
      return `请求失败 (${error.status})`
    }
  }
  return defaultMessage
}

/**
 * 检查是否为空值
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const cloned = {} as T
    Object.keys(obj).forEach(key => {
      cloned[key as keyof T] = deepClone((obj as any)[key])
    })
    return cloned
  }
  return obj
}

/**
 * 数组去重
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) return [...new Set(array)]

  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

/**
 * 数组分组
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 驼峰转下划线
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * 下划线转驼峰
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * localStorage 工具
 */
export const storage = {
  get: <T = unknown>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },

  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // 使用 logger 而不是 console.error
      if (error instanceof Error) {
        logger.error('Failed to save to localStorage', error)
      } else {
        logger.error('Failed to save to localStorage', new Error(String(error)))
      }
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key)
  },

  getRaw: (key: string): string | null => {
    return localStorage.getItem(key)
  },

  setRaw: (key: string, value: string): void => {
    localStorage.setItem(key, value)
  }
}

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
