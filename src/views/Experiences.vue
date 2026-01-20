<template>
  <PageLayout title="工作经历" :loading="loading">
    <ExperiencesTimeline :experiences="experiences" :simple="false" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import PageLayout from '@/components/PageLayout.vue';
import ExperiencesTimeline from '@/components/ExperiencesTimeline.vue';
import { experienceApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Experience } from '@/types';

const { isDark } = useTheme();

const experiences = ref<Experience[]>([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    experiences.value = await experienceApi.getExperiences();
  } catch (err) {
    logger.error('获取工作经历失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
