import { logger } from '@/utils/logger'

export interface EnvConfig {
  API_BASE_URL: string
  MODE: string
  isDev: boolean
  isProd: boolean
  API_TIMEOUT: number
  showDetailedErrors: boolean
}

export const MODE = import.meta.env.MODE
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  
  if (!envUrl) {
    const envFile = isDev ? '.env.development' : '.env.production'
    const platformHint = isProd 
      ? '在部署平台（如 Railway/Vercel）的环境变量中设置，或'
      : ''
    const exampleUrl = isDev 
      ? 'http://localhost:3001/api' 
      : 'https://your-backend-domain.com/api'
    
    throw new Error(
      `❌ 必须配置 VITE_API_BASE_URL 环境变量\n` +
      `${platformHint}创建 ${envFile} 文件并设置：\n` +
      `  VITE_API_BASE_URL=${exampleUrl}\n` +
      `\n提示：必须使用完整的 URL（包含协议 http:// 或 https://）`
    )
  }

  // 验证必须是完整 URL
  try {
    const url = new URL(envUrl)
    
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('协议必须是 http 或 https')
    }
    
    if (!url.pathname.endsWith('/api')) {
      logger.warn(`VITE_API_BASE_URL 建议以 /api 结尾: ${url.pathname}`)
    }
    
    return envUrl
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `❌ VITE_API_BASE_URL 格式错误: ${envUrl}\n` +
        `必须使用完整的 URL，例如：\n` +
        `  - 开发环境: http://localhost:3001/api\n` +
        `  - 生产环境: https://your-backend-domain.com/api`
      )
    }
    throw error
  }
}

const getApiTimeout = (): number => {
  const timeout = import.meta.env.VITE_API_TIMEOUT
  if (timeout) {
    const parsed = parseInt(timeout, 10)
    if (!isNaN(parsed) && parsed > 0) return parsed
    logger.warn(`VITE_API_TIMEOUT 格式错误: ${timeout}`)
  }
  return isDev ? 30000 : 10000
}

const createEnvConfig = (): EnvConfig => ({
  API_BASE_URL: getApiBaseUrl(),
  MODE,
  isDev,
  isProd,
  API_TIMEOUT: getApiTimeout(),
  showDetailedErrors: isDev,
})

export const env: EnvConfig = createEnvConfig()

export const validateEnv = (): void => {
  try {
    if (env.API_TIMEOUT < 1000) {
      logger.warn('API_TIMEOUT 设置过小，建议至少 1000ms')
    }
    
    if (isDev) {
      logger.log('开发环境配置', { 
        apiBaseUrl: env.API_BASE_URL, 
        timeout: env.API_TIMEOUT, 
        mode: MODE 
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error('环境配置错误', error.message)
      throw error
    }
  }
}
