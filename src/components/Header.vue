<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-16 flex justify-between items-center px-4 backdrop-blur-md"
    :class="[
      isDark ? 'bg-black/50 border-b border-white/10' : 'bg-white/80 border-b border-gray-200',
    ]"
  >
    <div
      :class="[
        'text-lg md:text-2xl font-bold transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        <span class="hidden sm:inline">PathFinder | 成长足迹</span>
        <span class="sm:hidden">PathFinder</span>
      </span>
    </div>

    <!-- 移动端菜单按钮 -->
    <button
      v-if="showNav"
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="md:hidden p-2 rounded-lg transition-colors"
      :class="[
        isDark
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      ]"
    >
      <i :class="mobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
    </button>

    <!-- 桌面端导航 -->
    <nav v-if="showNav" class="hidden md:flex items-center space-x-4">
      <router-link
        v-for="(item, index) in navItems"
        :key="`nav-${item.label}-${index}`"
        :to="item.href"
        :class="[
          'relative px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer',
          isActive(item.href)
            ? isDark
              ? 'text-white bg-white/10 font-semibold'
              : 'text-gray-900 bg-gray-100 font-semibold'
            : isDark
              ? 'text-gray-300 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
        ]"
      >
        {{ item.label }}
        <span
          v-if="isActive(item.href)"
          :class="[
            'absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full',
            isDark ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-600',
          ]"
        ></span>
      </router-link>
    </nav>

    <div class="flex items-center gap-2 md:gap-3">
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
      <router-link
        to="/admin/login"
        :class="[
          'p-2 rounded-lg transition-colors',
          isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        ]"
        title="管理后台"
      >
        <i class="fa-solid fa-shield-halved"></i>
      </router-link>
    </div>

    <!-- 移动端导航菜单 -->
    <Transition name="mobile-menu">
      <nav
        v-if="showNav && mobileMenuOpen"
        class="md:hidden fixed top-16 left-0 right-0 z-40 backdrop-blur-md border-b"
        :class="[
          isDark
            ? 'bg-black/90 border-white/10'
            : 'bg-white/95 border-gray-200',
        ]"
      >
        <div class="px-4 py-4 space-y-2">
          <router-link
            v-for="(item, index) in navItems"
            :key="`mobile-nav-${item.label}-${index}`"
            :to="item.href"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-4 py-3 rounded-lg transition-all duration-300',
              isActive(item.href)
                ? isDark
                  ? 'text-white bg-white/10 font-semibold'
                  : 'text-gray-900 bg-gray-100 font-semibold'
                : isDark
                ? 'text-gray-300 hover:text-white hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ]"
          >
            {{ item.label }}
          </router-link>
        </div>
      </nav>
    </Transition>

    <!-- 移动端菜单遮罩 -->
    <Transition name="fade">
      <div
        v-if="showNav && mobileMenuOpen"
        @click="mobileMenuOpen = false"
        class="md:hidden fixed inset-0 bg-black/50 z-30 top-16"
      ></div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import type { NavItem } from '@/types';

defineProps<{
  navItems: NavItem[];
}>();

const route = useRoute();
const { toggleTheme, isDark } = useTheme();
const mobileMenuOpen = ref(false);

// 在首页、列表页和详情页显示导航，排除管理后台页面
const showNav = computed(() => {
  const path = route.path;
  // 排除管理后台页面
  if (path.startsWith('/admin')) {
    return false;
  }
  // 在首页、列表页和详情页显示导航
  return true;
});

const isActive = (path: string) => {
  // 基于当前路由路径判断是否激活
  return route.path === path;
};
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
