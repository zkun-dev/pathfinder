// 导航项
export interface NavItem {
  label: string;
  href: string;
}

// 社交链接
export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

// 个人信息（后端Profile模型）
export interface Profile {
  id: number;
  name: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  socialLinks?: SocialLink[] | null;
  createdAt: string;
  updatedAt: string;
}

// 技能（后端Skill模型）
export interface Skill {
  id: number;
  name: string;
  category?: string | null;
  proficiency?: number | null; // 1-5
  icon?: string | null;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 项目（后端Project模型）
export interface Project {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  coverImage?: string | null;
  images?: string[] | null;
  techStack?: string[] | null;
  type?: string | null;
  links?: {
    demo?: string;
    github?: string;
    [key: string]: string | undefined;
  } | null;
  featured: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// 工作经历（后端Experience模型）
export interface Experience {
  id: number;
  companyName: string;
  companyLogo?: string | null;
  position: string;
  description?: string | null;
  content?: string | null;
  startDate: string;
  endDate?: string | null;
  achievements?: string[] | null;
  techStack?: string[] | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// 学习记录（后端Learning模型）
export interface Learning {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[] | null;
  resources?: Array<{
    type: string;
    title: string;
    url?: string;
  }> | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// 生活动态（后端Life模型）
export interface Life {
  id: number;
  title: string;
  content: string;
  coverImage?: string | null;
  images?: string[] | null;
  tags?: string[] | null;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// 认证相关
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role?: string;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role?: string;
}

// 文件上传相关
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface FileUploadOptions {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

// 主题相关
export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  theme: Theme;
  systemPreference: Theme;
  customColors?: Record<string, string>;
}

// Toast 相关
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

// 模态框相关
export interface ModalOptions {
  title?: string;
  closable?: boolean;
  width?: string;
  height?: string;
  showFooter?: boolean;
}

// 表单相关
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

// API响应类型
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 技能查询参数
export interface SkillsQueryParams extends QueryParams {
  category?: string;
  proficiency?: number;
}

// 项目查询参数
export interface ProjectsQueryParams extends QueryParams {
  featured?: boolean;
  type?: string;
  techStack?: string;
}

// 学习记录查询参数
export interface LearningsQueryParams extends QueryParams {
  category?: string;
  status?: string;
  tags?: string;
}

// 生活动态查询参数
export interface LifeQueryParams extends QueryParams {
  published?: boolean;
  tags?: string;
}

// 兼容旧版本的PersonalInfo（用于向后兼容）
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  socialLinks: SocialLink[];
}
