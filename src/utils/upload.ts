/**
 * 文件上传工具函数
 */

import { API_BASE_URL } from '@/config/api'
import { formatFileSize } from './utils'

/**
 * 文件大小限制（字节）- 10MB
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * 允许的图片 MIME 类型
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
] as const

/**
 * 从 URL 中提取文件路径
 * 支持完整 URL、相对路径、文件名等多种格式
 */
export function extractFilePath(url: string): string {
  // 如果是完整 URL，提取路径部分
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch {
    // 如果不是完整 URL，尝试从 URL 字符串中提取路径
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const match = url.match(/\/uploads\/[^\/\s]+/)
      if (match) {
        return match[0]
      }
    }
    
    // 相对路径，直接使用
    if (url.startsWith('/uploads/')) {
      return url
    }
    
    // 如果只是文件名，添加路径前缀
    if (url && !url.includes('/')) {
      return `/uploads/${url}`
    }
    
    // 其他情况，尝试添加 /uploads/ 前缀
    return url.startsWith('/') ? `/uploads${url}` : `/uploads/${url}`
  }
}

/**
 * 将相对路径转换为完整 URL
 */
export function toFullUrl(path: string): string {
  if (!path) return ''
  
  // 如果已经是完整 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // 如果是 data URL，直接返回
  if (path.startsWith('data:')) {
    return path
  }
  
  // 从 API_BASE_URL 提取基础 URL（去掉 /api）
  const baseUrl = API_BASE_URL.replace('/api', '')
  
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  return `${baseUrl}${normalizedPath}`
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, allowedTypes: readonly string[] = ALLOWED_IMAGE_TYPES): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize
}

// 导出 formatFileSize，从 utils 导入以保持向后兼容
export { formatFileSize }
