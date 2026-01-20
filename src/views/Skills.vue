<template>
  <PageLayout title="技能专长" :loading="loading">
    <SkillsSection :skills="skills" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import PageLayout from '@/components/PageLayout.vue';
import SkillsSection from '@/components/SkillsSection.vue';
import { skillApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Skill } from '@/types';

const { isDark } = useTheme();

const skills = ref<Skill[]>([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    skills.value = await skillApi.getSkills();
  } catch (err) {
    logger.error('获取技能列表失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
