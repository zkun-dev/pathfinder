<template>
  <PageLayout title="学习记录" :loading="loading">
    <LearningsSection :learnings="learnings" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import PageLayout from '@/components/PageLayout.vue';
import LearningsSection from '@/components/LearningsSection.vue';
import { learningApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Learning } from '@/types';

const { isDark } = useTheme();

const learnings = ref<Learning[]>([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    learnings.value = await learningApi.getLearnings({ limit: 100 });
  } catch (err) {
    logger.error('获取学习记录失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
