<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      isDark ? 'bg-gray-900' : 'bg-gray-50',
    ]"
  >
    <!-- 侧边栏 -->
    <aside
      :class="[
        'fixed left-0 top-0 h-full w-64 transition-all duration-300 z-40',
        isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200',
        sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0',
      ]"
    >
      <!-- Logo区域 -->
      <div
        :class="[
          'h-16 flex items-center px-4 border-b transition-colors',
          isDark ? 'border-gray-700' : 'border-gray-200',
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            :class="isDark ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'"
          >
            <i class="fa-solid fa-compass text-sm"></i>
          </div>
          <transition name="fade">
            <span
              v-if="!sidebarCollapsed"
              :class="[
                'text-lg font-bold transition-colors whitespace-nowrap',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              PathFinder
            </span>
          </transition>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 overflow-y-auto py-4">
        <div class="px-2 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
              $route.path === item.path
                ? isDark
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-blue-500 text-white shadow-md'
                : isDark
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            <i :class="[item.icon, 'text-lg flex-shrink-0']"></i>
            <transition name="fade">
              <span v-if="!sidebarCollapsed" class="font-medium whitespace-nowrap">
                {{ item.label }}
              </span>
            </transition>
            <transition name="fade">
              <span
                v-if="sidebarCollapsed && $route.path === item.path"
                class="absolute left-full ml-2 px-2 py-1 rounded bg-gray-900 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50"
              >
                {{ item.label }}
              </span>
            </transition>
          </router-link>
        </div>
      </nav>

      <!-- 底部用户信息 -->
      <div
        :class="[
          'p-4 border-t transition-colors',
          isDark ? 'border-gray-700' : 'border-gray-200',
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'"
          >
            {{ user?.username?.[0]?.toUpperCase() || 'U' }}
          </div>
          <transition name="fade">
            <div v-if="!sidebarCollapsed" class="flex-1 min-w-0">
              <p
                :class="[
                  'text-sm font-medium truncate transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ user?.username }}
              </p>
              <p
                :class="[
                  'text-xs truncate transition-colors',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                管理员
              </p>
            </div>
          </transition>
        </div>
      </div>
    </aside>

      <!-- 主内容区域 -->
      <div
        :class="[
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-0 lg:ml-64',
        ]"
      >
      <!-- 顶部栏 -->
      <header
        :class="[
          'sticky top-0 z-30 h-16 border-b transition-colors',
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        ]"
      >
        <div class="h-full px-4 lg:px-6 flex items-center justify-between">
          <!-- 左侧：菜单切换按钮 -->
          <button
            @click="toggleSidebar"
            :class="[
              'p-2 rounded-lg transition-colors',
              isDark
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            <i class="fa-solid fa-bars text-lg"></i>
          </button>

          <!-- 中间：面包屑导航 -->
          <div class="flex-1 hidden md:flex items-center gap-2 px-4">
            <span
              :class="[
                'text-sm transition-colors',
                isDark ? 'text-gray-400' : 'text-gray-500',
              ]"
            >
              管理后台
            </span>
            <i
              :class="[
                'fa-solid fa-chevron-right text-xs transition-colors',
                isDark ? 'text-gray-600' : 'text-gray-400',
              ]"
            ></i>
            <span
              :class="[
                'text-sm font-medium transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ currentPageTitle }}
            </span>
          </div>

          <!-- 右侧：操作按钮 -->
          <div class="flex items-center gap-3">
            <!-- 主题切换 -->
            <button
              @click="toggleTheme"
              :class="[
                'p-2 rounded-lg transition-colors',
                isDark
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ]"
              :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            >
              <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
            </button>

            <!-- 通知 -->
            <button
              :class="[
                'relative p-2 rounded-lg transition-colors',
                isDark
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ]"
              title="通知"
            >
              <i class="fa-solid fa-bell"></i>
              <span
                class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"
              ></span>
            </button>

            <!-- 用户菜单 -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                :class="
                  isDark
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                "
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  :class="isDark ? 'bg-gray-700' : 'bg-gray-300'"
                >
                  {{ user?.username?.[0]?.toUpperCase() || 'U' }}
                </div>
                <span
                  class="hidden md:block text-sm font-medium transition-colors"
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                >
                  {{ user?.username }}
                </span>
                <i
                  class="fa-solid fa-chevron-down text-xs transition-colors"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                ></i>
              </button>

              <!-- 用户下拉菜单 -->
              <transition name="dropdown">
                <div
                  v-if="showUserMenu"
                  :class="[
                    'absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50',
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200',
                  ]"
                >
                  <a
                    href="#"
                    @click.prevent
                    :class="[
                      'block px-4 py-2 text-sm transition-colors',
                      isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100',
                    ]"
                  >
                    <i class="fa-solid fa-user mr-2"></i>
                    个人设置
                  </a>
                  <a
                    href="#"
                    @click.prevent
                    :class="[
                      'block px-4 py-2 text-sm transition-colors',
                      isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100',
                    ]"
                  >
                    <i class="fa-solid fa-cog mr-2"></i>
                    系统设置
                  </a>
                  <div
                    :class="[
                      'border-t my-1',
                      isDark ? 'border-gray-700' : 'border-gray-200',
                    ]"
                  ></div>
                  <a
                    href="#"
                    @click.prevent="handleLogout"
                    :class="[
                      'block px-4 py-2 text-sm transition-colors',
                      isDark
                        ? 'text-red-400 hover:bg-gray-700'
                        : 'text-red-600 hover:bg-gray-100',
                    ]"
                  >
                    <i class="fa-solid fa-sign-out-alt mr-2"></i>
                    退出登录
                  </a>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <main
        :class="[
          'p-3 sm:p-4 lg:p-6 transition-colors',
          isDark ? 'bg-gray-900' : 'bg-gray-50',
        ]"
      >
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <Suspense>
              <template #default>
                <component :is="Component" :key="route.path" />
              </template>
              <template #fallback>
                <div class="flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner show-text text="加载中..." />
                </div>
              </template>
            </Suspense>
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 移动端遮罩层 -->
    <div
      v-if="!sidebarCollapsed"
      @click="toggleSidebar"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, Suspense } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { useAuth } from '@/composables/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const { user, logout } = useAuth();

const sidebarCollapsed = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const menuItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: 'fa-solid fa-chart-line' },
  { path: '/admin/profile', label: '个人信息', icon: 'fa-solid fa-user' },
  { path: '/admin/skills', label: '技能管理', icon: 'fa-solid fa-code' },
  { path: '/admin/projects', label: '项目管理', icon: 'fa-solid fa-folder' },
  { path: '/admin/experiences', label: '工作经历', icon: 'fa-solid fa-briefcase' },
  { path: '/admin/learnings', label: '学习记录', icon: 'fa-solid fa-book' },
  { path: '/admin/life', label: '生活动态', icon: 'fa-solid fa-heart' },
];

const currentPageTitle = computed(() => {
  const item = menuItems.find((item) => route.path === item.path);
  return item?.label || '管理后台';
});

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const handleLogout = () => {
  logout();
  router.push('/admin/login');
  showUserMenu.value = false;
};

// 点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // 移动端默认收起侧边栏
  if (window.innerWidth < 1024) {
    sidebarCollapsed.value = true;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
