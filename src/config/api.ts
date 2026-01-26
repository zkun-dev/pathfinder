// API配置
import { config } from './env';

export const API_BASE_URL = config.API_BASE_URL;

export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  // 个人信息
  PROFILE: '/profile',
  // 技能
  SKILLS: '/skills',
  // 项目
  PROJECTS: '/projects',
  // 工作经历
  EXPERIENCES: '/experiences',
  // 学习记录
  LEARNINGS: '/learnings',
  // 生活动态
  LIFE: '/life',
  // 文件上传
  UPLOAD: '/upload',
  // 删除文件
  DELETE_FILE: '/upload',
} as const;
