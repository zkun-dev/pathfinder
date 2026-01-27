<template>
  <div class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
    <!-- 3D背景 -->
    <ThreeDBackground />

    <!-- 渐变遮罩，使前景内容更清晰 -->
    <div
      :class="[
        'absolute inset-0 z-0 transition-opacity duration-500',
        isDark
          ? 'bg-gradient-to-b from-black/50 via-black/70 to-black/90'
          : 'bg-gradient-to-b from-white/50 via-white/70 to-white/90',
      ]"
    ></div>

    <!-- 登录表单 -->
    <div class="relative z-10 w-full max-w-md px-4">
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        :class="[
          'backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border transition-all duration-300',
          isDark
            ? 'bg-black/50 border-white/10'
            : 'bg-white/80 border-gray-200',
        ]"
      >
        <!-- Logo和标题 -->
        <div
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
          class="text-center mb-8"
        >
          <div
            :class="[
              'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300',
              isDark
                ? 'bg-blue-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-600',
            ]"
          >
            <i
              :class="[
                'fa-solid fa-compass text-lg text-white',
              ]"
            ></i>
          </div>
          <h1
            :class="[
              'text-2xl md:text-3xl font-bold mb-2 transition-colors whitespace-nowrap',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            >
              PathFinder
            </span>
            <span :class="[isDark ? 'text-gray-300' : 'text-gray-700']">
              管理后台
            </span>
          </h1>
          <p
            :class="[
              'text-sm transition-colors',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            请登录以访问管理功能
          </p>
        </div>

        <!-- 登录表单 -->
        <form
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
          @submit.prevent="handleLogin"
          class="space-y-6"
        >
          <!-- 用户名输入 -->
          <div>
            <label
              :class="[
                'flex items-center gap-2 text-sm font-semibold mb-2 transition-colors',
                isDark ? 'text-gray-300' : 'text-gray-700',
              ]"
            >
              <i
                :class="[
                  'fa-solid fa-user text-sm',
                  isDark ? 'text-blue-400' : 'text-blue-600',
                ]"
              ></i>
              用户名
            </label>
            <div class="relative">
              <input
                v-model="form.username"
                type="text"
                required
                :class="[
                  'w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2',
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30'
                    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20',
                ]"
                placeholder="请输入用户名"
              />
              <i
                class="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                :class="[
                  isDark ? 'text-gray-500' : 'text-gray-400',
                ]"
              ></i>
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label
              :class="[
                'flex items-center gap-2 text-sm font-semibold mb-2 transition-colors',
                isDark ? 'text-gray-300' : 'text-gray-700',
              ]"
            >
              <i
                :class="[
                  'fa-solid fa-lock text-sm',
                  isDark ? 'text-blue-400' : 'text-blue-600',
                ]"
              ></i>
              密码
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :class="[
                  'w-full pl-11 pr-12 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2',
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/30'
                    : 'bg-white/60 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20',
                ]"
                placeholder="请输入密码"
              />
              <i
                class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                :class="[
                  isDark ? 'text-gray-500' : 'text-gray-400',
                ]"
              ></i>
              <button
                type="button"
                @click="showPassword = !showPassword"
                :class="[
                  'absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors hover:scale-110',
                  isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                <i
                  :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                ></i>
              </button>
            </div>
          </div>

          <!-- 错误提示 -->
          <div
            v-if="error"
            v-motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 300 } }"
            :class="[
              'p-4 rounded-xl border backdrop-blur-sm transition-all duration-300',
              isDark
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-red-50 border-red-200',
            ]"
          >
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation text-red-500"></i>
              <p class="text-sm text-red-500 font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            :class="[
              'w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
              loading
                ? 'bg-gray-500 cursor-wait'
                : isDark
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-105 active:scale-95'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95',
            ]"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <i class="fa-solid fa-spinner fa-spin"></i>
              登录中...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <i class="fa-solid fa-sign-in-alt"></i>
              登录
            </span>
          </button>
        </form>

        <!-- 底部提示 -->
        <div
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 600, delay: 400 } }"
          class="mt-6 text-center"
        >
          <p
            :class="[
              'text-xs transition-colors',
              isDark ? 'text-gray-500' : 'text-gray-400',
            ]"
          >
            <i class="fa-solid fa-shield-halved mr-1"></i>
            安全登录，保护您的账户信息
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { useAuth } from '@/composables/useAuth';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

const router = useRouter();
const { isDark } = useTheme();
const { login } = useAuth();

const form = ref({
  username: '',
  password: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null
    await login(form.value)
    
    // 处理重定向：如果有 redirect 参数，跳转到指定页面；否则跳转到仪表盘
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    if (redirect && redirect.startsWith('/admin')) {
      router.push(redirect)
    } else {
      router.push('/admin/dashboard')
    }
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>
