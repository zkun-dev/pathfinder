<template>
  <section id="学习记录">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="(learning, index) in learnings"
        :key="learning.id"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, delay: index * 100 },
        }"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer',
          'border hover:shadow-lg hover:-translate-y-1',
          learning.status === '已完成'
            ? isDark
              ? 'bg-gradient-to-br from-green-900/30 via-gray-800 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-green-50 via-white to-white border-gray-200 hover:border-blue-300'
            : isDark
              ? 'bg-gradient-to-br from-blue-900/30 via-gray-800 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-blue-50 via-white to-white border-gray-200 hover:border-blue-300',
        ]"
        @click="$router.push(`/learning/${learning.id}`)"
      >
        <!-- 状态角标 -->
        <div
          class="absolute top-0 right-0 z-20"
        >
          <div
            :class="[
              'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
              learning.status === '已完成' || (learning.startDate && learning.endDate && calculateProgress(learning.startDate, learning.endDate) >= 100)
                ? isDark
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white'
                : isDark
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-500 text-white',
            ]"
          >
            <i
              :class="[
                'mr-1.5',
                learning.status === '已完成' || (learning.startDate && learning.endDate && calculateProgress(learning.startDate, learning.endDate) >= 100)
                  ? 'fa-solid fa-check-circle'
                  : 'fa-solid fa-clock',
              ]"
            ></i>
            {{ learning.status === '已完成' || (learning.startDate && learning.endDate && calculateProgress(learning.startDate, learning.endDate) >= 100) ? '已完成' : (learning.status || '进行中') }}
          </div>
        </div>

        <div class="p-4 sm:p-6 relative z-10 pt-6 sm:pt-8">
          <!-- 状态图标和标题 -->
          <div class="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div
              :class="[
                'flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg',
                learning.status === '已完成'
                  ? isDark
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : isDark
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600',
              ]"
            >
              <i
                :class="[
                  'text-lg sm:text-2xl text-white',
                  learning.status === '已完成' ? 'fa-solid fa-check-circle' : 'fa-solid fa-book-open',
                ]"
              ></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'text-base sm:text-lg font-bold mb-2 transition-colors line-clamp-2',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ learning.title }}
              </h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  v-if="learning.category"
                  :class="[
                    'px-2.5 py-1 text-xs font-medium rounded-full',
                    isDark
                      ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 border border-gray-200',
                  ]"
                >
                  <i class="fa-solid fa-folder text-xs mr-1"></i>
                  {{ learning.category }}
                </span>
              </div>
            </div>
          </div>

          <!-- 进度指示器 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span
                :class="[
                  'text-xs font-semibold',
                  learning.status === '已完成'
                    ? isDark
                      ? 'text-green-400'
                      : 'text-green-600'
                    : isDark
                      ? 'text-blue-400'
                      : 'text-blue-600',
                ]"
              >
                {{ learning.status || '进行中' }}
              </span>
              <span
                v-if="learning.startDate && learning.endDate"
                class="text-xs"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ calculateProgress(learning.startDate, learning.endDate) }}%
              </span>
            </div>
            <div
              :class="[
                'h-2 rounded-full overflow-hidden',
                isDark ? 'bg-gray-700' : 'bg-gray-200',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  learning.status === '已完成'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500',
                ]"
                :style="{
                  width: learning.status === '已完成' ? '100%' : learning.startDate && learning.endDate ? `${calculateProgress(learning.startDate, learning.endDate)}%` : '50%',
                }"
              ></div>
            </div>
          </div>

          <!-- 描述 -->
          <p
            v-if="learning.description"
            :class="[
              'text-sm mb-4 line-clamp-3 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ learning.description }}
          </p>

          <!-- 标签云 -->
          <div v-if="learning.tags && learning.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tag, index) in learning.tags.slice(0, 4)"
                :key="index"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md font-medium',
                  isDark
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border border-purple-200',
                ]"
              >
                #{{ tag }}
              </span>
              <span
                v-if="learning.tags.length > 4"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                +{{ learning.tags.length - 4 }}
              </span>
            </div>
          </div>

          <!-- 日期信息 -->
          <div
            v-if="learning.startDate || learning.endDate"
            class="flex items-center justify-between gap-3 text-xs"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-days"></i>
              <span v-if="learning.startDate && learning.endDate">
                {{ formatDate(learning.startDate) }} - {{ formatDate(learning.endDate) }}
              </span>
              <span v-else-if="learning.startDate">
                开始: {{ formatDate(learning.startDate) }}
              </span>
              <span v-else-if="learning.endDate">
                结束: {{ formatDate(learning.endDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EmptyState
      v-if="learnings.length === 0"
      title="暂无学习记录"
      description="还没有添加任何学习记录，快来记录你的学习历程吧！"
      icon="fa-solid fa-book-open"
    />
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import EmptyState from '@/components/EmptyState.vue';
import type { Learning } from '@/types';

defineProps<{
  learnings: Learning[];
}>();

const { isDark } = useTheme();

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
</script>
