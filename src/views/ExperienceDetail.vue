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
      <Header :nav-items="NAV_ITEMS" />

      <!-- 加载状态 -->
      <div v-if="loading" class="fixed inset-0 flex items-center justify-center overflow-hidden z-20">
        <LoadingSpinner size="md" />
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
        <!-- 顶部导航栏 -->
        <div class="sticky top-20 z-40 mb-8 pb-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-200'">
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

        <!-- 主要内容区域 -->
        <div class="space-y-12 mb-12">
          <!-- 标题区域 -->
          <section class="space-y-6">
            <div class="flex items-start gap-6">
              <div
                v-if="experience.companyLogo"
                class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
              >
                <ImageWithPlaceholder
                  :src="experience.companyLogo"
                  :alt="experience.companyName"
                  container-class="w-full h-full"
                  image-class="w-full h-full object-cover"
                  placeholder-class="w-full h-full"
                  placeholder-icon-class="text-2xl"
                />
              </div>
              <div
                v-else
                :class="[
                  'w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0',
                  isDark
                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'
                    : 'bg-gradient-to-br from-blue-100 to-purple-100',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-building text-3xl',
                    isDark ? 'text-white/50' : 'text-gray-700/30',
                  ]"
                ></i>
              </div>
              <div class="flex-1">
                <h1
                  :class="[
                    'text-4xl md:text-5xl font-bold mb-2',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ experience.position }}
                </h1>
                <p
                  :class="[
                    'text-2xl mb-4',
                    isDark ? 'text-gray-300' : 'text-gray-600',
                  ]"
                >
                  {{ experience.companyName }}
                </p>
                <div
                  :class="[
                    'flex items-center gap-4 text-base',
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
          </section>

          <!-- 工作描述 -->
          <section v-if="experience.description" class="space-y-4 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30'
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-file-text text-xl',
                    isDark ? 'text-blue-400' : 'text-blue-600',
                  ]"
                ></i>
              </div>
              <h2
                :class="[
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                工作描述
              </h2>
            </div>
            <div
              :class="[
                'p-6 rounded-xl',
                isDark
                  ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200/50',
              ]"
            >
              <p
                :class="[
                  'text-lg leading-relaxed',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                {{ experience.description }}
              </p>
            </div>
          </section>

          <!-- 主要成就 -->
          <section v-if="experience.achievements && experience.achievements.length > 0" class="space-y-4 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                    : 'bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-trophy text-xl',
                    isDark ? 'text-yellow-400' : 'text-yellow-600',
                  ]"
                ></i>
              </div>
              <h2
                :class="[
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                主要成就
              </h2>
            </div>
            <div
              :class="[
                'p-6 rounded-xl space-y-4',
                isDark
                  ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200/50',
              ]"
            >
              <ul class="space-y-4">
                <li
                  v-for="(achievement, index) in experience.achievements"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <div
                    :class="[
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                      isDark
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-green-100 text-green-600',
                    ]"
                  >
                    <i class="fa-solid fa-check text-xs"></i>
                  </div>
                  <span
                    :class="[
                      'text-lg leading-relaxed',
                      isDark ? 'text-gray-300' : 'text-gray-700',
                    ]"
                  >
                    {{ achievement }}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <!-- 详细内容 -->
          <section v-if="experience.content" class="space-y-4 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                    : 'bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-file-lines text-xl',
                    isDark ? 'text-purple-400' : 'text-purple-600',
                  ]"
                ></i>
              </div>
              <h2
                :class="[
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                详细内容
              </h2>
            </div>
            <div
              :class="[
                'prose prose-lg max-w-none p-6 rounded-xl',
                isDark
                  ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 prose-invert'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200/50',
              ]"
            >
              <div v-html="formatMarkdown(experience.content)"></div>
            </div>
          </section>

          <!-- 技术栈和工作信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <!-- 技术栈 -->
            <div
              v-if="experience.techStack && experience.techStack.length > 0"
              :class="[
                'p-6 rounded-xl space-y-4',
                isDark
                  ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20'
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50',
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isDark
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-100 text-blue-600',
                  ]"
                >
                  <i class="fa-solid fa-code"></i>
                </div>
                <h3
                  :class="[
                    'text-xl font-bold',
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
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-400/50'
                      : 'bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300',
                  ]"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- 工作信息 -->
            <div
              :class="[
                'p-6 rounded-xl space-y-4',
                isDark
                  ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200/50',
              ]"
            >
              <h3
                :class="[
                  'text-xl font-bold flex items-center gap-3',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isDark
                      ? 'bg-gray-600/50 text-gray-300'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  <i class="fa-solid fa-info-circle"></i>
                </div>
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
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import { NAV_ITEMS } from '@/constants';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { experienceApi } from '@/services/api';
import { logger } from '@/utils/logger';
import { renderMarkdown } from '@/utils/markdown';
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
  return renderMarkdown(content);
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
