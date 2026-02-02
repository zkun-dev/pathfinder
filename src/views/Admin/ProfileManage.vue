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
      个人信息管理
    </h2>

    <div class="space-y-6">
      <!-- 基本信息卡片 -->
      <div
        :class="[
          'p-6 rounded-xl transition-colors shadow-sm',
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200',
        ]"
      >
        <div class="flex items-center gap-2 mb-6">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isDark ? 'bg-blue-600/20' : 'bg-blue-100',
            ]"
          >
            <i class="fa-solid fa-user text-blue-500"></i>
          </div>
          <h3
            :class="[
              'text-lg font-semibold transition-colors',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            基本信息
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label :class="labelClass">
              <i class="fa-solid fa-signature text-xs"></i>
              姓名 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="请输入姓名"
              :class="inputClass"
            />
          </div>

          <div>
            <label :class="labelClass">
              <i class="fa-solid fa-briefcase text-xs"></i>
              职位 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="请输入职位"
              :class="inputClass"
            />
          </div>

          <div class="md:col-span-2">
            <label :class="labelClass">
              <i class="fa-solid fa-file-lines text-xs"></i>
              个人简介
            </label>
            <textarea
              v-model="form.bio"
              rows="4"
              placeholder="介绍一下自己..."
              :class="inputClass"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 头像和联系方式卡片 -->
      <div
        :class="[
          'p-6 rounded-xl transition-colors shadow-sm',
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200',
        ]"
      >
        <div class="flex items-center gap-2 mb-6">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isDark ? 'bg-purple-600/20' : 'bg-purple-100',
            ]"
          >
            <i class="fa-solid fa-address-card text-purple-500"></i>
          </div>
          <h3
            :class="[
              'text-lg font-semibold transition-colors',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            联系方式
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 头像上传 -->
          <div class="md:col-span-2">
            <ImageUpload
              v-model="form.avatarUrl"
              label="头像"
              icon="fa-solid fa-image"
              :max-size-m-b="5"
            />
          </div>

          <div>
            <label :class="labelClass">
              <i class="fa-solid fa-envelope text-xs"></i>
              邮箱
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="example@email.com"
              :class="inputClass"
            />
          </div>

          <div>
            <label :class="labelClass">
              <i class="fa-solid fa-phone text-xs"></i>
              电话
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="请输入电话号码"
              :class="inputClass"
            />
          </div>

          <div class="md:col-span-2">
            <label :class="labelClass">
              <i class="fa-solid fa-location-dot text-xs"></i>
              位置
            </label>
            <input
              v-model="form.location"
              type="text"
              placeholder="请输入所在位置"
              :class="inputClass"
            />
          </div>
        </div>
      </div>

      <!-- 社交链接卡片 -->
      <div
        :class="[
          'p-6 rounded-xl transition-colors shadow-sm',
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200',
        ]"
      >
        <div class="flex items-center gap-2 mb-6">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isDark ? 'bg-green-600/20' : 'bg-green-100',
            ]"
          >
            <i class="fa-solid fa-share-nodes text-green-500"></i>
          </div>
          <h3
            :class="[
              'text-lg font-semibold transition-colors',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            社交链接
          </h3>
        </div>

        <div>
          <label :class="labelClass">
            <i class="fa-solid fa-code text-xs"></i>
            JSON格式
          </label>
          <textarea
            v-model="socialLinksText"
            rows="6"
            placeholder='[{"name": "GitHub", "icon": "fa-github", "url": "https://github.com"}, {"name": "LinkedIn", "icon": "fa-linkedin", "url": "https://linkedin.com"}]'
            :class="inputClass"
            class="font-mono text-sm"
          ></textarea>
          <div class="mt-2 flex items-start gap-2">
            <i
              :class="[
                'fa-solid fa-circle-info text-xs mt-0.5',
                isDark ? 'text-gray-500' : 'text-gray-400',
              ]"
            ></i>
            <p
              :class="[
                'text-xs transition-colors',
                isDark ? 'text-gray-500' : 'text-gray-400',
              ]"
            >
              请输入有效的JSON数组格式，每个对象包含 name（名称）、icon（图标类名）、url（链接地址）字段
            </p>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div v-if="error" class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
        <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
        <p class="text-sm text-red-500 flex-1">{{ error }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end gap-4 pt-4">
        <button
          type="button"
          @click="loadProfile"
          :class="[
            'px-6 py-2.5 rounded-lg transition-all font-medium',
            isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          <i class="fa-solid fa-rotate mr-2"></i>
          重置
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="loading"
          class="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
        >
          <i v-if="!loading" class="fa-solid fa-floppy-disk mr-2"></i>
          <i v-else class="fa-solid fa-spinner fa-spin mr-2"></i>
          <span>{{ loading ? '保存中...' : '保存' }}</span>
        </button>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { profileApi } from '@/services/api';
import { logger } from '@/utils/logger';
import ImageUpload from '@/components/Admin/ImageUpload.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useToast } from '@/composables/useToast';

const { isDark } = useTheme();
const toast = useToast();

const form = ref({
  name: '',
  title: '',
  bio: '',
  avatarUrl: '',
  email: '',
  phone: '',
  location: '',
  socialLinks: null as any,
});

const socialLinksText = ref('');

const loading = ref(false);
const initialLoading = ref(true);
const error = ref<string | null>(null);

const labelClass = computed(() => [
  'flex items-center gap-2 text-sm font-medium mb-2 transition-colors',
  isDark.value ? 'text-gray-300' : 'text-gray-700',
]);

const inputClass = computed(() => {
  const base = 'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  if (isDark.value) {
    return `${base} bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500`;
  } else {
    return `${base} bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500`;
  }
});


const loadProfile = async () => {
  try {
    initialLoading.value = true;
    const profile = await profileApi.getProfile();
    form.value = {
      name: profile.name || '',
      title: profile.title || '',
      bio: profile.bio || '',
      avatarUrl: profile.avatarUrl || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      socialLinks: profile.socialLinks || null,
    };
    socialLinksText.value = profile.socialLinks
      ? JSON.stringify(profile.socialLinks, null, 2)
      : '';
  } catch (err: any) {
    logger.error('加载个人信息失败:', err);
    toast.error('加载个人信息失败');
  } finally {
    initialLoading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    const submitData: any = { ...form.value };
    
    // 处理社交链接
    if (socialLinksText.value.trim()) {
      try {
        submitData.socialLinks = JSON.parse(socialLinksText.value);
      } catch (e) {
        error.value = '社交链接JSON格式错误';
        toast.error('社交链接JSON格式错误');
        return;
      }
    } else {
      submitData.socialLinks = null;
    }

    await profileApi.updateProfile(submitData);
    toast.success('个人信息更新成功！');
  } catch (err: any) {
    error.value = err.message || '保存失败';
    toast.error(err.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>
