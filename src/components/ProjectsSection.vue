<template>
  <section id="项目">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="project in projects"
        :key="project.id"
        :to="`/project/${project.id}`"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300 block cursor-pointer',
          'border hover:shadow-lg hover:-translate-y-1',
          project.featured
            ? isDark
              ? 'bg-gradient-to-br from-purple-900/20 via-gray-800 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-purple-50 via-white to-white border-gray-200 hover:border-blue-300'
            : isDark
              ? 'bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-white via-gray-50/50 to-white border-gray-200 hover:border-blue-300',
        ]"
      >
        <!-- 精选标签 -->
        <div
          v-if="project.featured"
          class="absolute top-0 right-0 z-20"
        >
          <div
            :class="[
              'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
              isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white',
            ]"
          >
            <i class="fa-solid fa-star mr-1.5"></i>
            精选
          </div>
        </div>

        <!-- 封面图 -->
        <div
          v-if="project.coverImage"
          class="relative h-48 overflow-hidden"
        >
          <img
            :src="project.coverImage"
            :alt="project.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div
          v-else
          :class="[
            'relative h-48 flex items-center justify-center',
            isDark ? 'bg-gradient-to-br from-indigo-900/30 to-gray-800' : 'bg-gradient-to-br from-indigo-100 to-gray-200',
          ]"
        >
          <i
            :class="[
              'text-6xl opacity-20',
              isDark ? 'text-gray-500' : 'text-gray-400',
            ]"
          >
            <i class="fa-solid fa-folder-open"></i>
          </i>
        </div>

        <div class="p-6 pt-8">
          <!-- 标题和类型 -->
          <div class="mb-3">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <h3
                :class="[
                  'text-xl font-bold transition-colors line-clamp-2',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ project.title }}
              </h3>
              <span
                v-if="project.type"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-full',
                  isDark
                    ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 border border-gray-200',
                ]"
              >
                <i class="fa-solid fa-tag text-xs mr-1"></i>
                {{ project.type }}
              </span>
            </div>
          </div>

          <!-- 描述 -->
          <p
            v-if="project.description"
            :class="[
              'text-sm mb-4 line-clamp-2 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ project.description }}
          </p>

          <!-- 技术栈 -->
          <div v-if="project.techStack && project.techStack.length > 0" class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <i class="fa-solid fa-code text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'"></i>
              <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">技术栈</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap min-h-[24px]">
              <span
                v-for="(tech, index) in project.techStack.slice(0, 3)"
                :key="index"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md font-medium whitespace-nowrap',
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
                ]"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.techStack.length > 3"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md font-medium whitespace-nowrap',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                +{{ project.techStack.length - 3 }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div 
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 pt-4 border-t" 
            :class="isDark ? 'border-gray-700' : 'border-gray-200'"
            @click.stop
          >
            <a
              v-if="project.links?.demo"
              :href="project.links.demo"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'flex-1 text-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105',
                isDark
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50',
              ]"
              title="查看演示"
            >
              <i class="fa-solid fa-external-link mr-1 sm:mr-2"></i>
              <span class="hidden sm:inline">查看演示</span>
              <span class="sm:hidden">演示</span>
            </a>
            <a
              v-if="project.links?.github"
              :href="project.links.github"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center',
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
              title="GitHub"
            >
              <i class="fa-brands fa-github"></i>
            </a>
          </div>
        </div>
      </router-link>
    </div>
    <EmptyState
      v-if="projects.length === 0"
      title="暂无项目"
      description="还没有添加任何项目，快来创建你的第一个项目吧！"
      icon="fa-solid fa-folder-open"
    />
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import EmptyState from '@/components/EmptyState.vue';
import type { Project } from '@/types';

defineProps<{
  projects: Project[];
}>();

const { isDark } = useTheme();
</script>
