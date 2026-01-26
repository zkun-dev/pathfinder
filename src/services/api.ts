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
  ApiError,
  ProjectsQueryParams,
  LearningsQueryParams,
  LifeQueryParams,
  UploadResponse
} from '@/types'

// 请求拦截器：添加认证token
const getAuthHeaders = (skipContentType: boolean = false): HeadersInit => {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {}

  // 对于文件上传，不设置 Content-Type，让浏览器自动设置（包含 boundary）
  if (!skipContentType) {
    headers['Content-Type'] = 'application/json'
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
  
  // 如果是 FormData，不设置默认的 Content-Type
  const isFormData = options.body instanceof FormData
  const defaultHeaders = getAuthHeaders(isFormData)

  try {
    logger.debug(`API Request: ${options.method || 'GET'} ${url}`)

    // 合并 headers，但如果是 FormData 且没有显式设置 Content-Type，则让浏览器自动设置
    const mergedHeaders: Record<string, string> = {
      ...defaultHeaders as Record<string, string>,
      ...customHeaders as Record<string, string>,
      ...options.headers as Record<string, string>
    }
    
    // 如果是 FormData，删除手动设置的 Content-Type（让浏览器自动设置）
    if (isFormData && mergedHeaders['Content-Type']?.includes('multipart/form-data')) {
      delete mergedHeaders['Content-Type']
    }

    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders
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

import { extractFilePath, validateFileType, validateFileSize, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/utils/upload'

// 文件上传API
export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    if (!file) {
      throw new Error('请选择要上传的文件')
    }

    // 验证文件类型
    if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
      throw new Error('不支持的文件类型，仅支持 JPG、PNG、GIF、WebP 格式')
    }

    // 验证文件大小
    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024)
      throw new Error(`文件大小不能超过 ${maxSizeMB}MB`)
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
          // request 函数会自动处理 FormData，不设置 Content-Type
        }
      )

      logger.info(`File uploaded successfully: ${response.url}`)
      return response
    } catch (error) {
      logger.error(`File upload failed: ${file.name}`, error)
      throw new Error(getErrorMessage(error, '文件上传失败'))
    }
  },

  deleteFile: async (url: string): Promise<{ message: string }> => {
    // 使用工具函数提取文件路径
    const filePath = extractFilePath(url)

    const deleteUrl = `${API_BASE_URL}${API_ENDPOINTS.DELETE_FILE}${filePath}`

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '删除失败' }))
      throw new Error(error.error || `删除失败 (${response.status})`)
    }

    return response.json()
  }
}
