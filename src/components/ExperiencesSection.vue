<template>
  <section id="工作经历" class="py-20">
    <h2
      :class="[
        'text-3xl md:text-4xl font-bold mb-12 text-center transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      工作经历
    </h2>
    <div class="space-y-8">
      <div
        v-for="(experience, index) in experiences"
        :key="experience.id"
        v-motion
        :initial="{ opacity: 0, x: -50 }"
        :visible="{
          opacity: 1,
          x: 0,
          transition: { duration: 600, delay: index * 100 },
        }"
        :class="[
          'backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2',
          isDark
            ? 'bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20'
            : 'bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 shadow-lg',
        ]"
      >
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-shrink-0">
            <div
              v-if="experience.companyLogo"
              class="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center"
            >
              <img
                :src="experience.companyLogo"
                :alt="experience.companyName"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center"
            >
              <i
                :class="[
                  'fa-solid fa-building text-3xl transition-opacity duration-300',
                  isDark ? 'text-white/50' : 'text-gray-700/30',
                ]"
              ></i>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h3
                  :class="[
                    'text-2xl font-semibold mb-1 transition-colors duration-300',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ experience.position }}
                </h3>
                <p
                  :class="[
                    'text-lg transition-colors duration-300',
                    isDark ? 'text-gray-400' : 'text-gray-600',
                  ]"
                >
                  {{ experience.companyName }}
                </p>
              </div>
              <div
                :class="[
                  'text-sm transition-colors duration-300',
                  isDark ? 'text-gray-500' : 'text-gray-400',
                ]"
              >
                {{ formatDate(experience.startDate) }} -
                {{ experience.endDate ? formatDate(experience.endDate) : '至今' }}
              </div>
            </div>
            <p
              v-if="experience.description"
              :class="[
                'mb-4 transition-colors duration-300',
                isDark ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              {{ experience.description }}
            </p>
            <div
              v-if="experience.techStack && experience.techStack.length > 0"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="tech in experience.techStack"
                :key="tech"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  isDark
                    ? 'bg-white/10 text-gray-300'
                    : 'bg-gray-200 text-gray-700',
                ]"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EmptyState
      v-if="experiences.length === 0"
      title="暂无工作经历"
      description="还没有添加任何工作经历，快来记录你的职业历程吧！"
      icon="fa-solid fa-briefcase"
    />
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import EmptyState from '@/components/EmptyState.vue';
import type { Experience } from '@/types';

defineProps<{
  experiences: Experience[];
}>();

const { isDark } = useTheme();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
  });
};
</script>
