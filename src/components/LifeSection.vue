<template>
  <section id="生活动态" class="py-20">
    <h2
      :class="[
        'text-3xl md:text-4xl font-bold mb-12 text-center transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      生活动态
    </h2>
    <div class="grid md:grid-cols-2 gap-8">
      <article
        v-for="(life, index) in lifePosts"
        :key="life.id"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, delay: index * 100 },
        }"
        :class="[
          'group backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3',
          isDark
            ? 'bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20'
            : 'bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 shadow-lg',
        ]"
      >
        <div
          v-if="life.coverImage"
          class="h-64 overflow-hidden relative"
        >
          <ImageWithPlaceholder
            :src="life.coverImage"
            :alt="life.title"
            container-class="w-full h-64"
            image-class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            placeholder-class="w-full h-64"
            placeholder-icon-class="text-4xl"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          ></div>
          <div class="absolute bottom-4 left-4 right-4">
            <h3
              class="text-white text-xl font-bold mb-2 drop-shadow-lg"
            >
              {{ life.title }}
            </h3>
          </div>
        </div>
        <div
          v-else
          class="h-48 overflow-hidden bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 flex items-center justify-center group-hover:from-pink-500/40 group-hover:via-purple-500/40 group-hover:to-blue-500/40 transition-all duration-500"
        >
          <i
            :class="[
              'fa-solid fa-heart text-5xl transition-all duration-500',
              isDark ? 'text-white/50 group-hover:text-white/70 group-hover:scale-110' : 'text-gray-700/30 group-hover:text-gray-700/50 group-hover:scale-110',
            ]"
          ></i>
        </div>
        <div class="p-6">
          <h3
            v-if="!life.coverImage"
            :class="[
              'text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-pink-500',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ life.title }}
          </h3>
          <h3
            :class="[
              'text-xl font-semibold mb-2 transition-colors duration-300',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ life.title }}
          </h3>
          <p
            :class="[
              'text-sm mb-4 transition-colors duration-300',
              isDark ? 'text-gray-500' : 'text-gray-400',
            ]"
          >
            {{ formatDate(life.createdAt) }} · {{ life.views }} 次浏览
          </p>
          <p
            :class="[
              'mb-4 line-clamp-3 transition-colors duration-300',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            {{ life.content }}
          </p>
          <div
            v-if="life.tags && life.tags.length > 0"
            class="flex flex-wrap gap-2"
          >
            <span
              v-for="tag in life.tags"
              :key="tag"
              :class="[
                'px-2 py-1 text-xs rounded transition-colors',
                isDark
                  ? 'bg-white/10 text-gray-300'
                  : 'bg-gray-200 text-gray-700',
              ]"
            >
              #{{ tag }}
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
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
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
