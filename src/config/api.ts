import { env } from './env'

export const API_BASE_URL = env.API_BASE_URL

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PROFILE: '/profile',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  EXPERIENCES: '/experiences',
  LEARNINGS: '/learnings',
  LIFE: '/life',
  UPLOAD: '/upload',
  DELETE_FILE: '/upload',
} as const
