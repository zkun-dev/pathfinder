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
      <div
        v-if="error"
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

        <!-- 主要内容区域 -->
        <div class="space-y-12 mb-12">
          <!-- 标题区域 -->
          <section class="space-y-6">
            <div class="flex items-start gap-6">
              <div
                :class="[
                  'w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0',
                  learning.status === '已完成'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600',
                ]"
              >
                <i
                  :class="[
                    'text-3xl text-white',
                    learning.status === '已完成' ? 'fa-solid fa-check-circle' : 'fa-solid fa-book-open',
                  ]"
                ></i>
              </div>
              <div class="flex-1">
                <h1
                  :class="[
                    'text-4xl md:text-5xl font-bold mb-4',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ learning.title }}
                </h1>
                <div class="flex items-center gap-4 flex-wrap mb-4">
                  <span
                    v-if="learning.category"
                    :class="[
                      'px-3 py-1.5 text-sm font-medium rounded-full',
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
                      'px-3 py-1.5 text-sm font-bold rounded-full',
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
                    'flex items-center gap-4 text-base',
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
          </section>

          <!-- 学习进度 -->
          <section v-if="learning.startDate && learning.endDate" class="space-y-4 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  learning.status === '已完成'
                    ? isDark
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
                      : 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200'
                    : isDark
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                      : 'bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-chart-line text-xl',
                    learning.status === '已完成'
                      ? isDark
                        ? 'text-green-400'
                        : 'text-green-600'
                      : isDark
                        ? 'text-blue-400'
                        : 'text-blue-600',
                  ]"
                ></i>
              </div>
              <h2
                :class="[
                  'text-2xl font-bold flex-1',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                学习进度
              </h2>
              <span
                :class="[
                  'text-2xl font-bold px-4 py-2 rounded-lg',
                  learning.status === '已完成'
                    ? isDark
                      ? 'text-green-400 bg-green-500/20 border border-green-500/30'
                      : 'text-green-600 bg-green-100 border border-green-200'
                    : isDark
                      ? 'text-blue-400 bg-blue-500/20 border border-blue-500/30'
                      : 'text-blue-600 bg-blue-100 border border-blue-200',
                ]"
              >
                {{ calculateProgress(learning.startDate, learning.endDate) }}%
              </span>
            </div>
            <div
              :class="[
                'h-6 rounded-full overflow-hidden shadow-inner',
                isDark ? 'bg-gray-700/50' : 'bg-gray-200/50',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500 shadow-lg',
                  learning.status === '已完成'
                    ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-500'
                    : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500',
                ]"
                :style="{
                  width: learning.status === '已完成' ? '100%' : `${calculateProgress(learning.startDate, learning.endDate)}%`,
                }"
              ></div>
            </div>
          </section>

          <!-- 学习描述 -->
          <section v-if="learning.description && learning.description.trim()" class="space-y-4 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
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
                    'fa-solid fa-book text-xl',
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
                学习描述
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
                  'text-lg leading-relaxed whitespace-pre-line',
                  isDark ? 'text-gray-300' : 'text-gray-700',
                ]"
              >
                {{ learning.description }}
              </p>
            </div>
          </section>

          <!-- 详细内容 -->
          <section v-if="learning.content && learning.content.trim()" class="space-y-4 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isDark
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                    : 'bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200',
                ]"
              >
                <i
                  :class="[
                    'fa-solid fa-file-lines text-xl',
                    isDark ? 'text-indigo-400' : 'text-indigo-600',
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
              <div v-html="formatMarkdown(learning.content)"></div>
            </div>
          </section>
        </div>

        <!-- 侧边栏信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
          <!-- 标签 -->
          <div
            v-if="learning.tags && learning.tags.length > 0"
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
                <i class="fa-solid fa-tags"></i>
              </div>
              <h3
                :class="[
                  'text-xl font-bold',
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
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/50'
                    : 'bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300',
                ]"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 学习资源 -->
          <div
            v-if="learning.resources && learning.resources.length > 0"
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
                <i class="fa-solid fa-book"></i>
              </div>
              <h3
                :class="[
                  'text-xl font-bold',
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
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
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
                    'font-medium flex-1',
                    isDark ? 'text-gray-300' : 'text-gray-700',
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { useTheme } from '@/composables/useTheme';
import Header from '@/components/Header.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { NAV_ITEMS } from '@/constants';
import { learningApi } from '@/services/api';
import { logger } from '@/utils/logger';
import { renderMarkdown } from '@/utils/markdown';
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
  return renderMarkdown(content);
};

onMounted(() => {
  fetchLearning();
});
</script>

<style scoped>
.prose {
  color: rgb(75 85 99); /* text-gray-600 */
}

:global(.dark) .prose {
  color: rgb(209 213 219); /* text-gray-300 */
}

.prose-invert {
  color: rgb(209 213 219); /* text-gray-300 */
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  font-weight: 700; /* font-bold */
  margin-bottom: 1rem; /* mb-4 */
  margin-top: 1.5rem; /* mt-6 */
}

.prose :deep(h1) {
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem;
}

.prose :deep(h2) {
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
}

.prose :deep(h3) {
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
}

.prose :deep(p) {
  margin-bottom: 1rem; /* mb-4 */
  line-height: 1.625; /* leading-relaxed */
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1rem; /* mb-4 */
  padding-left: 1.5rem; /* pl-6 */
}

.prose :deep(li) {
  margin-bottom: 0.5rem; /* mb-2 */
}

.prose :deep(code) {
  padding: 0.25rem 0.5rem; /* px-2 py-1 */
  border-radius: 0.25rem; /* rounded */
}

.prose :deep(strong) {
  font-weight: 700; /* font-bold */
}

.prose :deep(em) {
  font-style: italic; /* italic */
}
</style>
