<template>
  <section id="工作经历">
    <div class="relative">
      <!-- 时间轴线 -->
      <div
        :class="[
          'absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 transition-colors',
          isDark ? 'bg-white/20' : 'bg-gray-300',
        ]"
        style="transform: translateX(-50%);"
      ></div>

      <div class="space-y-12">
        <div
          v-for="(experience, index) in experiences"
          :key="experience.id"
          :class="[
            'relative flex flex-col md:flex-row items-start md:items-center',
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
          ]"
        >
          <!-- 时间点 -->
          <div
            :class="[
              'absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-4 transition-all duration-300 hover:scale-125 z-10',
              isDark
                ? 'bg-blue-500 border-white/20'
                : 'bg-blue-500 border-white',
            ]"
            style="transform: translateX(-50%); top: 0;"
          ></div>

          <!-- 时间标签（移动端显示在顶部） -->
          <div
            :class="[
              'w-full md:w-1/2 pl-12 sm:pl-16 mb-4 md:mb-0',
              index % 2 === 0 ? 'md:text-right md:pr-8 md:pl-0' : 'md:text-left md:pl-8 md:pr-0 md:ml-auto',
            ]"
          >
            <div
              :class="[
                'text-xs sm:text-sm font-semibold transition-colors',
                isDark ? 'text-blue-400' : 'text-blue-600',
              ]"
            >
              {{ formatDate(experience.startDate) }} -
              {{ experience.endDate ? formatDate(experience.endDate) : '至今' }}
            </div>
          </div>

          <!-- 内容卡片 -->
          <div
            :class="[
              'w-full md:w-1/2 pl-12 sm:pl-16',
              index % 2 === 0 ? 'md:pl-8 md:pr-0' : 'md:pr-8 md:pl-0 md:ml-auto',
            ]"
          >
            <router-link
              :to="`/experience/${experience.id}`"
              :class="[
                'block backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer',
                'border hover:shadow-lg hover:-translate-y-1',
                isDark
                  ? 'bg-white/10 hover:bg-white/15 border-white/10 hover:border-blue-500'
                  : 'bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300 shadow-lg',
              ]"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <div
                  v-if="experience.companyLogo"
                  class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0"
                >
                  <img
                    :src="experience.companyLogo"
                    :alt="experience.companyName"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  :class="[
                    'w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0',
                    isDark
                      ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'
                      : 'bg-gradient-to-br from-blue-100 to-purple-100',
                  ]"
                >
                  <i
                    :class="[
                      'fa-solid fa-building text-lg sm:text-2xl',
                      isDark ? 'text-white/50' : 'text-gray-700/30',
                    ]"
                  ></i>
                </div>
                <div class="flex-1">
                  <h3
                    :class="[
                      'text-xl font-bold mb-1 transition-colors',
                      isDark ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ experience.position }}
                  </h3>
                  <p
                    :class="[
                      'text-base mb-3 transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-600',
                    ]"
                  >
                    {{ experience.companyName }}
                  </p>
                  <p
                    v-if="experience.description && !simple"
                    :class="[
                      'text-sm mb-3 line-clamp-3 transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-600',
                    ]"
                  >
                    {{ experience.description }}
                  </p>
                  <div
                    v-if="experience.techStack && experience.techStack.length > 0 && !simple"
                    class="flex flex-wrap gap-2"
                  >
                    <span
                      v-for="tech in experience.techStack.slice(0, 4)"
                      :key="tech"
                      :class="[
                        'px-2 py-1 text-xs rounded-full transition-colors',
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
            </router-link>
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
  simple?: boolean;
}>();

const { isDark } = useTheme();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
  });
};
</script>
