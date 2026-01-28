<template>
  <div>
    <!-- 单个图片上传 -->
    <div v-if="!multiple">
      <label :class="labelClass">
        <i :class="iconClass"></i>
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <!-- 预览区域 -->
      <div v-if="previewUrl || (modelValue && typeof modelValue === 'string')" class="mb-3">
        <div class="relative inline-block">
          <div
            v-if="imageError"
            class="w-32 h-32 rounded-lg border-2 flex items-center justify-center"
            :class="isDark ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'"
          >
            <div class="text-center">
              <i class="fa-solid fa-image text-2xl mb-1" :class="isDark ? 'text-red-400' : 'text-red-500'"></i>
              <p class="text-xs" :class="isDark ? 'text-red-400' : 'text-red-600'">加载失败</p>
            </div>
          </div>
          <ImageWithPlaceholder
            v-else
            :src="previewUrl || (typeof modelValue === 'string' ? modelValue : '')"
            :alt="label"
            container-class="w-32 h-32 rounded-lg border-2"
            :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            image-class="w-32 h-32 object-cover rounded-lg"
            placeholder-class="rounded-lg"
            placeholder-icon-class="text-2xl"
          />
          <button
            v-if="(modelValue && typeof modelValue === 'string') || previewUrl"
            type="button"
            @click="clearImage"
            :class="[
              'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transition-all hover:scale-110',
              'bg-red-500 hover:bg-red-600',
            ]"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
      </div>

      <!-- 上传按钮 -->
      <div class="flex items-center gap-3">
        <label
          :class="[
            'flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer',
            uploading
              ? 'bg-gray-400 cursor-wait'
              : isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white',
          ]"
        >
          <i v-if="uploading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-upload"></i>
          <span>{{ uploading ? '上传中...' : '选择图片' }}</span>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleSingleFileChange"
            :disabled="uploading"
          />
        </label>
        <p
          v-if="error"
          :class="[
            'text-xs transition-colors',
            isDark ? 'text-red-400' : 'text-red-600',
          ]"
        >
          {{ error }}
        </p>
      </div>
      
      <p
        :class="[
          'text-xs mt-1 transition-colors',
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      >
        支持 JPG、PNG、GIF 格式，最大 {{ maxSizeMB }}MB
      </p>
    </div>

    <!-- 多个图片上传 -->
    <div v-else>
      <label :class="labelClass">
        <i :class="iconClass"></i>
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
        <span
          v-if="imageUrls.length > 0"
          :class="[
            'ml-2 text-xs font-normal',
            isDark ? 'text-gray-400' : 'text-gray-500',
          ]"
        >
          (已选择 {{ imageUrls.length }}/{{ maxCount }})
        </span>
      </label>

      <!-- 图片预览网格 -->
      <div v-if="imageUrls.length > 0" class="grid grid-cols-4 gap-3 mb-3">
        <div
          v-for="(url, index) in imageUrls"
          :key="index"
          class="relative group"
        >
          <div
            v-if="imageErrors[index]"
            class="w-full h-24 rounded-lg border-2 flex items-center justify-center"
            :class="isDark ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'"
          >
            <div class="text-center">
              <i class="fa-solid fa-image text-lg mb-1" :class="isDark ? 'text-red-400' : 'text-red-500'"></i>
              <p class="text-xs" :class="isDark ? 'text-red-400' : 'text-red-600'">加载失败</p>
            </div>
          </div>
          <ImageWithPlaceholder
            v-else
            :src="url"
            :alt="`${label} ${index + 1}`"
            container-class="w-full h-24 rounded-lg border-2"
            :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            image-class="w-full h-24 object-cover rounded-lg"
            placeholder-class="rounded-lg"
            placeholder-icon-class="text-lg"
          />
          <button
            type="button"
            @click="removeImage(index)"
            :class="[
              'absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs transition-all opacity-0 group-hover:opacity-100',
              'bg-red-500 hover:bg-red-600',
            ]"
          >
            <i class="fa-solid fa-times text-xs"></i>
          </button>
        </div>
      </div>

      <!-- 上传按钮 -->
      <div class="flex items-center gap-3">
        <label
          :class="[
            'flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer',
            uploading || imageUrls.length >= maxCount
              ? 'bg-gray-400 cursor-not-allowed'
              : isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white',
          ]"
        >
          <i v-if="uploading" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-upload"></i>
          <span>{{ uploading ? '上传中...' : `选择图片 (最多${maxCount}张)` }}</span>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleMultipleFileChange"
            :disabled="uploading || imageUrls.length >= maxCount"
          />
        </label>
        <p
          v-if="error"
          :class="[
            'text-xs transition-colors',
            isDark ? 'text-red-400' : 'text-red-600',
          ]"
        >
          {{ error }}
        </p>
      </div>
      
      <p
        :class="[
          'text-xs mt-1 transition-colors',
          isDark ? 'text-gray-500' : 'text-gray-400',
        ]"
      >
        支持 JPG、PNG、GIF 格式，每张最大 {{ maxSizeMB }}MB，最多上传 {{ maxCount }} 张
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { uploadApi } from '@/services/api';
import { logger } from '@/utils/logger';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';

interface Props {
  modelValue?: string | string[];
  label: string;
  icon?: string;
  multiple?: boolean;
  maxCount?: number;
  maxSizeMB?: number;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxCount: 100,
  maxSizeMB: 10, // 与后端一致，10MB
  required: false,
  icon: 'fa-solid fa-image',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]];
}>();

