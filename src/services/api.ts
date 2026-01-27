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

const getAuthHeaders = (skipContentType = false): HeadersInit => {
  const headers: HeadersInit = {}
  const token = localStorage.getItem('token')
  
  if (!skipContentType) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  customHeaders?: HeadersInit
): Promise<T> {
  const method = options.method || 'GET'
  const url = `${API_BASE_URL}${endpoint}`
  const isFormData = options.body instanceof FormData
  
  const headers: Record<string, string> = {
    ...getAuthHeaders(isFormData) as Record<string, string>,
    ...customHeaders as Record<string, string>,
    ...options.headers as Record<string, string>
  }
  
  if (isFormData) delete headers['Content-Type']

  try {
    logger.debug(`API Request: ${method} ${url}`)

    const response = await fetch(url, {
      ...options,
      method,
      headers,
    })

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

      if (response.status === 401) {
        storage.remove('token')
        storage.remove('user')
        throw new Error('登录已过期，请重新登录')
      }

      if (response.status === 403) throw new Error('权限不足，无法访问该资源')
      if (response.status === 404) throw new Error('请求的资源不存在')
      if (response.status >= 500) throw new Error('服务器内部错误，请稍后重试')

      throw new Error(errorData.error || errorData.message || `请求失败 (${response.status})`)
    }

    logger.debug(`API Response: ${response.status} - ${endpoint}`)
    return responseData as T
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        logger.error(`Network error: ${method} ${url}`, error)
        throw new Error(`无法连接到后端服务器 ${API_BASE_URL}`)
      }
      throw error
    }
    throw new Error('网络连接失败')
  }
}

const createJsonBody = (data: unknown): string => JSON.stringify(data)

const buildQueryString = (params: Record<string, unknown> | undefined | null): string => {
  if (!params) return ''
  
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, String(v)))
    } else {
      searchParams.append(key, String(value))
    }
  })
  
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const authApi = {
  login: (data: LoginRequest) => request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: createJsonBody(data)
  }),

  getMe: () => request<{ id: number; username: string; email: string }>(API_ENDPOINTS.AUTH.ME)
}

export const profileApi = {
  getProfile: () => request<Profile>(API_ENDPOINTS.PROFILE),
  updateProfile: (data: Partial<Profile>) => request<Profile>(API_ENDPOINTS.PROFILE, {
    method: 'PUT',
    body: createJsonBody(data)
  })
}

export const skillApi = {
  getSkills: () => request<Skill[]>(API_ENDPOINTS.SKILLS),
  createSkill: (data: Partial<Skill>) => request<Skill>(API_ENDPOINTS.SKILLS, {
    method: 'POST',
    body: createJsonBody(data)
  }),
  updateSkill: (id: number, data: Partial<Skill>) => request<Skill>(`${API_ENDPOINTS.SKILLS}/${id}`, {
    method: 'PUT',
    body: createJsonBody(data)
  }),
  deleteSkill: (id: number) => request<{ message: string }>(`${API_ENDPOINTS.SKILLS}/${id}`, {
    method: 'DELETE'
  })
}

export const projectApi = {
  getProjects: (params?: ProjectsQueryParams) => {
    const query = buildQueryString(params as Record<string, unknown>)
    return request<PaginatedResponse<Project>>(`${API_ENDPOINTS.PROJECTS}${query}`)
  },
  getProject: (id: number) => request<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`),
  createProject: (data: Partial<Project>) => request<Project>(API_ENDPOINTS.PROJECTS, {
    method: 'POST',
    body: createJsonBody(data)
  }),
  updateProject: (id: number, data: Partial<Project>) => request<Project>(`${API_ENDPOINTS.PROJECTS}/${id}`, {
    method: 'PUT',
    body: createJsonBody(data)
  }),
  deleteProject: (id: number) => request<{ message: string }>(`${API_ENDPOINTS.PROJECTS}/${id}`, {
    method: 'DELETE'
  })
}

export const experienceApi = {
  getExperiences: () => request<Experience[]>(API_ENDPOINTS.EXPERIENCES),
  getExperience: (id: number) => request<Experience>(`${API_ENDPOINTS.EXPERIENCES}/${id}`),
  createExperience: (data: Partial<Experience>) => request<Experience>(API_ENDPOINTS.EXPERIENCES, {
    method: 'POST',
    body: createJsonBody(data)
  }),
  updateExperience: (id: number, data: Partial<Experience>) => request<Experience>(`${API_ENDPOINTS.EXPERIENCES}/${id}`, {
    method: 'PUT',
    body: createJsonBody(data)
  }),
  deleteExperience: (id: number) => request<{ message: string }>(`${API_ENDPOINTS.EXPERIENCES}/${id}`, {
    method: 'DELETE'
  })
}

export const learningApi = {
  getLearnings: async (params?: LearningsQueryParams) => {
    const query = buildQueryString(params as Record<string, unknown>)
    const response = await request<PaginatedResponse<Learning> | Learning[]>(`${API_ENDPOINTS.LEARNINGS}${query}`)
    return Array.isArray(response) ? response : response.data
  },
  getLearning: (id: number) => request<Learning>(`${API_ENDPOINTS.LEARNINGS}/${id}`),
  createLearning: (data: Partial<Learning>) => request<Learning>(API_ENDPOINTS.LEARNINGS, {
    method: 'POST',
    body: createJsonBody(data)
  }),
  updateLearning: (id: number, data: Partial<Learning>) => request<Learning>(`${API_ENDPOINTS.LEARNINGS}/${id}`, {
    method: 'PUT',
    body: createJsonBody(data)
  }),
  deleteLearning: (id: number) => request<{ message: string }>(`${API_ENDPOINTS.LEARNINGS}/${id}`, {
    method: 'DELETE'
  })
}

export const lifeApi = {
  getLifePosts: (params?: LifeQueryParams) => {
    const query = buildQueryString(params as Record<string, unknown>)
    return request<PaginatedResponse<Life>>(`${API_ENDPOINTS.LIFE}${query}`)
  },
  getLifePost: (id: number) => request<Life>(`${API_ENDPOINTS.LIFE}/${id}`),
  createLifePost: (data: Partial<Life>) => request<Life>(API_ENDPOINTS.LIFE, {
    method: 'POST',
    body: createJsonBody(data)
  }),
  updateLifePost: (id: number, data: Partial<Life>) => request<Life>(`${API_ENDPOINTS.LIFE}/${id}`, {
    method: 'PUT',
    body: createJsonBody(data)
  }),
  deleteLifePost: (id: number) => request<{ message: string }>(`${API_ENDPOINTS.LIFE}/${id}`, {
    method: 'DELETE'
  })
}

import { extractFilePath, validateFileType, validateFileSize, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/utils/upload'

export const uploadApi = {
  uploadFile: async (file: File) => {
    if (!file) throw new Error('请选择要上传的文件')
    if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
      throw new Error('不支持的文件类型，仅支持 JPG、PNG、GIF、WebP 格式')
    }
    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      throw new Error(`文件大小不能超过 ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      logger.debug(`Uploading file: ${file.name} (${file.size} bytes)`)
      const response = await request<UploadResponse>(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData
      })
      logger.info(`File uploaded successfully: ${response.url}`)
      return response
    } catch (error) {
      logger.error(`File upload failed: ${file.name}`, error)
      throw new Error(getErrorMessage(error, '文件上传失败'))
    }
  },

  deleteFile: async (url: string) => {
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
