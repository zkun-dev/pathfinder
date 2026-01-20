import { ref, computed } from 'vue';
import { authApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { LoginRequest, LoginResponse } from '@/types';

const token = ref<string | null>(localStorage.getItem('token'));
const user = ref<{ id: number; username: string; email: string } | null>(null);

// 从localStorage恢复用户信息（如果有）
const savedUser = localStorage.getItem('user');
if (savedUser) {
  try {
    user.value = JSON.parse(savedUser);
  } catch (e) {
    logger.error('Failed to parse saved user:', e);
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response: LoginResponse = await authApi.login(credentials);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.message || '登录失败');
    }
  };

  const logout = (): void => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getMe = async (): Promise<void> => {
    try {
      const me = await authApi.getMe();
      user.value = me;
      localStorage.setItem('user', JSON.stringify(me));
    } catch (error: any) {
      // 如果获取用户信息失败，清除token
      logout();
      throw error;
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    getMe,
  };
}
