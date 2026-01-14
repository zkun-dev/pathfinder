<template>
  <section
    class="min-h-[80vh] flex flex-col justify-center items-center text-center py-20"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="mb-6"
    >
      <div
        :class="[
          'w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 shadow-lg transition-colors duration-300',
          isDark ? 'border-white/20' : 'border-gray-300/50',
        ]"
      >
        <img
          :src="avatarUrl"
          :alt="`${personalInfo.name}的头像`"
          class="w-full h-full object-cover"
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
        class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        {{ personalInfo.name }}
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
        'text-2xl md:text-3xl font-light mb-8 transition-colors duration-300',
        isDark ? 'text-gray-300' : 'text-gray-600',
      ]"
    >
      {{ personalInfo.title }}
    </h2>

    <p
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 600, delay: 600 },
      }"
      :class="[
        'max-w-2xl mx-auto text-lg mb-12 transition-colors duration-300',
        isDark ? 'text-gray-400' : 'text-gray-500',
      ]"
    >
      {{ personalInfo.bio }}
    </p>

    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: { duration: 600, delay: 800 },
      }"
      class="flex flex-wrap justify-center gap-4"
    >
      <button
        class="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
        @click="scrollToSection('项目')"
      >
        查看我的项目
      </button>
      <button
        :class="['px-8 py-3 rounded-full font-medium backdrop-blur-sm  transition-all duration-300 hover:-translate-y-1',
          isDark ? 'text-white bg-white/10 hover:bg-white/20' : 'text-gray-900 bg-gray-200 hover:bg-gray/20'
        ]"
        @click="scrollToSection('关于我')"
      >
        联系我
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import type { PersonalInfo } from '@/types';

defineProps<{
  personalInfo: PersonalInfo;
  avatarUrl?: string;
}>();

const { isDark } = useTheme();

const scrollToSection = (sectionName: string) => {
  const element = document.getElementById(sectionName);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
</script>
