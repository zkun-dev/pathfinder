<template>
  <div class="h-[calc(100vh-7rem)]">
    <LoadingSpinner v-if="initialLoading" size="md" />
    <template v-else>
    <h2
      :class="[
        'text-2xl font-bold mb-6 transition-colors',
        isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      仪表盘
    </h2>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div
        :class="[
          'p-6 rounded-xl transition-colors',
          isDark ? 'bg-gray-800' : 'bg-white',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm transition-colors',
                isDark ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              技能总数
            </p>
            <p
              :class="[
                'text-3xl font-bold mt-2 transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ stats.skills }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-blue-500/20">
            <i class="fa-solid fa-code text-2xl text-blue-500"></i>
          </div>
        </div>
      </div>

      <div
        :class="[
          'p-6 rounded-xl transition-colors',
          isDark ? 'bg-gray-800' : 'bg-white',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm transition-colors',
                isDark ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              项目总数
            </p>
            <p
              :class="[
                'text-3xl font-bold mt-2 transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ stats.projects }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-green-500/20">
            <i class="fa-solid fa-folder text-2xl text-green-500"></i>
          </div>
        </div>
      </div>

      <div
        :class="[
          'p-6 rounded-xl transition-colors',
          isDark ? 'bg-gray-800' : 'bg-white',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm transition-colors',
                isDark ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              工作经历
            </p>
            <p
              :class="[
                'text-3xl font-bold mt-2 transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ stats.experiences }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-purple-500/20">
            <i class="fa-solid fa-briefcase text-2xl text-purple-500"></i>
          </div>
        </div>
      </div>

      <div
        :class="[
          'p-6 rounded-xl transition-colors',
          isDark ? 'bg-gray-800' : 'bg-white',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm transition-colors',
                isDark ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              学习记录
            </p>
            <p
              :class="[
                'text-3xl font-bold mt-2 transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ stats.learnings }}
            </p>
          </div>
          <div class="p-3 rounded-lg bg-yellow-500/20">
            <i class="fa-solid fa-book text-2xl text-yellow-500"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div
      :class="[
        'p-6 rounded-xl transition-colors',
        isDark ? 'bg-gray-800' : 'bg-white',
      ]"
    >
      <h3
        :class="[
          'text-lg font-semibold mb-4 transition-colors',
          isDark ? 'text-white' : 'text-gray-900',
        ]"
      >
        快速操作
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          to="/admin/profile"
          :class="[
            'p-4 rounded-lg text-center transition-colors',
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          ]"
        >
          <i class="fa-solid fa-user text-2xl mb-2"></i>
          <p class="text-sm">个人信息</p>
        </router-link>
        <router-link
          to="/admin/skills"
          :class="[
            'p-4 rounded-lg text-center transition-colors',
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          ]"
        >
          <i class="fa-solid fa-code text-2xl mb-2"></i>
          <p class="text-sm">技能管理</p>
        </router-link>
        <router-link
          to="/admin/projects"
          :class="[
            'p-4 rounded-lg text-center transition-colors',
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          ]"
        >
          <i class="fa-solid fa-folder text-2xl mb-2"></i>
          <p class="text-sm">项目管理</p>
        </router-link>
        <router-link
          to="/admin/life"
          :class="[
            'p-4 rounded-lg text-center transition-colors',
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
          ]"
        >
          <i class="fa-solid fa-heart text-2xl mb-2"></i>
          <p class="text-sm">生活动态</p>
        </router-link>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { skillApi, projectApi, experienceApi, learningApi } from '@/services/api';
import { logger } from '@/utils/logger';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const { isDark } = useTheme();

const stats = ref({
  skills: 0,
  projects: 0,
  experiences: 0,
  learnings: 0,
});

const initialLoading = ref(true);

const loadStats = async () => {
  try {
    initialLoading.value = true;
    const [skills, projects, experiences, learnings] = await Promise.all([
      skillApi.getSkills(),
      projectApi.getProjects({ limit: 1 }),
      experienceApi.getExperiences(),
      learningApi.getLearnings({ limit: 1 }),
    ]);

    stats.value = {
      skills: skills.length,
      projects: projects.pagination.total,
      experiences: experiences.length,
      learnings: learnings.length,
    };
  } catch (err) {
    logger.error('加载统计数据失败:', err);
  } finally {
    initialLoading.value = false;
  }
};

onMounted(() => {
  loadStats();
});
</script>
