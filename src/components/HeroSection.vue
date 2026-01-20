<template>
  <section
    class="min-h-[85vh] flex flex-col justify-center items-center text-center py-10"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="mb-8"
    >
      <div
        :class="[
          'relative w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-6',
          isDark
            ? 'border-white/30 ring-4 ring-white/10'
            : 'border-gray-300 ring-4 ring-gray-100',
        ]"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 z-0"
        ></div>
        <img
          :src="avatarUrl || profile.avatarUrl || 'https://via.placeholder.com/128'"
          :alt="`${profile.name}的头像`"
          class="w-full h-full object-cover relative z-10"
          loading="lazy"
        />
      </div>
    </div>

    <h1
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 600, delay: 200 },
      }"
      :class="[
        'text-5xl md:text-7xl font-extrabold mb-4 transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      你好，我是
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"
      >
        {{ profile.name }}
      </span>
    </h1>

    <h2
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 600, delay: 400 },
      }"
      :class="[
        'text-2xl md:text-3xl font-light mb-6 transition-colors duration-300',
        isDark ? 'text-gray-300' : 'text-gray-600',
      ]"
    >
      {{ profile.title }}
    </h2>

    <p
      v-if="profile.bio"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 600, delay: 600 },
      }"
      :class="[
        'max-w-2xl mx-auto text-lg leading-relaxed mb-12 transition-colors duration-300',
        isDark ? 'text-gray-400' : 'text-gray-500',
      ]"
    >
      {{ profile.bio }}
    </p>

    <!-- 统计信息卡片 -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 600, delay: 800 },
      }"
      class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto w-full px-4"
    >
      <router-link
        to="/projects"
        :class="[
          'backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2',
          isDark
            ? 'bg-white/10 hover:bg-white/15 border border-white/10'
            : 'bg-white/80 hover:bg-white border border-gray-200 shadow-lg',
        ]"
      >
        <div
          :class="[
            'text-3xl mb-2 transition-colors',
            isDark ? 'text-blue-400' : 'text-blue-600',
          ]"
        >
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <div
          :class="[
            'text-2xl font-bold mb-1 transition-colors',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ stats.projects }}
        </div>
        <div
          :class="[
            'text-sm transition-colors',
            isDark ? 'text-gray-400' : 'text-gray-600',
          ]"
        >
          精选项目
        </div>
      </router-link>

      <router-link
        to="/experiences"
        :class="[
          'backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2',
          isDark
            ? 'bg-white/10 hover:bg-white/15 border border-white/10'
            : 'bg-white/80 hover:bg-white border border-gray-200 shadow-lg',
        ]"
      >
        <div
          :class="[
            'text-3xl mb-2 transition-colors',
            isDark ? 'text-purple-400' : 'text-purple-600',
          ]"
        >
          <i class="fa-solid fa-briefcase"></i>
        </div>
        <div
          :class="[
            'text-2xl font-bold mb-1 transition-colors',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ stats.experiences }}
        </div>
        <div
          :class="[
            'text-sm transition-colors',
            isDark ? 'text-gray-400' : 'text-gray-600',
          ]"
        >
          工作经历
        </div>
      </router-link>

      <router-link
        to="/learnings"
        :class="[
          'backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2',
          isDark
            ? 'bg-white/10 hover:bg-white/15 border border-white/10'
            : 'bg-white/80 hover:bg-white border border-gray-200 shadow-lg',
        ]"
      >
        <div
          :class="[
            'text-3xl mb-2 transition-colors',
            isDark ? 'text-green-400' : 'text-green-600',
          ]"
        >
          <i class="fa-solid fa-book"></i>
        </div>
        <div
          :class="[
            'text-2xl font-bold mb-1 transition-colors',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ stats.learnings }}
        </div>
        <div
          :class="[
            'text-sm transition-colors',
            isDark ? 'text-gray-400' : 'text-gray-600',
          ]"
        >
          学习记录
        </div>
      </router-link>

      <router-link
        to="/life"
        :class="[
          'backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2',
          isDark
            ? 'bg-white/10 hover:bg-white/15 border border-white/10'
            : 'bg-white/80 hover:bg-white border border-gray-200 shadow-lg',
        ]"
      >
        <div
          :class="[
            'text-3xl mb-2 transition-colors',
            isDark ? 'text-pink-400' : 'text-pink-600',
          ]"
        >
          <i class="fa-solid fa-heart"></i>
        </div>
        <div
          :class="[
            'text-2xl font-bold mb-1 transition-colors',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ stats.life }}
        </div>
        <div
          :class="[
            'text-sm transition-colors',
            isDark ? 'text-gray-400' : 'text-gray-600',
          ]"
        >
          生活动态
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import type { Profile } from '@/types';

const props = defineProps<{
  profile: Profile;
  avatarUrl?: string;
  stats?: {
    projects: number;
    experiences: number;
    learnings: number;
    life: number;
  };
}>();

const { isDark } = useTheme();

const stats = computed(() => props.stats || {
  projects: 0,
  experiences: 0,
  learnings: 0,
  life: 0,
});
</script>

<style scoped>
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
</style>
