<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- 3D背景 -->
    <ThreeDBackground />

    <!-- 渐变遮罩，使前景内容更清晰 -->
    <div
      :class="[
        'absolute inset-0 z-0 transition-opacity duration-500',
        isDark
          ? 'bg-gradient-to-b from-black/50 via-black/70 to-black/90'
          : 'bg-gradient-to-b from-white/50 via-white/70 to-white/90',
      ]"
    ></div>

    <!-- 页面内容 -->
    <div class="relative z-10 container mx-auto px-4 pt-20 md:pt-16">
      <!-- 顶部导航 -->
      <Header :nav-items="NAV_ITEMS" />

      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div
            :class="[
              'inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent',
              isDark ? 'border-white' : 'border-gray-900',
            ]"
          ></div>
          <p
            :class="[
              'mt-4 text-lg transition-colors duration-300',
              isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            加载中...
          </p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div
        v-else-if="error"
        class="flex items-center justify-center min-h-screen"
      >
        <div class="text-center">
          <p
            :class="[
              'text-lg mb-4 transition-colors duration-300',
              isDark ? 'text-red-400' : 'text-red-600',
            ]"
          >
            {{ error }}
          </p>
          <button
            @click="fetchData"
            class="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>

      <!-- 正常内容 -->
      <template v-else-if="profile">
                    <!-- 英雄区域 - 全宽突出显示 -->
                    <section id="hero" class="pt-6 mb-32 scroll-mt-24">
                      <HeroSection
            :profile="profile"
            :avatar-url="profile.avatarUrl || undefined"
            :stats="{
              projects: projects.length,
              experiences: experiences.length,
              learnings: learnings.length,
              life: lifePosts.length,
            }"
          />
        </section>

                    <!-- 技能展示 - 紧凑网格，无边框背景 -->
                    <section id="技能" class="pt-6 mb-24 scroll-mt-24">
                      <div class="max-w-6xl mx-auto">
                        <div class="mb-10">
                          <h2
                            :class="[
                              'text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300',
                              isDark ? 'text-white' : 'text-gray-900',
                            ]"
                          >
                            技能专长
                          </h2>
                          <p
                            :class="[
                              'text-sm transition-colors duration-300',
                              isDark ? 'text-gray-400' : 'text-gray-500',
                            ]"
                          >
                            掌握的技术栈与工具
                          </p>
                        </div>
                        <SkillsSection :skills="skills" />
                      </div>
                    </section>

        <!-- 分割线 -->
        <div
          :class="[
            'max-w-6xl mx-auto mb-24',
            isDark ? 'border-t border-white/10' : 'border-t border-gray-200',
          ]"
        ></div>

        <!-- 项目展示 - 大卡片，突出封面 -->
        <section
          id="项目"
          class="pt-6 mb-24 scroll-mt-24"
        >
          <div class="max-w-6xl mx-auto">
            <div class="mb-12">
              <h2
                :class="[
                  'text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                精选项目
              </h2>
              <p
                :class="[
                  'text-sm transition-colors duration-300',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                我的作品与实践
              </p>
            </div>
            <ProjectsSection :projects="projects" />
          </div>
        </section>

        <!-- 分割线 -->
        <div
          :class="[
            'max-w-6xl mx-auto mb-24',
            isDark ? 'border-t border-white/10' : 'border-t border-gray-200',
          ]"
        ></div>

        <!-- 工作经历预览 - 时间线，简洁背景 -->
        <section
          id="工作经历"
          v-if="experiences.length > 0"
          class="pt-6 mb-24 scroll-mt-24"
        >
          <div class="max-w-6xl mx-auto">
            <div class="mb-12">
              <h2
                :class="[
                  'text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                工作经历
              </h2>
              <p
                :class="[
                  'text-sm transition-colors duration-300',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                职业发展历程
              </p>
            </div>
            <ExperiencesTimeline :experiences="experiences" :simple="true" />
          </div>
        </section>

        <!-- 分割线 -->
        <div
          v-if="experiences.length > 0"
          :class="[
            'container mx-auto mb-24',
            isDark ? 'border-t border-white/10' : 'border-t border-gray-200',
          ]"
        ></div>

        <!-- 学习记录预览 - 紧凑卡片网格 -->
        <section
          id="学习记录"
          class="pt-6 mb-24 scroll-mt-24"
        >
          <div class="max-w-6xl mx-auto">
            <div class="mb-10">
              <h2
                :class="[
                  'text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                学习记录
              </h2>
              <p
                :class="[
                  'text-sm transition-colors duration-300',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                持续学习与成长
              </p>
            </div>
            <LearningsSection :learnings="learnings" />
          </div>
        </section>

        <!-- 分割线 -->
        <div
          v-if="learnings.length > 0"
          :class="[
            'container mx-auto mb-24',
            isDark ? 'border-t border-white/10' : 'border-t border-gray-200',
          ]"
        ></div>

        <!-- 生活动态预览 - 图片画廊，渐变背景 -->
        <section
          id="生活动态"
          class="pt-6 mb-24 scroll-mt-24"
        >
          <div class="max-w-6xl mx-auto">
            <div class="mb-12">
              <h2
                :class="[
                  'text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                生活动态
              </h2>
              <p
                :class="[
                  'text-sm transition-colors duration-300',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                记录生活的美好瞬间
              </p>
            </div>
            <LifeGallery :life-posts="lifePosts" />
          </div>
        </section>

        <!-- 关于我 -->
        <section id="关于我" class="pt-6 mb-24 scroll-mt-24">
          <div class="max-w-6xl mx-auto">
            <Footer
              :name="profile.name"
              :social-links="socialLinks"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { defineAsyncComponent } from "vue";
