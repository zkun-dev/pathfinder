<template>
  <section id="技能" class="py-20">
    <h2
      :class="[
        'text-3xl md:text-4xl font-bold mb-12 text-center transition-colors duration-300',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      我的技能
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
      <div
        v-for="(skill, index) in skills"
        :key="index"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{
          opacity: 1,
          y: 0,
          transition: { duration: 400, delay: index * 100 },
        }"
        :hover="{ scale: 1.05 }"
        :class="[
          'backdrop-blur-sm rounded-xl p-6 text-center transition-all duration-300',
          isDark
            ? 'bg-white/10 hover:bg-white/15'
            : 'bg-gray-900/5 hover:bg-gray-900/10',
        ]"
      >
        <i class="fa-solid fa-code text-3xl text-blue-400 mb-3"></i>
        <h3
          :class="[
            'font-medium transition-colors duration-300',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ skill }}
        </h3>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

defineProps<{
  skills: string[];
}>();

const { isDark } = useTheme();
</script>
