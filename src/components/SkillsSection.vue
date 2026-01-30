<template>
  <section id="技能">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div
        v-for="skill in skills"
        :key="skill.id"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300',
          'border hover:shadow-lg hover:-translate-y-1',
          isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border-gray-700 hover:border-blue-500'
            : 'bg-gradient-to-br from-white via-gray-50/50 to-white border-gray-200 hover:border-blue-300',
        ]"
      >
        <!-- 顶部装饰条 -->
        <div
          :class="[
            'absolute top-0 left-0 right-0 h-1',
            isDark ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500' : 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400',
          ]"
        ></div>

        <div class="p-6 pt-7">
          <!-- 技能图标和名称 -->
          <div class="flex flex-col items-center text-center mb-4">
            <div
              :class="[
                'w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-6',
                getIconBgClass(skill),
              ]"
            >
              <i
                :class="[
                  getIconConfig(skill).icon,
                  'text-4xl transition-all duration-300',
                  getIconConfig(skill).color || (isDark ? 'text-blue-400' : 'text-blue-600'),
                ]"
              ></i>
            </div>
            <h3
              :class="[
                'text-lg font-bold mb-1 transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ skill.name }}
            </h3>
            <span
              v-if="skill.category"
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-full',
                isDark
                  ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                  : 'bg-gray-100 text-gray-700 border border-gray-200',
              ]"
            >
              {{ skill.category }}
            </span>
          </div>

          <!-- 熟练度显示 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                熟练度
              </span>
              <span
                :class="[
                  'text-sm font-bold',
                  isDark ? 'text-blue-400' : 'text-blue-600',
                ]"
              >
                {{ skill.proficiency || 0 }}/5
              </span>
            </div>
            <!-- 进度条 -->
            <div
              :class="[
                'h-2.5 rounded-full overflow-hidden',
                isDark ? 'bg-gray-700' : 'bg-gray-200',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400',
                ]"
                :style="{ width: `${((skill.proficiency || 0) / 5) * 100}%` }"
              ></div>
            </div>
            <!-- 星级显示 -->
            <div class="flex items-center justify-center gap-0.5 mt-2">
              <span
                v-for="i in 5"
                :key="i"
                :class="[
                  'text-sm transition-all',
                  i <= (skill.proficiency || 0)
                    ? isDark
                      ? 'text-blue-400'
                      : 'text-blue-500'
                    : isDark
                      ? 'text-gray-600'
                      : 'text-gray-300',
                ]"
              >
                ★
              </span>
            </div>
          </div>

          <!-- 描述 -->
          <p
            v-if="skill.description"
            :class="[
              'text-xs line-clamp-2 text-center transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ skill.description }}
          </p>
        </div>
      </div>
    </div>
    <EmptyState
      v-if="skills.length === 0"
      title="暂无技能"
      description="还没有添加任何技能，快来展示你的技能吧！"
      icon="fa-solid fa-code"
    />
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import EmptyState from '@/components/EmptyState.vue';
import { getSkillIcon } from '@/utils/skillIcons';
import type { Skill } from '@/types';

const props = defineProps<{
  skills: Skill[];
}>();

const { isDark } = useTheme();

// 为每个技能计算图标配置
const getIconConfig = (skill: Skill) => {
  return getSkillIcon(skill.name, skill.icon);
};

const getIconBgClass = (skill: Skill) => {
  const config = getIconConfig(skill);
  const baseClasses = 'bg-gradient-to-br';
  
  if (isDark.value) {
    if (config.bgGradientDark) {
      return `${baseClasses} ${config.bgGradientDark} border-gray-600/50 group-hover:border-gray-500`;
    }
    return `${baseClasses} from-gray-700/50 to-gray-800/50 group-hover:from-gray-700 group-hover:to-gray-800 border-gray-600/50 group-hover:border-gray-500`;
  } else {
    if (config.bgGradient) {
      return `${baseClasses} ${config.bgGradient} border-gray-200 group-hover:border-gray-300`;
    }
    return `${baseClasses} from-white to-gray-50 group-hover:from-white group-hover:to-gray-100 border-gray-200 group-hover:border-gray-300`;
  }
};
</script>
