import { isDev } from '@/config/env'

type LogArgs = unknown[]

export const logger = {
  log: (...args: LogArgs) => isDev && console.log('[LOG]', ...args),
  info: (...args: LogArgs) => isDev && console.info('[INFO]', ...args),
  warn: (...args: LogArgs) => isDev && console.warn('[WARN]', ...args),
  error: (...args: LogArgs) => console.error('[ERROR]', ...args),
}