const { isDark } = useTheme();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const error = ref<string | null>(null);
const previewUrl = ref<string | null>(null);
const imageError = ref(false);
const imageErrors = ref<Record<number, boolean>>({});

// 单个图片的URL
const singleImageUrl = computed({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : ''),
  set: (value) => emit('update:modelValue', value),
});

// 多个图片的URL数组
const imageUrls = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value) => emit('update:modelValue', value),
});

const labelClass = computed(() => [
  'flex items-center text-sm font-medium mb-2 transition-colors',
  isDark.value ? 'text-gray-300' : 'text-gray-700',
]);

const iconClass = computed(() => [
  props.icon,
  'text-xs mr-1.5',
]);

import { validateFileType as validateFileTypeUtil, validateFileSize as validateFileSizeUtil, toFullUrl } from '@/utils/upload'

// 验证文件大小
const validateFileSize = (file: File): boolean => {
  const maxSize = props.maxSizeMB * 1024 * 1024 // 转换为字节
  if (!validateFileSizeUtil(file, maxSize)) {
    error.value = `文件大小不能超过 ${props.maxSizeMB}MB`
    return false
  }
  return true
}

// 验证文件类型
const validateFileType = (file: File): boolean => {
  if (!validateFileTypeUtil(file)) {
    error.value = '只支持 JPG、PNG、GIF、WebP 格式的图片'
    return false
  }
  return true
}

// 上传单个文件
const uploadFile = async (file: File): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error(error.value || '文件类型验证失败');
  }
  if (!validateFileSize(file)) {
    throw new Error(error.value || '文件大小验证失败');
  }

  uploading.value = true;
  error.value = null;

  try {
    const response = await uploadApi.uploadFile(file)
    // 使用工具函数将相对路径转换为完整 URL
    return toFullUrl(response.url)
  } catch (err: any) {
    error.value = err.message || '上传失败';
    throw err;
  } finally {
    uploading.value = false;
  }
};

// 处理单个文件选择
const handleSingleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  error.value = null;
  imageError.value = false;

  // 创建预览
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  try {
    const url = await uploadFile(file);
    singleImageUrl.value = url;
    previewUrl.value = null; // 清除预览，使用实际URL
    imageError.value = false;
  } catch (err) {
    previewUrl.value = null;
    imageError.value = false;
  } finally {
    // 清空input，允许重复选择同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

// 处理多个文件选择
const handleMultipleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  if (files.length === 0) return;

  error.value = null;

  // 检查数量限制
  const remainingSlots = props.maxCount - imageUrls.value.length;
  if (files.length > remainingSlots) {
    error.value = `最多只能再上传 ${remainingSlots} 张图片`;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    return;
  }

  uploading.value = true;

  try {
    const uploadPromises = files.map((file) => {
      if (!validateFileType(file)) {
        throw new Error('文件类型验证失败');
      }
      if (!validateFileSize(file)) {
        throw new Error('文件大小验证失败');
      }
      return uploadFile(file);
    });

    const urls = await Promise.all(uploadPromises);
    imageUrls.value = [...imageUrls.value, ...urls];
    error.value = null;
  } catch (err: any) {
    error.value = err.message || '部分文件上传失败';
  } finally {
    uploading.value = false;
    // 清空input
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

// 清除单个图片
const clearImage = async () => {
  const urlToDelete = singleImageUrl.value;
  
  // 如果有URL，先尝试删除服务器上的文件
  if (urlToDelete) {
    try {
      await uploadApi.deleteFile(urlToDelete);
    } catch (err: any) {
      // 删除失败不影响前端清除，只记录错误
      logger.warn('删除服务器文件失败:', err.message || '未知错误');
      // 可以选择显示错误提示，但不阻止删除操作
      // error.value = '删除服务器文件失败，但已从前端移除';
    }
  }
  
  singleImageUrl.value = '';
  previewUrl.value = null;
  error.value = null;
  imageError.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// 移除多个图片中的一张
const removeImage = async (index: number) => {
  const urlToDelete = imageUrls.value[index];
  
  // 如果有URL，先尝试删除服务器上的文件
  if (urlToDelete) {
    try {
      await uploadApi.deleteFile(urlToDelete);
    } catch (err: any) {
      // 删除失败不影响前端清除，只记录错误
      logger.warn('删除服务器文件失败:', err.message || '未知错误');
      // 可以选择显示错误提示，但不阻止删除操作
      // error.value = '删除服务器文件失败，但已从前端移除';
    }
  }
  
  const newUrls = [...imageUrls.value];
  newUrls.splice(index, 1);
  imageUrls.value = newUrls;
  // 清除对应的错误状态
  const newErrors: Record<number, boolean> = {};
  Object.keys(imageErrors.value).forEach((key) => {
    const keyNum = parseInt(key);
    if (keyNum < index) {
      newErrors[keyNum] = imageErrors.value[keyNum];
    } else if (keyNum > index) {
      newErrors[keyNum - 1] = imageErrors.value[keyNum];
    }
  });
  imageErrors.value = newErrors;
  error.value = null;
};

// 处理单个图片加载错误
const handleImageError = (_event: Event) => {
  imageError.value = true;
  logger.error('图片加载失败:', previewUrl.value || singleImageUrl.value);
};

// 处理多个图片加载错误
const handleMultipleImageError = (_event: Event, index: number) => {
  imageErrors.value[index] = true;
  logger.error(`图片 ${index + 1} 加载失败:`, imageUrls.value[index]);
};

// 监听modelValue变化，清除错误
watch(() => props.modelValue, () => {
  error.value = null;
});
</script>
