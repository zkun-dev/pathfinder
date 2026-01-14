<template>
  <section id="项目" class="py-20">
    <h2
      :class="[
        'text-3xl md:text-4xl font-bold mb-12 text-center transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      精选项目
    </h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div
        v-for="project in projects"
        :key="project.id"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        :class="[
          'backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2',
          isDark
            ? 'bg-white/10 hover:bg-white/12'
            : 'bg-gray-900/5 hover:bg-gray-900/10',
        ]"
      >
        <div
          class="h-48 overflow-hidden bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center"
        >
          <i
            :class="[
              'fa-solid fa-project-diagram text-6xl transition-opacity duration-300',
              isDark ? 'text-white/50' : 'text-gray-700/30',
            ]"
          ></i>
        </div>
        <div class="p-6">
          <h3
            :class="[
              'text-xl font-semibold mb-2 transition-colors duration-300',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ project.title }}
          </h3>
          <p
            :class="[
              'mb-4 transition-colors duration-300',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            {{ project.description }}
          </p>
          <button
            class="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            查看详情 <i class="fa-solid fa-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import type { Project } from '@/types';

defineProps<{
  projects: Project[];
}>();

const { isDark } = useTheme();
</script>
