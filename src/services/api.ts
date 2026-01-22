import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { logger } from '@/utils/logger'
import { getErrorMessage, storage } from '@/utils/utils'
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
  ApiResponse,
  ApiError,
  QueryParams,
  SkillsQueryParams,
  ProjectsQueryParams,
  LearningsQueryParams,
  LifeQueryParams,
  UploadResponse
} from '@/types'

// 请求拦截器：添加认证token
const getAuthHeaders = (contentType: string = 'application/json'): HeadersInit => {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {}

  if (contentType && contentType !== 'multipart/form-data') {
    headers['Content-Type'] = contentType
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  customHeaders?: HeadersInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const defaultHeaders = getAuthHeaders()

  try {
    logger.debug(`API Request: ${options.method || 'GET'} ${url}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...customHeaders,
        ...options.headers
      }
    })

    // 处理 204 No Content 响应
    if (response.status === 204) {
      return null as T
    }

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      const errorData: ApiError = responseData || {
        error: '请求失败',
        status: response.status
      }

      logger.error(`API Error: ${response.status} - ${errorData.error}`, errorData)

      // 根据状态码抛出特定错误
      if (response.status === 401) {
        // 清除无效token
        storage.remove('token')
        storage.remove('user')
        throw new Error('登录已过期，请重新登录')
      }

      if (response.status === 403) {
        throw new Error('权限不足，无法访问该资源')
      }

      if (response.status === 404) {
        throw new Error('请求的资源不存在')
      }

      if (response.status >= 500) {
        throw new Error('服务器内部错误，请稍后重试')
      }

      throw new Error(errorData.error || errorData.message || `请求失败 (${response.status})`)
    }

    logger.debug(`API Response: ${response.status} - ${endpoint}`)
    return responseData
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Request failed: ${options.method || 'GET'} ${url}`, error)
      throw error
    }

    const networkError = new Error('网络连接失败，请检查网络设置')
    logger.error(`Network error: ${options.method || 'GET'} ${url}`, networkError)
    throw networkError
  }
}

// 创建JSON请求体的辅助函数
const createJsonBody = (data: any) => JSON.stringify(data)

// 构建查询字符串
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()))
      } else if (typeof value === 'boolean') {
        searchParams.append(key, value.toString())
      } else {
        searchParams.append(key, value.toString())
      }
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// 认证相关API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: createJsonBody(data)
    })
  },

  getMe: async (): Promise<{ id: number; username: string; email: string }> => {
    return request(API_ENDPOINTS.AUTH.ME)
  }
}

// 个人信息API
export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    return request<Profile>(API_ENDPOINTS.PROFILE)
  },

  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    return request<Profile>(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: createJsonBody(data)
    })
  }
}

// 技能API
export const skillApi = {
  getSkills: async (): Promise<Skill[]> => {
    return request<Skill[]>(API_ENDPOINTS.SKILLS)
  },

  createSkill: async (data: Partial<Skill>): Promise<Skill> => {
    return request<Skill>(API_ENDPOINTS.SKILLS, {
      method: 'POST',
      body: createJsonBody(data)
    })
  },

  updateSkill: async (id: number, data: Partial<Skill>): Promise<Skill> => {
    return request<Skill>(`${API_ENDPOINTS.SKILLS}/${id}`, {
      method: 'PUT',
      body: createJsonBody(data)
    })
  },

  deleteSkill: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.SKILLS}/${id}`, {
      method: 'DELETE'
    })
  }
}

// 项目API
export const projectApi = {
  getProjects: async (params?: ProjectsQueryParams): Promise<PaginatedResponse<Project>> => {
    const query = buildQueryString(params || {})
    return request<PaginatedResponse<Project>>(`${API_ENDPOINTS.PROJECTS}${query}`)
  },

  getProject: async (id: number): Promise<Project> => {
    return request<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`)
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    return request<Project>(API_ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: createJsonBody(data)
    })
  },

  updateProject: async (id: number, data: Partial<Project>): Promise<Project> => {
    return request<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`, {
      method: 'PUT',
      body: createJsonBody(data)
    })
  },

  deleteProject: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.PROJECTS}/${id}`, {
      method: 'DELETE'
    })
  }
}

