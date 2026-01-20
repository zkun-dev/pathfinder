import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import type {
  Profile,
  Skill,
  Project,
  Experience,
  Learning,
  Life,
  LoginRequest,
  LoginResponse,
  PaginatedResponse,
} from '@/types';

// 请求拦截器：添加认证token
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 认证相关API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<{ id: number; username: string; email: string }> => {
    return request(API_ENDPOINTS.AUTH.ME);
  },
};

// 个人信息API
export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    return request<Profile>(API_ENDPOINTS.PROFILE);
  },

  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    return request<Profile>(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// 技能API
export const skillApi = {
  getSkills: async (): Promise<Skill[]> => {
    return request<Skill[]>(API_ENDPOINTS.SKILLS);
  },

  createSkill: async (data: Partial<Skill>): Promise<Skill> => {
    return request<Skill>(API_ENDPOINTS.SKILLS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateSkill: async (id: number, data: Partial<Skill>): Promise<Skill> => {
    return request<Skill>(`${API_ENDPOINTS.SKILLS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteSkill: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.SKILLS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// 项目API
export const projectApi = {
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    type?: string;
  }): Promise<PaginatedResponse<Project>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.featured !== undefined)
      queryParams.append('featured', params.featured.toString());
    if (params?.type) queryParams.append('type', params.type);

    const query = queryParams.toString();
    return request<PaginatedResponse<Project>>(
      `${API_ENDPOINTS.PROJECTS}${query ? `?${query}` : ''}`
    );
  },

  getProject: async (id: number): Promise<Project> => {
    return request<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`);
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    return request<Project>(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject: async (id: number, data: Partial<Project>): Promise<Project> => {
    return request<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProject: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.PROJECTS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// 工作经历API
export const experienceApi = {
  getExperiences: async (): Promise<Experience[]> => {
    return request<Experience[]>(API_ENDPOINTS.EXPERIENCES);
  },

  getExperience: async (id: number): Promise<Experience> => {
    return request<Experience>(`${API_ENDPOINTS.EXPERIENCES}/${id}`);
  },

  createExperience: async (data: Partial<Experience>): Promise<Experience> => {
    return request<Experience>(API_ENDPOINTS.EXPERIENCES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateExperience: async (
    id: number,
    data: Partial<Experience>
  ): Promise<Experience> => {
    return request<Experience>(`${API_ENDPOINTS.EXPERIENCES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteExperience: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.EXPERIENCES}/${id}`, {
      method: 'DELETE',
    });
  },
};

// 学习记录API
export const learningApi = {
  getLearnings: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
  }): Promise<Learning[]> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    const response = await request<PaginatedResponse<Learning> | Learning[]>(
      `${API_ENDPOINTS.LEARNINGS}${query ? `?${query}` : ''}`
    );
    
    // 处理分页响应或直接数组
    if (Array.isArray(response)) {
      return response;
    }
    
    // 如果是分页响应，返回 data 数组
    return (response as PaginatedResponse<Learning>).data;
  },

  getLearning: async (id: number): Promise<Learning> => {
    return request<Learning>(`${API_ENDPOINTS.LEARNINGS}/${id}`);
  },

  createLearning: async (data: Partial<Learning>): Promise<Learning> => {
    return request<Learning>(API_ENDPOINTS.LEARNINGS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateLearning: async (
    id: number,
    data: Partial<Learning>
  ): Promise<Learning> => {
    return request<Learning>(`${API_ENDPOINTS.LEARNINGS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteLearning: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.LEARNINGS}/${id}`, {
      method: 'DELETE',
    });
  },
};

// 生活动态API
export const lifeApi = {
  getLifePosts: async (params?: {
    page?: number;
    limit?: number;
    published?: boolean;
  }): Promise<PaginatedResponse<Life>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.published !== undefined)
      queryParams.append('published', params.published.toString());

    const query = queryParams.toString();
    return request<PaginatedResponse<Life>>(
      `${API_ENDPOINTS.LIFE}${query ? `?${query}` : ''}`
    );
  },

  getLifePost: async (id: number): Promise<Life> => {
    return request<Life>(`${API_ENDPOINTS.LIFE}/${id}`);
  },

  createLifePost: async (data: Partial<Life>): Promise<Life> => {
    return request<Life>(API_ENDPOINTS.LIFE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateLifePost: async (id: number, data: Partial<Life>): Promise<Life> => {
    return request<Life>(`${API_ENDPOINTS.LIFE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteLifePost: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.LIFE}/${id}`, {
      method: 'DELETE',
    });
  },
};

// 文件上传API
export const uploadApi = {
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '上传失败' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteFile: async (url: string): Promise<{ message: string }> => {
    // 从URL中提取文件路径
    let filePath = url;
    
    // 如果是完整URL，提取路径部分
    try {
      const urlObj = new URL(url);
      filePath = urlObj.pathname;
    } catch {
      // 如果不是完整URL，尝试提取路径
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // 已经是完整URL但URL解析失败，尝试从URL中提取路径
        const match = url.match(/\/uploads\/[^\/]+/);
        if (match) {
          filePath = match[0];
        } else {
          filePath = url;
        }
      } else if (url.startsWith('/')) {
        // 相对路径，直接使用
        filePath = url;
      } else {
        // 可能是文件名，需要添加路径前缀
        filePath = `/uploads/${url}`;
      }
    }

    // 确保路径以 /uploads/ 开头
    if (!filePath.startsWith('/uploads/')) {
      // 如果路径不包含 /uploads/，尝试添加
      if (filePath.startsWith('/')) {
        filePath = `/uploads${filePath}`;
      } else {
        filePath = `/uploads/${filePath}`;
      }
    }

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 后端期望路径作为URL路径参数，例如：DELETE /api/upload/uploads/filename.jpg
    // 或者作为查询参数：DELETE /api/upload?path=/uploads/filename.jpg
    // 我们使用路径参数方式
    const deleteUrl = `${API_BASE_URL}${API_ENDPOINTS.DELETE_FILE}${filePath}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '删除失败' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
