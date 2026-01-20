<template>
  <section id="技能">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      <div
        v-for="(skill, index) in skills"
        :key="skill.id"
        v-motion
        :initial="{ opacity: 0, y: 20, scale: 0.9 }"
        :visible="{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 500, delay: index * 50, type: 'spring' },
        }"
        :hover="{ scale: 1.1, y: -5 }"
        :class="[
          'group backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-500 cursor-pointer',
          isDark
            ? 'bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 shadow-lg hover:shadow-xl'
            : 'bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl',
        ]"
      >
        <div class="mb-4 relative">
          <div
            :class="[
              'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6',
              isDark
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30'
                : 'bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200',
            ]"
          >
            <i
              :class="[
                skill.icon || 'fa-solid fa-code',
                'text-2xl transition-all duration-500',
                isDark
                  ? 'text-blue-400 group-hover:text-blue-300 group-hover:scale-110'
                  : 'text-blue-600 group-hover:text-blue-700 group-hover:scale-110',
              ]"
            ></i>
          </div>
        </div>
        <h3
          :class="[
            'font-bold text-sm mb-1 transition-colors duration-300 group-hover:text-blue-500',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ skill.name }}
        </h3>
        <p
          v-if="skill.category"
          :class="[
            'text-xs mb-2 transition-colors duration-300',
            isDark ? 'text-gray-500' : 'text-gray-500',
          ]"
        >
          {{ skill.category }}
        </p>
        <div
          v-if="skill.proficiency"
          class="flex justify-center gap-1 mt-2"
        >
          <div
            v-for="i in 5"
            :key="i"
            :class="[
              'w-1.5 h-1.5 rounded-full transition-all duration-300',
              i <= (skill.proficiency || 0)
                ? isDark
                  ? 'bg-blue-400 group-hover:bg-blue-300 group-hover:scale-125'
                  : 'bg-blue-500 group-hover:bg-blue-600 group-hover:scale-125'
                : isDark
                ? 'bg-white/20'
                : 'bg-gray-300',
            ]"
          ></div>
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
import type { Skill } from '@/types';

defineProps<{
  skills: Skill[];
}>();

const { isDark } = useTheme();
</script>
