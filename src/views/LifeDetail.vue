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

      <!-- 生活动态详情 -->
      <div v-else-if="life" class="max-w-6xl mx-auto">
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
              to="/life"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105',
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
              ]"
            >
              <i class="fa-solid fa-list"></i>
              <span class="hidden sm:inline">所有生活动态</span>
            </router-link>
          </div>
        </div>

        <!-- 图片轮播/封面 -->
        <div
          v-if="life.images && life.images.length > 0"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
          class="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group"
        >
          <div class="aspect-video w-full relative">
            <ImageWithPlaceholder
              :key="currentImageIndex"
              :src="life.images[currentImageIndex]"
              :alt="life.title"
              container-class="w-full h-full"
              image-class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              placeholder-class="w-full h-full"
              placeholder-icon-class="text-4xl"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            ></div>
            <!-- 标题覆盖在图片上 -->
            <div class="absolute inset-0 flex items-end p-8 md:p-12">
              <div class="w-full">
                <h1
                  class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-2xl leading-tight"
                >
                  {{ life.title }}
                </h1>
                <div class="flex items-center gap-4 text-white/90">
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-calendar"></i>
                    {{ formatDate(life.createdAt) }}
                  </span>
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-eye"></i>
                    {{ life.views || 0 }} 次浏览
                  </span>
                </div>
              </div>
            </div>
            <!-- 轮播控制 -->
            <button
              v-if="life.images.length > 1"
              @click="prevImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm z-10"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button
              v-if="life.images.length > 1"
              @click="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm z-10"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div
              v-if="life.images.length > 1"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
            >
              <div
                v-for="(_, index) in life.images"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'w-2 h-2 rounded-full transition-all cursor-pointer',
                  currentImageIndex === index
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75',
                ]"
              ></div>
            </div>
          </div>
        </div>

        <!-- 无图片时的标题区域 -->
        <div
          v-else
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          :class="[
            'backdrop-blur-md rounded-2xl p-8 mb-8 transition-colors shadow-xl border',
            isDark
              ? 'bg-white/10 border-white/10'
              : 'bg-white/80 border-gray-200',
          ]"
        >
          <h1
            :class="[
              'text-4xl md:text-6xl font-bold mb-4 transition-colors',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ life.title }}
          </h1>
          <div
            :class="[
              'flex items-center gap-4 text-lg transition-colors',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-calendar"></i>
              {{ formatDate(life.createdAt) }}
            </span>
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-eye"></i>
              {{ life.views || 0 }} 次浏览
            </span>
          </div>
        </div>

        <!-- 主要内容区域 - 两栏布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <!-- 左侧主内容区 -->
          <div class="lg:col-span-2 space-y-8">
            <!-- 内容 -->
            <div
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
            >
              <div
                :class="[
                  'backdrop-blur-md rounded-2xl p-8 md:p-10 transition-colors shadow-xl border',
                  isDark
                    ? 'bg-white/10 border-white/10'
                    : 'bg-white/80 border-gray-200',
                ]"
              >
                <div 
                  v-html="formatMarkdown(life.content)"
                  :class="[
                    'prose prose-lg max-w-none',
                    isDark ? 'prose-invert' : '',
                  ]"
                ></div>
              </div>
            </div>

            <!-- 图片网格 -->
            <div
              v-if="life.images && life.images.length > 1"
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
              <h2
                :class="[
                  'text-2xl font-bold mb-6 transition-colors',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                更多图片
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="(image, index) in life.images"
                  :key="index"
                  class="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  @click="currentImageIndex = index"
                >
                  <ImageWithPlaceholder
                    :src="image"
                    :alt="`${life.title} - 图片 ${index + 1}`"
                    container-class="w-full h-64"
                    image-class="w-full h-64 object-cover"
                    placeholder-class="w-full h-64"
                    placeholder-icon-class="text-2xl"
                  />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="lg:col-span-1 space-y-6">
            <!-- 标签卡片 -->
            <div
              v-if="life.tags && life.tags.length > 0"
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
                    isDark ? 'text-pink-400' : 'text-pink-600',
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
                  v-for="tag in life.tags"
                  :key="tag"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:border-pink-400/50'
                      : 'bg-pink-100 text-pink-700 border border-pink-200 hover:border-pink-300',
                  ]"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- 信息卡片 -->
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
                动态信息
              </h3>
              <div class="space-y-4">
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
                      发布时间
                    </span>
                  </div>
                  <p
                    :class="[
                      'text-sm transition-colors',
                      isDark ? 'text-gray-300' : 'text-gray-600',
                    ]"
                  >
                    {{ formatDate(life.createdAt) }}
                  </p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <i
                      :class="[
                        'fa-solid fa-eye text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    ></i>
                    <span
                      :class="[
                        'text-sm font-semibold',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    >
                      浏览次数
                    </span>
                  </div>
                  <p
                    :class="[
                      'text-sm transition-colors',
                      isDark ? 'text-gray-300' : 'text-gray-600',
                    ]"
                  >
                    {{ life.views || 0 }} 次
                  </p>
                </div>
                <div v-if="life.images && life.images.length > 0">
                  <div class="flex items-center gap-2 mb-1">
                    <i
                      :class="[
                        'fa-solid fa-images text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    ></i>
                    <span
                      :class="[
                        'text-sm font-semibold',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    >
                      图片数量
                    </span>
                  </div>
                  <p
                    :class="[
                      'text-sm transition-colors',
                      isDark ? 'text-gray-300' : 'text-gray-600',
                    ]"
                  >
                    {{ life.images.length }} 张
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
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { lifeApi } from '@/services/api';
import { logger } from '@/utils/logger';
import { renderMarkdown } from '@/utils/markdown';
import type { Life } from '@/types';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

const route = useRoute();
const { isDark } = useTheme();

const life = ref<Life | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const currentImageIndex = ref(0);

const fetchLife = async () => {
  try {
    loading.value = true;
    error.value = null;
    const id = parseInt(route.params.id as string);
    life.value = await lifeApi.getLifePost(id);
  } catch (err: any) {
    logger.error('获取生活动态详情失败:', err);
    error.value = err.message || '获取生活动态详情失败';
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

const nextImage = () => {
  if (life.value?.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % life.value.images.length;
  }
};

const prevImage = () => {
  if (life.value?.images) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? (life.value.images.length - 1)
        : currentImageIndex.value - 1;
  }
};

onMounted(() => {
  fetchLife();
});
</script>

<style scoped>
.prose {
  @apply text-gray-600 dark:text-gray-300;
}
.prose-invert {
  @apply text-gray-300;
}
</style>
