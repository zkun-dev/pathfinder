import { ref, computed, watch } from 'vue'
import { authApi } from '@/services/api'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/utils'
import type { LoginRequest, LoginResponse } from '@/types'

const token = ref<string | null>(storage.getRaw('token'))
const user = ref<{ id: number; username: string; email: string } | null>(storage.get('user'))

// 监听 token 变化，同步到 localStorage
watch(
  token,
  (newToken) => {
    if (newToken) {
      storage.setRaw('token', newToken)
    } else {
      storage.remove('token')
    }
  },
  { immediate: false }
)

// 监听 user 变化，同步到 localStorage
watch(
  user,
  (newUser) => {
    if (newUser) {
      storage.set('user', newUser)
    } else {
      storage.remove('user')
    }
  },
  { immediate: false }
)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials)
      token.value = response.token
      user.value = response.user
    } catch (error) {
      logger.error('登录失败', error)
      throw error instanceof Error ? error : new Error('登录失败')
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  const getMe = async () => {
    try {
      user.value = await authApi.getMe()
    } catch (error) {
      logger.error('获取用户信息失败', error)
      logout()
      throw error
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    getMe
  }
}
