/**
 * 日志工具
 * 在生产环境自动禁用 console 输出
 */

import { isDev } from '@/config/env';

const isDevelopment = isDev;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[LOG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    // 错误始终输出，但可以在这里添加错误上报逻辑
    console.error('[ERROR]', ...args);
    // TODO: 可以在这里添加错误上报到监控系统
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },
};
