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

    <!-- 头部导航 - 始终显示 -->
    <Header :nav-items="NAV_ITEMS" />

    <!-- 加载状态 - 只占据内容区域，不覆盖头部 -->
    <div 
      v-if="loading" 
      class="fixed top-16 left-0 right-0 bottom-0 z-40"
      style="position: fixed; top: 4rem; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0;"
    >
      <LoadingSpinner size="md" />
    </div>

    <!-- 页面内容 -->
    <div v-if="!loading" class="relative z-10 container mx-auto px-4 pt-28 pb-8">

      <!-- 错误状态 -->
      <div v-if="error" class="flex items-center justify-center min-h-screen">
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

      <!-- 项目详情 -->
      <div v-else-if="project" class="max-w-6xl mx-auto">
        <!-- 顶部导航栏 -->
        <div class="sticky top-16 sm:top-20 z-40 mb-8 pb-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-200'">
          <div class="flex items-center justify-between gap-2 sm:gap-4">
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
            
            <div class="flex items-center gap-3">
              <span
                v-if="project.featured"
                class="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
              >
                <i class="fa-solid fa-star mr-1"></i>
                精选项目
              </span>
              <router-link
                to="/projects"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
                ]"
              >
                <i class="fa-solid fa-list"></i>
                <span class="hidden sm:inline">所有项目</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 封面图 - 全宽大图 -->
        <div
          v-if="project.coverImage"
          class="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group"
        >
          <div class="aspect-video w-full relative">
            <ImageWithPlaceholder
              :src="project.coverImage"
              :alt="project.title"
              container-class="w-full h-full"
              image-class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              placeholder-class="w-full h-full"
              placeholder-icon-class="text-4xl"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            ></div>
            <!-- 标题覆盖在图片上 -->
            <div class="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
              <div class="w-full">
                <h1
                  :class="[
                    'text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-2 sm:mb-4 text-white drop-shadow-2xl leading-tight',
                  ]"
                >
                  {{ project.title }}
                </h1>
                <p
                  v-if="project.description"
                  class="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl drop-shadow-lg"
                >
                  {{ project.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 无封面图时的标题区域 -->
        <div
          v-else
          class="mb-12"
        >
          <div class="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h1
              :class="[
                'text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold transition-colors leading-tight',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ project.title }}
            </h1>
            <span
              v-if="project.featured"
              class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
            >
              <i class="fa-solid fa-star mr-1"></i>
              精选项目
            </span>
          </div>
          <p
            v-if="project.description"
            :class="[
              'text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ project.description }}
          </p>
        </div>

        <!-- 主要内容区域 -->
        <div class="space-y-12 mb-12">
          <!-- 项目信息 -->
          <section class="space-y-6 pt-8">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                    : 'bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-info-circle text-xl',
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
                项目信息
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- 项目类型 -->
              <div
                v-if="project.type"
                :class="[
                  'p-6 rounded-xl space-y-3 transition-all duration-300 hover:scale-[1.02]',
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
                    <i class="fa-solid fa-tag"></i>
                  </div>
                  <span
                    :class="[
                      'text-sm font-semibold uppercase tracking-wider',
                      isDark ? 'text-gray-400' : 'text-gray-500',
                    ]"
                  >
                    项目类型
                  </span>
                </div>
                <p
                  :class="[
                    'text-xl font-semibold',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ project.type }}
                </p>
              </div>

              <!-- 时间信息 -->
              <div
                v-if="project.startDate || project.endDate"
                :class="[
                  'p-6 rounded-xl space-y-3 transition-all duration-300 hover:scale-[1.02]',
                  isDark
                    ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50',
                ]"
              >
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isDark
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-purple-100 text-purple-600',
                    ]"
                  >
                    <i class="fa-solid fa-calendar"></i>
                  </div>
                  <span
                    :class="[
                      'text-sm font-semibold uppercase tracking-wider',
                      isDark ? 'text-gray-400' : 'text-gray-500',
                    ]"
                  >
                    项目时间
                  </span>
                </div>
                <p
                  :class="[
                    'text-xl font-semibold',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  <span v-if="project.startDate">{{ formatDate(project.startDate) }}</span>
                  <span v-if="project.startDate && project.endDate"> - </span>
                  <span v-if="project.endDate">{{ formatDate(project.endDate) }}</span>
                  <span v-if="!project.endDate && project.startDate"> 至今</span>
                </p>
              </div>
            </div>
          </section>

          <!-- 项目概述 -->
          <section v-if="project.content" class="space-y-6 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
                    : 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-file-text text-xl',
                    isDark ? 'text-green-400' : 'text-green-600',
                  ]"
                ></i>
              </div>
              <h2
                :class="[
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                项目概述
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
              <div v-html="formatMarkdown(project.content)"></div>
            </div>
          </section>

          <!-- 项目截图 -->
          <section v-if="project.images && project.images.length > 0" class="space-y-6 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30'
                    : 'bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-images text-xl',
                    isDark ? 'text-orange-400' : 'text-orange-600',
                  ]"
                ></i>
              </div>
              <h2
                :class="[
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                项目截图
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="(image, index) in project.images"
                :key="index"
                :class="[
                  'group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] min-h-64 shadow-lg',
                  isDark
                    ? 'border border-gray-700/50 hover:border-orange-500/50'
                    : 'border border-gray-200 hover:border-orange-300',
                ]"
              >
                <ImageWithPlaceholder
                  :src="image"
                  :alt="`${project.title} - 图片 ${index + 1}`"
                  container-class="w-full h-64"
                  image-class="w-full h-full object-cover"
                  placeholder-class="w-full h-full"
                  placeholder-icon-class="text-3xl"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </div>
            </div>
          </section>

          <!-- 技术栈和链接 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <!-- 技术栈 -->
            <div
              v-if="project.techStack && project.techStack.length > 0"
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
                  v-for="tech in project.techStack"
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

            <!-- 相关链接 -->
            <div
              v-if="project.links"
              :class="[
                'p-6 rounded-xl space-y-4',
                isDark
                  ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50',
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isDark
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-purple-100 text-purple-600',
                  ]"
                >
                  <i class="fa-solid fa-link"></i>
                </div>
                <h3
                  :class="[
                    'text-xl font-bold',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  相关链接
                </h3>
              </div>
              <div class="space-y-3">
                <a
                  v-if="project.links.demo"
                  :href="project.links.demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg',
                    isDark
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
                  ]"
                >
                  <i class="fa-solid fa-external-link"></i>
                  查看演示
                </a>
                <a
                  v-if="project.links.github"
                  :href="project.links.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
                  ]"
                >
                  <i class="fa-brands fa-github text-lg"></i>
                  GitHub
                </a>
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
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { NAV_ITEMS } from '@/constants';
import { projectApi } from '@/services/api';
import { logger } from '@/utils/logger';
import { renderMarkdown } from '@/utils/markdown';
import type { Project } from '@/types';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

const route = useRoute();
const { isDark } = useTheme();

const project = ref<Project | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchProject = async () => {
  try {
    loading.value = true;
    error.value = null;
    const id = parseInt(route.params.id as string);
    project.value = await projectApi.getProject(id);
  } catch (err: any) {
    logger.error('获取项目详情失败:', err);
    error.value = err.message || '获取项目详情失败';
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
  fetchProject();
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
