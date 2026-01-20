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

      <!-- 学习记录详情 -->
      <div v-else-if="learning" class="max-w-6xl mx-auto">
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
              to="/learnings"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105',
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
              ]"
            >
              <i class="fa-solid fa-list"></i>
              <span class="hidden sm:inline">所有学习记录</span>
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
                  :class="[
                    'w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl',
                    learning.status === '已完成'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600',
                  ]"
                >
                  <i
                    :class="[
                      'text-4xl text-white',
                      learning.status === '已完成' ? 'fa-solid fa-check-circle' : 'fa-solid fa-book-open',
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
                    {{ learning.title }}
                  </h1>
                  <div class="flex items-center gap-4 flex-wrap mb-4">
                    <span
                      v-if="learning.category"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-full',
                        isDark
                          ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                          : 'bg-gray-100 text-gray-700 border border-gray-200',
                      ]"
                    >
                      <i class="fa-solid fa-folder mr-2"></i>
                      {{ learning.category }}
                    </span>
                    <span
                      :class="[
                        'px-4 py-2 text-sm font-bold rounded-full',
                        learning.status === '已完成'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white',
                      ]"
                    >
                      {{ learning.status || '进行中' }}
                    </span>
                  </div>
                  <div
                    v-if="learning.startDate || learning.endDate"
                    :class="[
                      'flex items-center gap-4 text-lg transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-600',
                    ]"
                  >
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-calendar"></i>
                      <span v-if="learning.startDate && learning.endDate">
                        {{ formatDate(learning.startDate) }} - {{ formatDate(learning.endDate) }}
                      </span>
                      <span v-else-if="learning.startDate">
                        开始: {{ formatDate(learning.startDate) }}
                      </span>
                      <span v-else-if="learning.endDate">
                        结束: {{ formatDate(learning.endDate) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 进度条 -->
            <div
              v-if="learning.startDate && learning.endDate"
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
              <div class="mb-4 flex items-center justify-between">
                <h2
                  :class="[
                    'text-xl font-bold transition-colors',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  学习进度
                </h2>
                <span
                  :class="[
                    'text-lg font-bold',
                    learning.status === '已完成'
                      ? isDark
                        ? 'text-green-400'
                        : 'text-green-600'
                      : isDark
                        ? 'text-blue-400'
                        : 'text-blue-600',
                  ]"
                >
                  {{ calculateProgress(learning.startDate, learning.endDate) }}%
                </span>
              </div>
              <div
                :class="[
                  'h-4 rounded-full overflow-hidden',
                  isDark ? 'bg-gray-700' : 'bg-gray-200',
                ]"
              >
                <div
                  :class="[
                    'h-full rounded-full transition-all duration-500',
                    learning.status === '已完成'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500',
                  ]"
                  :style="{
                    width: learning.status === '已完成' ? '100%' : `${calculateProgress(learning.startDate, learning.endDate)}%`,
                  }"
                ></div>
              </div>
            </div>

            <!-- 描述 -->
            <div
              v-if="learning.description && learning.description.trim()"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }"
              :class="[
                'backdrop-blur-md rounded-2xl p-8 transition-colors shadow-xl border',
                isDark
                  ? 'bg-white/10 border-white/10'
                  : 'bg-white/80 border-gray-200',
              ]"
              style="opacity: 1; transform: translateY(0);"
            >
              <h2
                :class="[
                  'text-2xl font-bold mb-4 transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                学习描述
              </h2>
              <p
                :class="[
                  'text-lg leading-relaxed transition-colors whitespace-pre-line',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                {{ learning.description }}
              </p>
            </div>

            <!-- 详细内容 -->
            <div
              v-if="learning.content && learning.content.trim()"
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
              :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
              :class="[
                'prose prose-lg max-w-none',
                isDark ? 'prose-invert' : '',
              ]"
              style="opacity: 1; transform: translateY(0);"
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
                <div v-html="formatMarkdown(learning.content)"></div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="lg:col-span-1 space-y-6">
            <!-- 标签卡片 -->
            <div
              v-if="learning.tags && learning.tags.length > 0"
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
                    'fa-solid fa-tags text-xl',
                    isDark ? 'text-purple-400' : 'text-purple-600',
                  ]"
                ></i>
                <h3
                  :class="[
                    'text-xl font-bold transition-colors',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  标签
                </h3>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in learning.tags"
                  :key="tag"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/50'
                      : 'bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300',
                  ]"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- 学习资源卡片 -->
            <div
              v-if="learning.resources && learning.resources.length > 0"
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
              <div class="flex items-center gap-2 mb-4">
                <i
                  :class="[
                    'fa-solid fa-book text-xl',
                    isDark ? 'text-blue-400' : 'text-blue-600',
                  ]"
                ></i>
                <h3
                  :class="[
                    'text-xl font-bold transition-colors',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  学习资源
                </h3>
              </div>
              <div class="space-y-3">
                <a
                  v-for="(resource, index) in learning.resources"
                  :key="index"
                  :href="resource.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200',
                  ]"
                >
                  <i
                    :class="[
                      'fa-solid text-lg flex-shrink-0',
                      resource.type === 'video' ? 'fa-video' : resource.type === 'article' ? 'fa-file-text' : 'fa-link',
                      isDark ? 'text-blue-400' : 'text-blue-600',
                    ]"
                  ></i>
                  <span
                    :class="[
                      'font-medium transition-colors flex-1',
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900',
                    ]"
                  >
                    {{ resource.title }}
                  </span>
                  <i
                    :class="[
                      'fa-solid fa-external-link text-xs flex-shrink-0',
                      isDark ? 'text-gray-500' : 'text-gray-400',
                    ]"
                  ></i>
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
import { learningApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Learning } from '@/types';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

const route = useRoute();
const { isDark } = useTheme();

const learning = ref<Learning | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchLearning = async () => {
  try {
    loading.value = true;
    error.value = null;
    const id = parseInt(route.params.id as string);
    learning.value = await learningApi.getLearning(id);
  } catch (err: any) {
    logger.error('获取学习记录详情失败:', err);
    error.value = err.message || '获取学习记录详情失败';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const calculateProgress = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
};

const formatMarkdown = (content: string) => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">$1</code>');
};

onMounted(() => {
  fetchLearning();
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
