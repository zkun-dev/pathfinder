<template>
  <section id="生活动态">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="(life, index) in lifePosts"
        :key="life.id"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :visible="{
          opacity: 1,
          scale: 1,
          transition: { duration: 500, delay: index * 100 },
        }"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer',
          'border hover:shadow-lg hover:-translate-y-1',
          isDark
            ? 'bg-gradient-to-br from-gray-800 to-gray-800/90 border-gray-700 hover:border-blue-500'
            : 'bg-gradient-to-br from-white to-gray-50/50 border-gray-200 hover:border-blue-300',
        ]"
        @click="$router.push(`/life/${life.id}`)"
      >
        <!-- 发布状态角标 -->
        <div class="absolute top-0 right-0 z-20">
          <div
            :class="[
              'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
              life.published
                ? isDark
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white'
                : isDark
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-500 text-white',
            ]"
          >
            <i
              :class="[
                'mr-1.5',
                life.published ? 'fa-solid fa-check-circle' : 'fa-solid fa-file',
              ]"
            ></i>
            {{ life.published ? '已发布' : '草稿' }}
          </div>
        </div>
        <!-- 图片网格 -->
        <div
          v-if="life.images && life.images.length > 0"
          class="relative h-48 overflow-hidden"
        >
          <!-- 单张图片 -->
          <img
            v-if="life.images.length === 1"
            :src="life.images[0]"
            :alt="life.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <!-- 多张图片网格 -->
          <div
            v-else-if="life.images.length === 2"
            class="grid grid-cols-2 h-full gap-1"
          >
            <img
              v-for="(img, i) in life.images"
              :key="i"
              :src="img"
              :alt="`${life.title} - ${i + 1}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div
            v-else-if="life.images.length === 3"
            class="grid grid-cols-2 h-full gap-1"
          >
            <img
              :src="life.images[0]"
              :alt="`${life.title} - 1`"
              class="row-span-2 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <img
              :src="life.images[1]"
              :alt="`${life.title} - 2`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <img
              :src="life.images[2]"
              :alt="`${life.title} - 3`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div
            v-else
            class="grid grid-cols-2 h-full gap-1"
          >
            <img
              v-for="(img, i) in life.images.slice(0, 4)"
              :key="i"
              :src="img"
              :alt="`${life.title} - ${i + 1}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div
              v-if="life.images.length > 4"
              class="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <span
                class="text-white text-2xl font-bold"
              >
                +{{ life.images.length - 4 }}
              </span>
            </div>
          </div>
          <!-- 渐变遮罩 -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>
        <!-- 封面图 -->
        <div
          v-else-if="life.coverImage"
          class="relative h-48 overflow-hidden"
        >
          <img
            :src="life.coverImage"
            :alt="life.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>
        <!-- 无图片时的占位 -->
        <div
          v-else
          :class="[
            'h-48 flex items-center justify-center',
            isDark
              ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20'
              : 'bg-gradient-to-br from-pink-100 to-purple-100',
          ]"
        >
          <i
            :class="[
              'fa-solid fa-heart text-4xl',
              isDark ? 'text-white/30' : 'text-gray-400',
            ]"
          ></i>
        </div>

        <!-- 内容 -->
        <div class="p-5 pt-8">
          <h3
            :class="[
              'text-lg font-bold mb-2 transition-colors line-clamp-2',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ life.title }}
          </h3>

          <!-- 内容预览 -->
          <p
            v-if="life.content"
            :class="[
              'text-sm mb-4 line-clamp-2 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ life.content }}
          </p>

          <!-- 标签 -->
          <div v-if="life.tags && life.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(tag, index) in life.tags.slice(0, 3)"
              :key="index"
              :class="[
                'px-2 py-0.5 text-xs rounded-md',
                isDark
                  ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  : 'bg-pink-100 text-pink-700 border border-pink-200',
              ]"
            >
              #{{ tag }}
            </span>
            <span
              v-if="life.tags.length > 3"
              :class="[
                'px-2 py-0.5 text-xs rounded-md',
                isDark ? 'text-gray-400' : 'text-gray-500',
              ]"
            >
              +{{ life.tags.length - 3 }}
            </span>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center gap-4 text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-calendar"></i>
              {{ formatDate(life.createdAt) }}
            </span>
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-eye"></i>
              {{ life.views || 0 }} 次浏览
            </span>
            <span v-if="life.images && life.images.length > 0" class="flex items-center gap-1">
              <i class="fa-solid fa-images"></i>
              {{ life.images.length }} 张图片
            </span>
          </div>
        </div>
      </article>
    </div>
    <EmptyState
      v-if="lifePosts.length === 0"
      title="暂无生活动态"
      description="还没有发布任何生活动态，快来分享你的生活点滴吧！"
      icon="fa-solid fa-heart"
    />
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import EmptyState from '@/components/EmptyState.vue';
import type { Life } from '@/types';

defineProps<{
  lifePosts: Life[];
}>();

const { isDark } = useTheme();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