import { useTheme } from "@/composables/useTheme";
import Header from "@/components/Header.vue";
import HeroSection from "@/components/HeroSection.vue";
import SkillsSection from "@/components/SkillsSection.vue";
import ProjectsSection from "@/components/ProjectsSection.vue";
import ExperiencesTimeline from "@/components/ExperiencesTimeline.vue";
import LearningsSection from "@/components/LearningsSection.vue";
import LifeGallery from "@/components/LifeGallery.vue";
import Footer from "@/components/Footer.vue";
import { NAV_ITEMS } from "@/constants";
import { profileApi, skillApi, projectApi, experienceApi, learningApi, lifeApi } from "@/services/api";
import { logger } from "@/utils/logger";
import type { Profile, Skill, Project, SocialLink, Experience, Learning, Life } from "@/types";

const ThreeDBackground = defineAsyncComponent(() =>
  import("@/components/ThreeDBackground.vue")
);

const { isDark } = useTheme();

// 数据状态
const profile = ref<Profile | null>(null);
const skills = ref<Skill[]>([]);
const projects = ref<Project[]>([]);
const experiences = ref<Experience[]>([]);
const learnings = ref<Learning[]>([]);
const lifePosts = ref<Life[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// 计算属性：处理社交链接
const socialLinks = computed<SocialLink[]>(() => {
  if (!profile.value?.socialLinks) return [];
  // 如果socialLinks是数组，直接返回；如果是对象，转换为数组
  if (Array.isArray(profile.value.socialLinks)) {
    return profile.value.socialLinks as SocialLink[];
  }
  return [];
});

// 从API获取数据
const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 并行获取所有数据
    const [profileData, skillsData, projectsData, experiencesData, learningsData, lifeData] = await Promise.all([
      profileApi.getProfile(),
      skillApi.getSkills(),
      projectApi.getProjects({ featured: true, limit: 6 }),
      experienceApi.getExperiences().catch(() => []),
      learningApi.getLearnings({ limit: 100 }).catch(() => []),
      lifeApi.getLifePosts({ published: true, limit: 6 }).catch(() => ({ data: [] })),
    ]);

    profile.value = profileData;
    // 技能：只显示一行（6个）
    skills.value = Array.isArray(skillsData) ? skillsData.slice(0, 6) : [];
    // 项目：只显示一行（3个）
    projects.value = Array.isArray(projectsData.data) ? projectsData.data.slice(0, 3) : [];
    // 工作经历：只显示2个
    experiences.value = Array.isArray(experiencesData) ? experiencesData.slice(0, 2) : [];
    // 学习记录：只显示一行（3个）
    learnings.value = Array.isArray(learningsData) ? learningsData.slice(0, 3) : [];
    // 生活动态：只显示一行（3个）
    const lifeArray = Array.isArray(lifeData) ? lifeData : (lifeData as any)?.data || [];
    lifePosts.value = Array.isArray(lifeArray) ? lifeArray.slice(0, 3) : [];
  } catch (err: any) {
    logger.error("获取数据失败:", err);
    error.value = err.message || "获取数据失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  fetchData();
});
</script>