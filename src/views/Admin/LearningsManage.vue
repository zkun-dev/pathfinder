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
        学习记录管理
      </h2>
      <button
        v-if="learnings.length > 0"
        @click="showModal = true; editingLearning = null; resetForm()"
        class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        添加记录
      </button>
    </div>

    <!-- 学习记录列表 - 卡片网格布局 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="learning in learnings"
        :key="learning.id"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300',
          'border hover:shadow-lg hover:-translate-y-1',
          learning.status === '已完成'
            ? isDark
              ? 'bg-gradient-to-br from-green-900/30 via-gray-800 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-green-50 via-white to-white border-gray-200 hover:border-blue-300'
            : isDark
              ? 'bg-gradient-to-br from-blue-900/30 via-gray-800 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-blue-50 via-white to-white border-gray-200 hover:border-blue-300',
        ]"
      >
        <!-- 状态角标 -->
        <div
          class="absolute top-0 right-0 z-20"
        >
          <div
            :class="[
              'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
              learning.status === '已完成' || (learning.startDate && learning.endDate && calculateProgress(learning.startDate, learning.endDate) >= 100)
                ? isDark
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white'
                : isDark
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-500 text-white',
            ]"
          >
            <i
              :class="[
                'mr-1.5',
                learning.status === '已完成' || (learning.startDate && learning.endDate && calculateProgress(learning.startDate, learning.endDate) >= 100)
                  ? 'fa-solid fa-check-circle'
                  : 'fa-solid fa-clock',
              ]"
            ></i>
            {{ learning.status === '已完成' || (learning.startDate && learning.endDate && calculateProgress(learning.startDate, learning.endDate) >= 100) ? '已完成' : (learning.status || '进行中') }}
          </div>
        </div>

        <div class="p-6 relative z-10 pt-8">
          <!-- 状态图标和标题 -->
          <div class="flex items-start gap-4 mb-4">
            <div
              :class="[
                'flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg',
                learning.status === '已完成'
                  ? isDark
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : isDark
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600',
              ]"
            >
              <i
                :class="[
                  'text-2xl text-white',
                  learning.status === '已完成' ? 'fa-solid fa-check-circle' : 'fa-solid fa-book-open',
                ]"
              ></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'text-lg font-bold mb-2 transition-colors line-clamp-2',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ learning.title }}
              </h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  v-if="learning.category"
                  :class="[
                    'px-2.5 py-1 text-xs font-medium rounded-full',
                    isDark
                      ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 border border-gray-200',
                  ]"
                >
                  <i class="fa-solid fa-folder text-xs mr-1"></i>
                  {{ learning.category }}
                </span>
              </div>
            </div>
          </div>

          <!-- 进度指示器 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span
                :class="[
                  'text-xs font-semibold',
                  learning.status === '已完成'
                    ? isDark
                      ? 'text-green-400'
                      : 'text-green-600'
                    : isDark
                      ? 'text-blue-400'
                      : 'text-blue-600',
                ]"
              >
                {{ learning.status || '进行中' }}
              </span>
              <span
                v-if="learning.startDate && learning.endDate"
                class="text-xs"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ calculateProgress(learning.startDate, learning.endDate) }}%
              </span>
            </div>
            <div
              :class="[
                'h-2 rounded-full overflow-hidden',
                isDark ? 'bg-gray-700' : 'bg-gray-200',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  learning.status === '已完成'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500',
                ]"
                :style="{
                  width: learning.status === '已完成' ? '100%' : learning.startDate && learning.endDate ? `${calculateProgress(learning.startDate, learning.endDate)}%` : '50%',
                }"
              ></div>
            </div>
          </div>

          <!-- 描述 -->
          <p
            v-if="learning.description"
            :class="[
              'text-sm mb-4 line-clamp-3 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ learning.description }}
          </p>

          <!-- 标签云 -->
          <div v-if="learning.tags && learning.tags.length > 0" class="mb-4">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tag, index) in learning.tags.slice(0, 4)"
                :key="index"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md font-medium',
                  isDark
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border border-purple-200',
                ]"
              >
                #{{ tag }}
              </span>
              <span
                v-if="learning.tags.length > 4"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                +{{ learning.tags.length - 4 }}
              </span>
            </div>
          </div>

          <!-- 日期信息 -->
          <div
            v-if="learning.startDate || learning.endDate"
            class="flex items-center justify-between gap-3 text-xs mb-4"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-days"></i>
              <span v-if="learning.startDate && learning.endDate">
                {{ formatDate(learning.startDate) }} - {{ formatDate(learning.endDate) }}
              </span>
              <span v-else-if="learning.startDate">
                开始: {{ formatDate(learning.startDate) }}
              </span>
              <span v-else-if="learning.endDate">
                结束: {{ formatDate(learning.endDate) }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="editLearning(learning)"
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
              @click="deleteLearning(learning.id)"
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
      v-if="learnings.length === 0"
      title="暂无学习记录"
      description="还没有添加任何学习记录，点击下方按钮记录你的学习历程吧！"
      icon="fa-solid fa-book-open"
      action-text="添加记录"
      action-icon="fa-solid fa-plus"
      :action-handler="() => { showModal = true; editingLearning = null; resetForm(); }"
    />

    <!-- 模态框 -->
    <Modal
      v-model="showModal"
      :title="editingLearning ? '编辑学习记录' : '添加学习记录'"
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
              <i class="fa-solid fa-book text-blue-500 text-sm"></i>
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
              <input v-model="form.title" type="text" required :class="inputClass" placeholder="请输入学习主题" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-tags text-xs mr-1.5"></i>
                  分类
                </label>
                <input v-model="form.category" type="text" :class="inputClass" placeholder="前端/后端/全栈" />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-circle-check text-xs mr-1.5"></i>
                  状态
                </label>
                <div class="relative group">
                  <select
                    v-model="form.status"
                    :class="[
                      inputClass,
                      'pr-12 appearance-none cursor-pointer',
                    ]"
                    :style="!form.status ? (isDark ? { color: '#9ca3af' } : { color: '#9ca3af' }) : {}"
                  >
                    <option value="" disabled hidden>请选择状态</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                  <!-- 下拉箭头 -->
                  <div
                    :class="[
                      'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-0',
                      'flex items-center justify-center w-5 h-5 rounded-md',
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    ]"
                  >
                    <i class="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                  <!-- 清空按钮 -->
                  <button
                    v-if="form.status"
                    @click.stop="form.status = ''"
                    type="button"
                    :class="[
                      'absolute right-10 top-1/2 -translate-y-1/2 z-10',
                      'w-6 h-6 flex items-center justify-center rounded-lg',
                      'transition-all duration-200',
                      isDark 
                        ? 'text-gray-500 hover:text-white hover:bg-gray-700/80 active:scale-95' 
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-95'
                    ]"
                  >
                    <i class="fa-solid fa-times text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-align-left text-xs mr-1.5"></i>
                描述
              </label>
              <textarea v-model="form.description" rows="3" :class="inputClass" placeholder="简要描述学习内容..."></textarea>
            </div>
          </div>
        </div>

        <!-- 学习内容 -->
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
              <i class="fa-solid fa-file-lines text-purple-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              学习内容
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-file-code text-xs mr-1.5"></i>
                详细内容 (Markdown)
              </label>
              <textarea v-model="form.content" rows="6" :class="inputClass" placeholder="支持Markdown格式..."></textarea>
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-tag text-xs mr-1.5"></i>
                标签 (每行一个)
              </label>
              <textarea
                v-model="tagsText"
                rows="3"
                placeholder="前端&#10;Vue&#10;TypeScript"
                :class="inputClass"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 学习资源 -->
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
              <i class="fa-solid fa-book-open text-green-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              学习资源
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-code text-xs mr-1.5"></i>
                学习资源 (JSON格式)
              </label>
              <textarea
                v-model="resourcesText"
                rows="4"
                placeholder='[{"type": "书籍", "name": "Vue.js设计与实现", "url": ""}, {"type": "视频", "name": "Vue3教程", "url": "https://example.com"}]'
                :class="inputClass"
                class="font-mono text-sm"
              ></textarea>
              <p
                :class="[
                  'text-xs mt-1.5 flex items-start gap-1.5 transition-colors',
                  isDark ? 'text-gray-500' : 'text-gray-400',
                ]"
              >
                <i class="fa-solid fa-circle-info text-xs mt-0.5"></i>
                请输入有效的JSON数组格式
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-calendar-start text-xs mr-1.5"></i>
                  开始日期
                </label>
                <input v-model="form.startDate" type="date" :class="inputClass" />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-calendar-check text-xs mr-1.5"></i>
                  结束日期
                </label>
                <input v-model="form.endDate" type="date" :class="inputClass" />
              </div>
            </div>
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
      description="确定要删除这个学习记录吗？此操作不可恢复。"
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
import { learningApi } from '@/services/api';
import { logger } from '@/utils/logger';
import Modal from '@/components/Admin/Modal.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/Admin/ConfirmDialog.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import type { Learning } from '@/types';

