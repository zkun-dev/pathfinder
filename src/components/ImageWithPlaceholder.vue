<template>
  <div class="relative" :class="containerClass">
    <!-- 加载中的占位符 -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
      :class="[
        placeholderClass,
        isDark ? 'bg-gray-700/50' : 'bg-gray-100',
      ]"
    >
      <i
        :class="[
          'fa-solid fa-image',
          placeholderIconClass,
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      ></i>
    </div>

    <!-- 图片 -->
    <img
      v-show="!loading && !error"
      :src="src"
      :alt="alt"
      :class="imageClass"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 加载失败占位符 -->
    <div
      v-if="error"
      class="absolute inset-0 flex flex-col items-center justify-center"
      :class="[
        placeholderClass,
        isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100 border-gray-300',
      ]"
    >
      <i
        :class="[
          'fa-solid fa-image',
          placeholderIconClass,
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      ></i>
      <span
        v-if="showErrorText"
        :class="[
          'text-xs mt-1',
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      >
        加载失败
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTheme } from '@/composables/useTheme';

interface Props {
  src?: string | null;
  alt?: string;
  containerClass?: string;
  imageClass?: string;
  placeholderClass?: string;
  placeholderIconClass?: string;
  showErrorText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  containerClass: '',
  imageClass: 'w-full h-full object-cover',
  placeholderClass: '',
  placeholderIconClass: 'text-2xl',
  showErrorText: false,
});

const { isDark } = useTheme();
const loading = ref(true);
const error = ref(false);

const handleLoad = () => {
  loading.value = false;
  error.value = false;
};

const handleError = () => {
  loading.value = false;
  error.value = true;
};

// 监听 src 变化，重置状态
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      loading.value = true;
      error.value = false;
    } else {
      loading.value = false;
      error.value = true;
    }
  },
  { immediate: true }
);
</script>
