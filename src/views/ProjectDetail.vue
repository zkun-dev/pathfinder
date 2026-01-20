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
        <div class="text-center">
          <div
            :class="[
              'inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent',
              isDark ? 'border-white' : 'border-gray-900',
            ]"
          ></div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="flex items-center justify-center min-h-screen">
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
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
          class="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group"
        >
          <div class="aspect-video w-full relative">
            <img
              :src="project.coverImage"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            ></div>
            <!-- 标题覆盖在图片上 -->
            <div class="absolute inset-0 flex items-end p-8 md:p-12">
              <div class="w-full">
                <h1
                  :class="[
                    'text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-2xl leading-tight',
                  ]"
                >
                  {{ project.title }}
                </h1>
                <p
                  v-if="project.description"
                  class="text-lg md:text-xl text-white/90 max-w-3xl drop-shadow-lg"
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
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="mb-12"
        >
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <h1
              :class="[
                'text-4xl md:text-6xl font-extrabold transition-colors leading-tight',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ project.title }}
            </h1>
            <span
              v-if="project.featured"
              class="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
            >
              <i class="fa-solid fa-star mr-1"></i>
              精选项目
            </span>
          </div>
          <p
            v-if="project.description"
            :class="[
              'text-xl md:text-2xl leading-relaxed transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ project.description }}
          </p>
        </div>

        <!-- 主要内容区域 - 两栏布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <!-- 左侧主内容区 -->
          <div class="lg:col-span-2 space-y-8">
            <!-- 项目信息卡片 -->
            <div
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
                  'text-2xl font-bold mb-6 transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                项目信息
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 项目类型 -->
                <div v-if="project.type">
                  <div class="flex items-center gap-2 mb-2">
                    <i
                      :class="[
                        'fa-solid fa-tag text-lg',
                        isDark ? 'text-blue-400' : 'text-blue-600',
                      ]"
                    ></i>
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
                      'text-lg font-medium transition-colors',
                      isDark ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ project.type }}
                  </p>
                </div>

                <!-- 时间信息 -->
                <div v-if="project.startDate || project.endDate">
                  <div class="flex items-center gap-2 mb-2">
                    <i
                      :class="[
                        'fa-solid fa-calendar text-lg',
                        isDark ? 'text-purple-400' : 'text-purple-600',
                      ]"
                    ></i>
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
                      'text-lg font-medium transition-colors',
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
            </div>

            <!-- 详细内容 -->
            <div
              v-if="project.content"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
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
                  项目概述
                </h2>
                <div v-html="formatMarkdown(project.content)"></div>
              </div>
            </div>

            <!-- 图片集 -->
            <div
              v-if="project.images && project.images.length > 0"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
            >
              <div
                :class="[
                  'backdrop-blur-md rounded-2xl p-8 transition-colors shadow-xl border',
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
                  项目截图
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    v-for="(image, index) in project.images"
                    :key="index"
                    class="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <img
                      :src="image"
                      :alt="`${project.title} - 图片 ${index + 1}`"
                      class="w-full h-auto object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="lg:col-span-1 space-y-6">
            <!-- 技术栈卡片 -->
            <div
              v-if="project.techStack && project.techStack.length > 0"
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
                  v-for="tech in project.techStack"
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

            <!-- 操作按钮卡片 -->
            <div
              v-if="project.links"
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
                相关链接
              </h3>
              <div class="space-y-3">
                <a
                  v-if="project.links.demo"
                  :href="project.links.demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg',
                    isDark
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-blue-500/50'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-blue-500/30',
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

            <!-- 快速导航卡片 -->
            <div
              v-motion
              :initial="{ opacity: 0, x: 30 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 600, delay: 500 } }"
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
                快速导航
              </h3>
              <div class="space-y-2">
                <button
                  @click="scrollToSection('info')"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  ]"
                >
                  <i class="fa-solid fa-info-circle mr-2"></i>
                  项目信息
                </button>
                <button
                  v-if="project.content"
                  @click="scrollToSection('content')"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  ]"
                >
                  <i class="fa-solid fa-file-text mr-2"></i>
                  项目概述
                </button>
                <button
                  v-if="project.images && project.images.length > 0"
                  @click="scrollToSection('images')"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  ]"
                >
                  <i class="fa-solid fa-images mr-2"></i>
                  项目截图
                </button>
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
import { projectApi } from '@/services/api';
import { logger } from '@/utils/logger';
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
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">$1</code>');
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
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