const { isDark } = useTheme();

const learnings = ref<Learning[]>([]);
const showModal = ref(false);
const editingLearning = ref<Learning | null>(null);
const loading = ref(false);
const initialLoading = ref(true);
const error = ref<string | null>(null);
const showConfirmDialog = ref(false);
const deletingLearningId = ref<number | null>(null);
const toast = useToast();

const form = ref({
  title: '',
  category: '',
  description: '',
  content: '',
  status: '进行中',
  startDate: '',
  endDate: '',
});

const tagsText = ref('');
const resourcesText = ref('');

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

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const calculateProgress = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
};

const resetForm = () => {
  form.value = {
    title: '',
    category: '',
    description: '',
    content: '',
    status: '进行中',
    startDate: '',
    endDate: '',
  };
  tagsText.value = '';
  resourcesText.value = '';
};

const loadLearnings = async () => {
  try {
    initialLoading.value = true;
    learnings.value = await learningApi.getLearnings();
  } catch (err: any) {
    logger.error('加载学习记录失败:', err);
    toast.error('加载学习记录失败');
  } finally {
    initialLoading.value = false;
  }
};

const editLearning = (learning: Learning) => {
  editingLearning.value = learning;
  form.value = {
    title: learning.title,
    category: learning.category || '',
    description: learning.description || '',
    content: learning.content || '',
    status: learning.status || '进行中',
    startDate: learning.startDate ? new Date(learning.startDate).toISOString().split('T')[0] : '',
    endDate: learning.endDate ? new Date(learning.endDate).toISOString().split('T')[0] : '',
  };
  tagsText.value = learning.tags?.join('\n') || '';
  resourcesText.value = learning.resources ? JSON.stringify(learning.resources, null, 2) : '';
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    const submitData: any = {
      ...form.value,
      tags: tagsText.value
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t),
      startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
    };

    // 处理学习资源
    if (resourcesText.value.trim()) {
      try {
        submitData.resources = JSON.parse(resourcesText.value);
      } catch (e) {
        error.value = '学习资源JSON格式错误';
        return;
      }
    } else {
      submitData.resources = null;
    }

    if (editingLearning.value) {
      await learningApi.updateLearning(editingLearning.value.id, submitData);
      toast.success('学习记录更新成功！');
    } else {
      await learningApi.createLearning(submitData);
      toast.success('学习记录创建成功！');
    }

    showModal.value = false;
    resetForm();
    editingLearning.value = null;
    await loadLearnings();
  } catch (err: any) {
    error.value = err.message || '保存失败';
    toast.error(err.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

const deleteLearning = (id: number) => {
  deletingLearningId.value = id;
  showConfirmDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!deletingLearningId.value) return;

  try {
    loading.value = true;
    await learningApi.deleteLearning(deletingLearningId.value);
    toast.success('学习记录删除成功！');
    await loadLearnings();
  } catch (err: any) {
    toast.error(err.message || '删除失败');
  } finally {
    loading.value = false;
    deletingLearningId.value = null;
  }
};

onMounted(() => {
  loadLearnings();
});
</script>
