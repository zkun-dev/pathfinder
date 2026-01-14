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
    <div class="relative z-10 container mx-auto px-4 py-12">
      <!-- 顶部导航 -->
      <Header :nav-items="NAV_ITEMS" />

      <!-- 英雄区域 -->
      <HeroSection
        :personal-info="personalInfo"
        avatar-url="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20of%20a%20confident%20young%20asian%20male%20developer%20smiling&sign=f177b126d435616aefaed46dcd449383"
      />

      <!-- 技能展示 -->
      <SkillsSection :skills="personalInfo.skills" />

      <!-- 项目展示 -->
      <ProjectsSection :projects="personalInfo.projects" />

      <!-- 页脚 -->
      <Footer :name="personalInfo.name" :social-links="personalInfo.socialLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useTheme } from "@/composables/useTheme";
import Header from "@/components/Header.vue";
import HeroSection from "@/components/HeroSection.vue";
import SkillsSection from "@/components/SkillsSection.vue";
import ProjectsSection from "@/components/ProjectsSection.vue";
import Footer from "@/components/Footer.vue";
import { NAV_ITEMS, DEFAULT_PERSONAL_INFO } from "@/constants";

const ThreeDBackground = defineAsyncComponent(() =>
  import("@/components/ThreeDBackground.vue")
);

const personalInfo = DEFAULT_PERSONAL_INFO;
const { isDark } = useTheme();
</script>