// 工作经历API
export const experienceApi = {
  getExperiences: async (): Promise<Experience[]> => {
    return request<Experience[]>(API_ENDPOINTS.EXPERIENCES)
  },

  getExperience: async (id: number): Promise<Experience> => {
    return request<Experience>(`${API_ENDPOINTS.EXPERIENCES}/${id}`)
  },

  createExperience: async (data: Partial<Experience>): Promise<Experience> => {
    return request<Experience>(API_ENDPOINTS.EXPERIENCES, {
      method: 'POST',
      body: createJsonBody(data)
    })
  },

  updateExperience: async (id: number, data: Partial<Experience>): Promise<Experience> => {
    return request<Experience>(`${API_ENDPOINTS.EXPERIENCES}/${id}`, {
      method: 'PUT',
      body: createJsonBody(data)
    })
  },

  deleteExperience: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.EXPERIENCES}/${id}`, {
      method: 'DELETE'
    })
  }
}

// 学习记录API
export const learningApi = {
  getLearnings: async (params?: LearningsQueryParams): Promise<Learning[]> => {
    const query = buildQueryString(params || {})
    const response = await request<PaginatedResponse<Learning> | Learning[]>(
      `${API_ENDPOINTS.LEARNINGS}${query}`
    )

    // 处理分页响应或直接数组
    if (Array.isArray(response)) {
      return response
    }

    // 如果是分页响应，返回 data 数组
    return (response as PaginatedResponse<Learning>).data
  },

  getLearning: async (id: number): Promise<Learning> => {
    return request<Learning>(`${API_ENDPOINTS.LEARNINGS}/${id}`)
  },

  createLearning: async (data: Partial<Learning>): Promise<Learning> => {
    return request<Learning>(API_ENDPOINTS.LEARNINGS, {
      method: 'POST',
      body: createJsonBody(data)
    })
  },

  updateLearning: async (id: number, data: Partial<Learning>): Promise<Learning> => {
    return request<Learning>(`${API_ENDPOINTS.LEARNINGS}/${id}`, {
      method: 'PUT',
      body: createJsonBody(data)
    })
  },

  deleteLearning: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.LEARNINGS}/${id}`, {
      method: 'DELETE'
    })
  }
}

// 生活动态API
export const lifeApi = {
  getLifePosts: async (params?: LifeQueryParams): Promise<PaginatedResponse<Life>> => {
    const query = buildQueryString(params || {})
    return request<PaginatedResponse<Life>>(`${API_ENDPOINTS.LIFE}${query}`)
  },

  getLifePost: async (id: number): Promise<Life> => {
    return request<Life>(`${API_ENDPOINTS.LIFE}/${id}`)
  },

  createLifePost: async (data: Partial<Life>): Promise<Life> => {
    return request<Life>(API_ENDPOINTS.LIFE, {
      method: 'POST',
      body: createJsonBody(data)
    })
  },

  updateLifePost: async (id: number, data: Partial<Life>): Promise<Life> => {
    return request<Life>(`${API_ENDPOINTS.LIFE}/${id}`, {
      method: 'PUT',
      body: createJsonBody(data)
    })
  },

  deleteLifePost: async (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_ENDPOINTS.LIFE}/${id}`, {
      method: 'DELETE'
    })
  }
}

// 文件上传API
export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    if (!file) {
      throw new Error('请选择要上传的文件')
    }

    // 检查文件大小 (默认 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('文件大小不能超过 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      logger.debug(`Uploading file: ${file.name} (${file.size} bytes)`)

      const response = await request<UploadResponse>(
        API_ENDPOINTS.UPLOAD,
        {
          method: 'POST',
          body: formData
        },
        getAuthHeaders('multipart/form-data')
      )

      logger.info(`File uploaded successfully: ${response.url}`)
      return response
    } catch (error) {
      logger.error(`File upload failed: ${file.name}`, error)
      throw new Error(getErrorMessage(error, '文件上传失败'))
    }
  },

  deleteFile: async (url: string): Promise<{ message: string }> => {
    // 从URL中提取文件路径
    let filePath = url

    // 如果是完整URL，提取路径部分
    try {
      const urlObj = new URL(url)
      filePath = urlObj.pathname
    } catch {
      // 如果不是完整URL，尝试提取路径
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // 已经是完整URL但URL解析失败，尝试从URL中提取路径
        const match = url.match(/\/uploads\/[^\/]+/)
        if (match) {
          filePath = match[0]
        } else {
          filePath = url
        }
      } else if (url.startsWith('/')) {
        // 相对路径，直接使用
        filePath = url
      } else {
        // 可能是文件名，需要添加路径前缀
        filePath = `/uploads/${url}`
      }
    }

    // 确保路径以 /uploads/ 开头
    if (!filePath.startsWith('/uploads/')) {
      // 如果路径不包含 /uploads/，尝试添加
      if (filePath.startsWith('/')) {
        filePath = `/uploads${filePath}`
      } else {
        filePath = `/uploads/${filePath}`
      }
    }

    const headers = getAuthHeaders()

    // 后端期望路径作为URL路径参数，例如：DELETE /api/upload/uploads/filename.jpg
    // 或者作为查询参数：DELETE /api/upload?path=/uploads/filename.jpg
    // 我们使用路径参数方式
    const deleteUrl = `${API_BASE_URL}${API_ENDPOINTS.DELETE_FILE}${filePath}`

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '删除失败' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}
