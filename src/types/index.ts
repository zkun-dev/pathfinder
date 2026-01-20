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
  };
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
