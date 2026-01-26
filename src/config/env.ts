/**
 * 环境配置
 * 统一管理开发/生产环境判断和配置
 */

/**
 * 当前环境模式
 * - development: 开发环境（pnpm dev）
 * - production: 生产环境（pnpm build）
 */
export const MODE = import.meta.env.MODE;

/**
 * 是否是开发环境
 */
export const isDev = import.meta.env.DEV;

/**
 * 是否是生产环境
 */
export const isProd = import.meta.env.PROD;

/**
 * 环境变量配置
 */
export const env = {
  // API 基础地址
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pathfinder-backend-production.up.railway.app/api',
  
  // 当前环境模式
  MODE,
  
  // 是否是开发环境
  isDev,
  
  // 是否是生产环境
  isProd,
} as const;

/**
 * 开发环境配置
 */
export const devConfig = {
  // 开发环境 API 地址
  // 默认使用本地后端，可通过 .env.development 或 Railway Variables 覆盖
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // 是否启用调试日志
  enableDebugLog: true,
  
  // 是否显示详细错误信息
  showDetailedErrors: true,
} as const;

/**
 * 生产环境配置
 */
export const prodConfig = {
  // 生产环境 API 地址
  // ⚠️ 重要：必须在 Railway Variables 中设置 VITE_API_BASE_URL
  // 如果不设置，会使用下面的默认值（仅作为后备）
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pathfinder-backend-production.up.railway.app/api',
  
  // 是否启用调试日志
  enableDebugLog: false,
  
  // 是否显示详细错误信息
  showDetailedErrors: false,
} as const;

/**
 * 根据环境获取配置
 */
export const getConfig = () => {
  return isDev ? devConfig : prodConfig;
};

/**
 * 当前配置
 */
export const config = getConfig();
