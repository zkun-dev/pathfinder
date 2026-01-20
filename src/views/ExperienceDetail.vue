<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- 3D背景 -->
    <ThreeDBackground />

    <!-- 渐变遮罩 -->
    <div
      :class="[
        'absolute inset-0 z-0 transition-opacity duration-500',
        isDark
          ? 'bg-gradient-to-b from-black/50 via-black/70 to-black/90'
          : 'bg-gradient-to-b from-white/50 via-white/70 to-white/90',
      ]"
    ></div>

    <!-- 页面内容 -->
    <div class="relative z-10 container mx-auto px-4 pt-28 pb-8">
      <Header :nav-items="[]" />

      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div
          :class="[
            'inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent',
            isDark ? 'border-white' : 'border-gray-900',
          ]"
        ></div>
      </div>

      <!-- 错误状态 -->
      <div
        v-else-if="error"
        class="flex items-center justify-center min-h-screen"
      >
        <div class="text-center">
          <p
            :class="[
              'text-lg mb-4 transition-colors duration-300',
              isDark ? 'text-red-400' : 'text-red-600',
            ]"
          >
            {{ error }}
          </p>
          <button
            @click="$router.back()"
            class="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            返回
          </button>
        </div>
      </div>

      <!-- 工作经历详情 -->
      <div v-else-if="experience" class="max-w-6xl mx-auto">
        <!-- 顶部导航栏 - 固定在顶部 -->
        <div
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
          :class="[
            'sticky top-20 z-40 mb-8 backdrop-blur-md rounded-2xl border px-6 py-4 transition-all duration-300',
            isDark
              ? 'bg-black/50 border-white/10 shadow-xl'
              : 'bg-white/80 border-gray-200 shadow-lg',
          ]"
        >
          <div class="flex items-center justify-between gap-4">
            <button
              @click="$router.back()"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105',
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              ]"
            >
              <i class="fa-solid fa-arrow-left"></i>
              <span class="hidden sm:inline">返回</span>
            </button>
            
            <router-link
              to="/experiences"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105',
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
              ]"
            >
              <i class="fa-solid fa-list"></i>
              <span class="hidden sm:inline">所有工作经历</span>
            </router-link>
          </div>
        </div>

        <!-- 主要内容区域 - 两栏布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <!-- 左侧主内容区 -->
          <div class="lg:col-span-2 space-y-8">
            <!-- 标题区域 -->
            <div
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
              :class="[
                'backdrop-blur-md rounded-2xl p-8 transition-colors shadow-xl border',
                isDark
                  ? 'bg-white/10 border-white/10'
                  : 'bg-white/80 border-gray-200',
              ]"
            >
              <div class="flex items-start gap-6 mb-6">
                <div
                  v-if="experience.companyLogo"
                  class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl"
                >
                  <img
                    :src="experience.companyLogo"
                    :alt="experience.companyName"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  :class="[
                    'w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl',
                    isDark
                      ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'
                      : 'bg-gradient-to-br from-blue-100 to-purple-100',
                  ]"
                >
                  <i
                    :class="[
                      'fa-solid fa-building text-4xl',
                      isDark ? 'text-white/50' : 'text-gray-700/30',
                    ]"
                  ></i>
                </div>
                <div class="flex-1">
                  <h1
                    :class="[
                      'text-4xl md:text-5xl font-bold mb-2 transition-colors',
                      isDark ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ experience.position }}
                  </h1>
                  <p
                    :class="[
                      'text-2xl transition-colors mb-4',
                      isDark ? 'text-gray-300' : 'text-gray-600',
                    ]"
                  >
                    {{ experience.companyName }}
                  </p>
                  <div
                    :class="[
                      'flex items-center gap-4 text-lg transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-600',
                    ]"
                  >
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-calendar"></i>
                      {{ formatDate(experience.startDate) }} -
                      {{ experience.endDate ? formatDate(experience.endDate) : '至今' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 描述 -->
            <div
              v-if="experience.description"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
              :class="[
                'backdrop-blur-md rounded-2xl p-8 transition-colors shadow-xl border',
                isDark
                  ? 'bg-white/10 border-white/10'
                  : 'bg-white/80 border-gray-200',
              ]"
            >
              <h2
                :class="[
                  'text-2xl font-bold mb-4 transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                工作描述
              </h2>
              <p
                :class="[
                  'text-lg leading-relaxed transition-colors',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                {{ experience.description }}
              </p>
            </div>

            <!-- 成就 -->
            <div
              v-if="experience.achievements && experience.achievements.length > 0"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
              :class="[
                'backdrop-blur-md rounded-2xl p-8 transition-colors shadow-xl border',
                isDark
                  ? 'bg-white/10 border-white/10'
                  : 'bg-white/80 border-gray-200',
              ]"
            >
              <div class="flex items-center gap-2 mb-6">
                <i
                  :class="[
                    'fa-solid fa-trophy text-2xl',
                    isDark ? 'text-yellow-400' : 'text-yellow-600',
                  ]"
                ></i>
                <h2
                  :class="[
                    'text-2xl font-bold transition-colors',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  主要成就
                </h2>
              </div>
              <ul class="space-y-4">
                <li
                  v-for="(achievement, index) in experience.achievements"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <i
                    :class="[
                      'fa-solid fa-check-circle mt-1 flex-shrink-0 text-lg',
                      isDark ? 'text-green-400' : 'text-green-600',
                    ]"
                  ></i>
                  <span
                    :class="[
                      'text-lg transition-colors',
                      isDark ? 'text-gray-300' : 'text-gray-700',
                    ]"
                  >
                    {{ achievement }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- 详细内容 -->
            <div
              v-if="experience.content"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
              :class="[
                'prose prose-lg max-w-none',
                isDark ? 'prose-invert' : '',
              ]"
            >
              <div
                :class="[
                  'backdrop-blur-md rounded-2xl p-8 md:p-10 transition-colors shadow-xl border',
                  isDark
                    ? 'bg-white/10 border-white/10'
                    : 'bg-white/80 border-gray-200',
                ]"
              >
                <h2
                  :class="[
                    'text-2xl font-bold mb-6 transition-colors',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  详细内容
                </h2>
                <div v-html="formatMarkdown(experience.content)"></div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="lg:col-span-1 space-y-6">
            <!-- 技术栈卡片 -->
            <div
              v-if="experience.techStack && experience.techStack.length > 0"
              v-motion
              :initial="{ opacity: 0, x: 30 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 600, delay: 300 } }"
              :class="[
                'backdrop-blur-md rounded-2xl p-6 transition-colors shadow-xl border sticky top-32',
                isDark
                  ? 'bg-white/10 border-white/10'
                  : 'bg-white/80 border-gray-200',
              ]"
            >
              <div class="flex items-center gap-2 mb-4">
                <i
                  :class="[
                    'fa-solid fa-code text-xl',
                    isDark ? 'text-blue-400' : 'text-blue-600',
                  ]"
                ></i>
                <h3
                  :class="[
                    'text-xl font-bold transition-colors',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  技术栈
                </h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in experience.techStack"
                  :key="tech"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-400/50'
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 hover:border-blue-300',
                  ]"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- 工作信息卡片 -->
            <div
              v-motion
              :initial="{ opacity: 0, x: 30 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 600, delay: 400 } }"
              :class="[
                'backdrop-blur-md rounded-2xl p-6 transition-colors shadow-xl border',
                isDark
                  ? 'bg-white/10 border-white/10'
                  : 'bg-white/80 border-gray-200',
              ]"
            >
              <h3
                :class="[
                  'text-xl font-bold mb-4 transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                工作信息
              </h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <i
                      :class="[
                        'fa-solid fa-building text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    ></i>
                    <span
                      :class="[
                        'text-sm font-semibold',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    >
                      公司
                    </span>
                  </div>
                  <p
                    :class="[
                      'text-base font-medium transition-colors',
                      isDark ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ experience.companyName }}
                  </p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <i
                      :class="[
                        'fa-solid fa-briefcase text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    ></i>
                    <span
                      :class="[
                        'text-sm font-semibold',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    >
                      职位
                    </span>
                  </div>
                  <p
                    :class="[
                      'text-base font-medium transition-colors',
                      isDark ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ experience.position }}
                  </p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <i
                      :class="[
                        'fa-solid fa-calendar text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    ></i>
                    <span
                      :class="[
                        'text-sm font-semibold',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    >
                      时间
                    </span>
                  </div>
                  <p
                    :class="[
                      'text-sm transition-colors',
                      isDark ? 'text-gray-300' : 'text-gray-600',
                    ]"
                  >
                    {{ formatDate(experience.startDate) }} -
                    {{ experience.endDate ? formatDate(experience.endDate) : '至今' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { useTheme } from '@/composables/useTheme';
import Header from '@/components/Header.vue';
import { experienceApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Experience } from '@/types';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

const route = useRoute();
const { isDark } = useTheme();

const experience = ref<Experience | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchExperience = async () => {
  try {
    loading.value = true;
    error.value = null;
    const id = parseInt(route.params.id as string);
    experience.value = await experienceApi.getExperience(id);
  } catch (err: any) {
    logger.error('获取工作经历详情失败:', err);
    error.value = err.message || '获取工作经历详情失败';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatMarkdown = (content: string) => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">$1</code>');
};

onMounted(() => {
  fetchExperience();
});
</script>

<style scoped>
.prose {
  @apply text-gray-600 dark:text-gray-300;
}
.prose-invert {
  @apply text-gray-300;
}
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  @apply font-bold mb-4 mt-6;
}
.prose :deep(h1) {
  @apply text-3xl;
}
.prose :deep(h2) {
  @apply text-2xl;
}
.prose :deep(h3) {
  @apply text-xl;
}
.prose :deep(p) {
  @apply mb-4 leading-relaxed;
}
.prose :deep(ul),
.prose :deep(ol) {
  @apply mb-4 pl-6;
}
.prose :deep(li) {
  @apply mb-2;
}
.prose :deep(code) {
  @apply px-2 py-1 rounded;
}
.prose :deep(strong) {
  @apply font-bold;
}
.prose :deep(em) {
  @apply italic;
}
</style>
