<template>
  <PageLayout title="所有项目" :loading="loading">
    <div class="flex gap-2 mb-6">
      <button
        @click="filterType = null"
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          filterType === null
            ? 'bg-blue-500 text-white'
            : isDark
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        全部
      </button>
      <button
        v-for="type in projectTypes"
        :key="type"
        @click="filterType = type"
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          filterType === type
            ? 'bg-blue-500 text-white'
            : isDark
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        {{ type }}
      </button>
    </div>

    <ProjectsSection :projects="filteredProjects" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import PageLayout from '@/components/PageLayout.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import { projectApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Project } from '@/types';

const { isDark } = useTheme();

const projects = ref<Project[]>([]);
const loading = ref(true);
const filterType = ref<string | null>(null);

const projectTypes = computed(() => {
  const types = new Set<string>();
  projects.value.forEach((p) => {
    if (p.type) types.add(p.type);
  });
  return Array.from(types);
});

const filteredProjects = computed(() => {
  if (!filterType.value) return projects.value;
  return projects.value.filter((p) => p.type === filterType.value);
});

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await projectApi.getProjects({ limit: 100 });
    projects.value = response.data;
  } catch (err) {
    logger.error('获取项目列表失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
