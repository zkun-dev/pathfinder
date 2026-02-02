<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- 3D背景 -->
    <ThreeDBackground />

    <!-- 渐变遮罩 -->
    <div
      :class="[
        'absolute inset-0 z-0 transition-opacity duration-500',
        isDark
          ? 'bg-gradient-to-b from-black/50 via-black/70 to-black/90'
          : 'bg-gradient-to-b from-white/50 via-white/70 to-white/90',
      ]"
    ></div>

    <!-- 头部导航 - 始终显示 -->
    <Header :nav-items="NAV_ITEMS" />

    <!-- 加载状态 - 只占据内容区域，不覆盖头部 -->
    <div 
      v-if="loading" 
      class="fixed top-16 left-0 right-0 bottom-0 z-40"
      style="position: fixed; top: 4rem; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0;"
    >
      <LoadingSpinner size="md" />
    </div>

    <!-- 页面内容 -->
    <div v-if="!loading" class="relative z-10 container mx-auto px-4 pt-20">
      <!-- 内容 -->
      <div v-if="profile" class="max-w-6xl mx-auto">
        <!-- 顶部导航栏 -->
        <div class="sticky top-16 sm:top-20 z-40 mb-8 pb-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-200'">
          <div class="flex items-center justify-between gap-2 sm:gap-4">
            <button
              @click="$router.push('/')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105',
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              ]"
            >
              <i class="fa-solid fa-arrow-left"></i>
              <span class="hidden sm:inline">返回首页</span>
            </button>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="space-y-12 mb-12">
          <!-- 个人信息区域 -->
          <section class="space-y-6">
            <div class="flex items-start gap-6">
              <!-- 头像 -->
              <div
                v-if="profile.avatarUrl"
                class="flex-shrink-0 relative"
              >
                <div
                  :class="[
                    'absolute inset-0 rounded-full blur-xl opacity-50',
                    isDark ? 'bg-blue-500/30' : 'bg-blue-400/30',
                  ]"
                ></div>
                <ImageWithPlaceholder
                  :src="profile.avatarUrl"
                  :alt="profile.name"
                  container-class="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 shadow-2xl"
                  :class="isDark ? 'border-white/20' : 'border-gray-300/50'"
                  image-class="w-full h-full rounded-full object-cover"
                  placeholder-class="rounded-full"
                  placeholder-icon-class="text-3xl"
                />
              </div>
              <div
                v-else
                class="flex-shrink-0 relative"
              >
                <div
                  :class="[
                    'w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-2xl',
                    isDark
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600',
                  ]"
                >
                  {{ profile.name?.[0]?.toUpperCase() || 'U' }}
                </div>
              </div>
              
              <div class="flex-1">
                <h1
                  :class="[
                    'text-4xl md:text-5xl font-bold mb-2',
                    isDark ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ profile.name }}
                </h1>
                <div
                  :class="[
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base md:text-lg mb-4 transition-colors',
                    isDark
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-blue-100 text-blue-700 border border-blue-200',
                  ]"
                >
                  <i
                    :class="[
                      'fa-solid fa-briefcase text-sm',
                      isDark ? 'text-blue-400' : 'text-blue-600',
                    ]"
                  ></i>
                  {{ profile.title }}
                </div>
                <p
                  v-if="profile.bio"
                  :class="[
                    'text-lg md:text-xl leading-relaxed',
                    isDark ? 'text-gray-300' : 'text-gray-700',
                  ]"
                >
                  {{ profile.bio }}
                </p>
              </div>
            </div>
          </section>

          <!-- 联系信息 -->
          <section class="pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <h2
              :class="[
                'text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              <i
                :class="[
                  'fa-solid fa-address-card text-xl',
                  isDark ? 'text-blue-400' : 'text-blue-600',
                ]"
              ></i>
              联系信息
            </h2>
            <div v-if="profile.location || profile.email || profile.phone" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-if="profile.location"
                :class="[
                  'flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-gray-50 hover:bg-gray-100',
                ]"
              >
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    isDark
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-100 text-blue-600',
                  ]"
                >
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <p
                    :class="[
                      'text-sm font-semibold mb-1 transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-500',
                    ]"
                  >
                    所在地
                  </p>
                  <p
                    :class="[
                      'text-base font-medium transition-colors',
                      isDark ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ profile.location }}
                  </p>
                </div>
              </div>

              <div
                v-if="profile.email"
                :class="[
                  'flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-gray-50 hover:bg-gray-100',
                ]"
              >
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    isDark
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-purple-100 text-purple-600',
                  ]"
                >
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    :class="[
                      'text-sm font-semibold mb-1 transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-500',
                    ]"
                  >
                    邮箱
                  </p>
                  <a
                    :href="`mailto:${profile.email}`"
                    :class="[
                      'text-base font-medium transition-colors break-all hover:underline',
                      isDark
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-700',
                    ]"
                  >
                    {{ profile.email }}
                  </a>
                </div>
              </div>

              <div
                v-if="profile.phone"
                :class="[
                  'flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-gray-50 hover:bg-gray-100',
                ]"
              >
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    isDark
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-green-100 text-green-600',
                  ]"
                >
                  <i class="fa-solid fa-phone"></i>
                </div>
                <div>
                  <p
                    :class="[
                      'text-sm font-semibold mb-1 transition-colors',
                      isDark ? 'text-gray-400' : 'text-gray-500',
                    ]"
                  >
                    电话
                  </p>
                  <a
                    :href="`tel:${profile.phone}`"
                    :class="[
                      'text-base font-medium transition-colors hover:underline',
                      isDark
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-green-600 hover:text-green-700',
                    ]"
                  >
                    {{ profile.phone }}
                  </a>
                </div>
              </div>
            </div>
            <EmptyState
              v-else
              title="暂无联系信息"
              description="联系信息尚未填写"
              icon="fa-solid fa-address-card"
            />
          </section>

          <!-- 社交媒体 -->
          <section v-if="socialLinks.length > 0" class="pt-8 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
            <h2
              :class="[
                'text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              <i
                :class="[
                  'fa-solid fa-share-nodes text-xl',
                  isDark ? 'text-blue-400' : 'text-blue-600',
                ]"
              ></i>
              社交媒体
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                v-for="link in socialLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
                ]"
              >
                <i :class="[`fa-brands ${link.icon}`, 'text-xl']"></i>
                <span>{{ link.name }}</span>
                <i class="fa-solid fa-external-link ml-auto text-sm opacity-50"></i>
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { defineAsyncComponent } from 'vue';
import { useTheme } from '@/composables/useTheme';
import Header from '@/components/Header.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { NAV_ITEMS } from '@/constants';
import EmptyState from '@/components/EmptyState.vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import { profileApi } from '@/services/api';
import { logger } from '@/utils/logger';
import type { Profile, SocialLink } from '@/types';

const ThreeDBackground = defineAsyncComponent(() =>
  import('@/components/ThreeDBackground.vue')
);

const { isDark } = useTheme();

const profile = ref<Profile | null>(null);
const loading = ref(true);

const socialLinks = computed<SocialLink[]>(() => {
  if (!profile.value?.socialLinks) return [];
  if (Array.isArray(profile.value.socialLinks)) {
    return profile.value.socialLinks as SocialLink[];
  }
  return [];
});

const fetchData = async () => {
  try {
    loading.value = true;
    profile.value = await profileApi.getProfile();
  } catch (err) {
    logger.error('获取数据失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
