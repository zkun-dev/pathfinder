import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/utils'
import type { LoginRequest, LoginResponse } from '@/types'

const token = ref<string | null>(storage.getRaw('token'))
const user = ref<{ id: number; username: string; email: string } | null>(storage.get('user'))

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response: LoginResponse = await authApi.login(credentials)
      token.value = response.token
      user.value = response.user
      storage.setRaw('token', response.token)
      storage.set('user', response.user)
    } catch (error: any) {
      throw new Error(error.message || '登录失败')
    }
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    storage.remove('token')
    storage.remove('user')
  }

  const getMe = async (): Promise<void> => {
    try {
      const me = await authApi.getMe()
      user.value = me
      storage.set('user', me)
    } catch (error: any) {
      // 如果获取用户信息失败，清除token
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
