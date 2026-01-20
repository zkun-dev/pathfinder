<template>
  <PageLayout title="生活动态" :loading="loading">
    <LifeGallery :life-posts="lifePosts" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import PageLayout from '@/components/PageLayout.vue';
import LifeGallery from '@/components/LifeGallery.vue';
import { lifeApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Life } from '@/types';

const { isDark } = useTheme();

const lifePosts = ref<Life[]>([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await lifeApi.getLifePosts({ published: true, limit: 100 });
    lifePosts.value = response.data;
  } catch (err) {
    logger.error('获取生活动态失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
