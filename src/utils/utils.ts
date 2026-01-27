import { twMerge } from 'tailwind-merge'
import { logger } from './logger'

export const cn = (...inputs: (string | boolean | null | undefined)[]) => {
  return twMerge(inputs.filter(Boolean).join(' '))
}

export const formatDate = (
  dateString: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string => {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('zh-CN', options)
}

export const formatDateShort = (dateString: string | Date | null | undefined): string => {
  return formatDate(dateString, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
}

export const getErrorMessage = (error: unknown, defaultMessage = '操作失败'): string => {
  if (error instanceof Error) return error.message || defaultMessage
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    if ('message' in error) return String(error.message) || defaultMessage
    if ('error' in error) return String(error.error) || defaultMessage
    if ('status' in error && typeof error.status === 'number') return `请求失败 (${error.status})`
  }
  return defaultMessage
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
      logger.error('Failed to save to localStorage', error)
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

