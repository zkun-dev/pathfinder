<template>
  <div>
    <LoadingSpinner v-if="initialLoading" container-class="h-[calc(100vh-4rem)]" />
    <template v-else>
    <div class="flex justify-between items-center mb-6">
      <h2
        :class="[
          'text-2xl font-bold transition-colors',
          isDark ? 'text-white' : 'text-gray-900',
        ]"
      >
        生活动态管理
      </h2>
      <button
        v-if="lifePosts.length > 0"
        @click="showModal = true; editingLife = null; resetForm()"
        class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        添加动态
      </button>
    </div>

    <!-- 动态列表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="life in lifePosts"
        :key="life.id"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300',
          'border hover:shadow-lg hover:-translate-y-1',
          isDark
            ? 'bg-gradient-to-br from-gray-800 to-gray-800/90 border-gray-700 hover:border-blue-500'
            : 'bg-gradient-to-br from-white to-gray-50/50 border-gray-200 hover:border-blue-300',
        ]"
      >
        <!-- 封面图 -->
        <div
          v-if="life.coverImage"
          class="relative h-48 overflow-hidden"
        >
          <ImageWithPlaceholder
            :src="life.coverImage"
            :alt="life.title"
            container-class="w-full h-full"
            image-class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder-class="w-full h-full"
            placeholder-icon-class="text-2xl"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <!-- 发布状态 -->
          <div class="absolute top-0 right-0 z-20">
            <div
              :class="[
                'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
                life.published
                  ? isDark
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500 text-white'
                  : isDark
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-500 text-white',
              ]"
            >
              <i
                :class="[
                  'mr-1.5',
                  life.published ? 'fa-solid fa-check-circle' : 'fa-solid fa-file',
                ]"
              ></i>
              {{ life.published ? '已发布' : '草稿' }}
            </div>
          </div>
        </div>
        <div
          v-else
          :class="[
            'relative h-48 flex items-center justify-center',
            isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200',
          ]"
        >
          <!-- 发布状态 -->
          <div class="absolute top-0 right-0 z-20">
            <div
              :class="[
                'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
                life.published
                  ? isDark
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500 text-white'
                  : isDark
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-500 text-white',
              ]"
            >
              <i
                :class="[
                  'mr-1.5',
                  life.published ? 'fa-solid fa-check-circle' : 'fa-solid fa-file',
                ]"
              ></i>
              {{ life.published ? '已发布' : '草稿' }}
            </div>
          </div>
          <i
            :class="[
              'text-6xl opacity-20',
              isDark ? 'text-gray-500' : 'text-gray-400',
            ]"
          >
            <i class="fa-solid fa-image"></i>
          </i>
        </div>

        <div class="p-5 pt-8">
          <!-- 标题 -->
          <h3
            :class="[
              'text-lg font-bold mb-2 transition-colors line-clamp-2',
              isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ life.title }}
          </h3>

          <!-- 内容预览 -->
          <p
            :class="[
              'text-sm mb-4 line-clamp-2 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ life.content }}
          </p>

          <!-- 标签 -->
          <div v-if="life.tags && life.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(tag, index) in life.tags.slice(0, 3)"
              :key="index"
              :class="[
                'px-2 py-0.5 text-xs rounded-md',
                isDark
                  ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  : 'bg-pink-100 text-pink-700 border border-pink-200',
              ]"
            >
              #{{ tag }}
            </span>
            <span
              v-if="life.tags.length > 3"
              :class="[
                'px-2 py-0.5 text-xs rounded-md',
                isDark ? 'text-gray-400' : 'text-gray-500',
              ]"
            >
              +{{ life.tags.length - 3 }}
            </span>
          </div>

          <!-- 统计信息 -->
          <div class="flex items-center gap-4 text-xs mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-calendar"></i>
              {{ formatDate(life.createdAt) }}
            </span>
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-eye"></i>
              {{ life.views || 0 }} 次浏览
            </span>
            <span v-if="life.images && life.images.length > 0" class="flex items-center gap-1">
              <i class="fa-solid fa-images"></i>
              {{ life.images.length }} 张图片
            </span>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="editLife(life)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                'flex items-center gap-2',
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105',
              ]"
            >
              <i class="fa-solid fa-pen text-xs"></i>
              编辑
            </button>
            <button
              @click="deleteLife(life.id)"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2 hover:scale-105"
            >
              <i class="fa-solid fa-trash text-xs"></i>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="lifePosts.length === 0"
      title="暂无生活动态"
      description="还没有发布任何生活动态，点击下方按钮分享你的生活点滴吧！"
      icon="fa-solid fa-heart"
      action-text="添加动态"
      action-icon="fa-solid fa-plus"
      :action-handler="() => { showModal = true; editingLife = null; resetForm(); }"
    />

    <!-- 模态框 -->
    <Modal
      v-model="showModal"
      :title="editingLife ? '编辑生活动态' : '添加生活动态'"
      :loading="loading"
    >
      <form id="modal-form" @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 基本信息 -->
        <div
          :class="[
            'p-5 rounded-xl transition-colors',
            isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200',
          ]"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              :class="[
                'w-9 h-9 rounded-lg flex items-center justify-center',
                isDark ? 'bg-blue-600/20' : 'bg-blue-100',
              ]"
            >
              <i class="fa-solid fa-heart text-blue-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              基本信息
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-heading text-xs mr-1.5"></i>
                标题 <span class="text-red-500">*</span>
              </label>
              <input v-model="form.title" type="text" required :class="inputClass" placeholder="请输入动态标题" />
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-align-left text-xs mr-1.5"></i>
                内容 <span class="text-red-500">*</span>
              </label>
              <textarea v-model="form.content" rows="6" required :class="inputClass" placeholder="分享你的生活动态..."></textarea>
            </div>
          </div>
        </div>

        <!-- 媒体内容 -->
        <div
          :class="[
            'p-5 rounded-xl transition-colors',
            isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200',
          ]"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              :class="[
                'w-9 h-9 rounded-lg flex items-center justify-center',
                isDark ? 'bg-purple-600/20' : 'bg-purple-100',
              ]"
            >
              <i class="fa-solid fa-images text-purple-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              媒体内容
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <ImageUpload
                v-model="form.coverImage"
                label="封面图"
                icon="fa-solid fa-image"
                :max-size-m-b="5"
              />
            </div>
            <div>
              <ImageUpload
                v-model="form.images"
                label="图片"
                icon="fa-solid fa-photo-film"
                multiple
                :max-count="100"
                :max-size-m-b="5"
              />
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-tag text-xs mr-1.5"></i>
                标签 (每行一个)
              </label>
              <textarea
                v-model="tagsText"
                rows="3"
                placeholder="生活&#10;旅行&#10;摄影"
                :class="inputClass"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 发布设置 -->
        <div
          :class="[
            'p-5 rounded-xl transition-colors',
            isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200',
          ]"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              :class="[
                'w-9 h-9 rounded-lg flex items-center justify-center',
                isDark ? 'bg-green-600/20' : 'bg-green-100',
              ]"
            >
              <i class="fa-solid fa-paper-plane text-green-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              发布设置
            </h4>
          </div>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.published"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span :class="labelClass">立即发布</span>
            </label>
          </div>
        </div>

        <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p class="text-sm text-red-500">{{ error }}</p>
        </div>
      </form>
      </Modal>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="确认删除"
      description="确定要删除这个生活动态吗？此操作不可恢复。"
      confirm-text="删除"
      type="danger"
      @confirm="handleDeleteConfirm"
    />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { useToast } from '@/composables/useToast';
