import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 * 替代 clsx，使用 Vue 原生方式
 */
export function cn(...inputs: (string | boolean | null | undefined)[]) {
  const classes = inputs.filter(Boolean).join(' ');
  return twMerge(classes);
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
    day: 'numeric',
  }
): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('zh-CN', options);
}

/**
 * 格式化日期为简短格式 (YYYY-MM-DD)
 */
export function formatDateShort(dateString: string | Date | null | undefined): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-');
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
  if (!jsonString || !jsonString.trim()) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return defaultValue;
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
    return error.message || defaultMessage;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message) || defaultMessage;
  }
  return defaultMessage;
}

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}