import { lifeApi } from '@/services/api';
import { logger } from '@/utils/logger';
import Modal from '@/components/Admin/Modal.vue';
import ImageUpload from '@/components/Admin/ImageUpload.vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/Admin/ConfirmDialog.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import type { Life } from '@/types';

const { isDark } = useTheme();

const lifePosts = ref<Life[]>([]);
const showModal = ref(false);
const editingLife = ref<Life | null>(null);
const loading = ref(false);
const initialLoading = ref(true);
const error = ref<string | null>(null);
const showConfirmDialog = ref(false);
const deletingLifeId = ref<number | null>(null);
const toast = useToast();

const form = ref({
  title: '',
  content: '',
  coverImage: '',
  images: [] as string[],
  published: true,
});

const tagsText = ref('');

const inputClass = computed(() => {
  const base = 'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  if (isDark.value) {
    return `${base} bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500`;
  } else {
    return `${base} bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500`;
  }
});

const labelClass = computed(() => [
  'flex items-center text-sm font-medium mb-2 transition-colors',
  isDark.value ? 'text-gray-300' : 'text-gray-700',
]);

const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    coverImage: '',
    images: [],
    published: true,
  };
  tagsText.value = '';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const loadLifePosts = async () => {
  try {
    initialLoading.value = true;
    const response = await lifeApi.getLifePosts({ limit: 100 });
    lifePosts.value = response.data;
  } catch (err: any) {
    logger.error('加载生活动态失败:', err);
    toast.error('加载生活动态失败');
  } finally {
    initialLoading.value = false;
  }
};

const editLife = (life: Life) => {
  editingLife.value = life;
  form.value = {
    title: life.title,
    content: life.content,
    coverImage: life.coverImage || '',
    images: life.images || [],
    published: life.published,
  };
  tagsText.value = life.tags?.join('\n') || '';
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    const submitData: any = {
      ...form.value,
      images: form.value.images || [],
      tags: tagsText.value
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t),
    };

    if (editingLife.value) {
      await lifeApi.updateLifePost(editingLife.value.id, submitData);
      toast.success('生活动态更新成功！');
    } else {
      await lifeApi.createLifePost(submitData);
      toast.success('生活动态创建成功！');
    }

    showModal.value = false;
    resetForm();
    editingLife.value = null;
    await loadLifePosts();
  } catch (err: any) {
    error.value = err.message || '保存失败';
    toast.error(err.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

const deleteLife = (id: number) => {
  deletingLifeId.value = id;
  showConfirmDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!deletingLifeId.value) return;

  try {
    loading.value = true;
    await lifeApi.deleteLifePost(deletingLifeId.value);
    toast.success('生活动态删除成功！');
    await loadLifePosts();
  } catch (err: any) {
    toast.error(err.message || '删除失败');
  } finally {
    loading.value = false;
    deletingLifeId.value = null;
  }
};

onMounted(() => {
  loadLifePosts();
});
</script>
