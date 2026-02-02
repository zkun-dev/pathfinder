<template>
  <div class="h-[calc(100vh-7rem)]">
    <LoadingSpinner v-if="initialLoading" size="md" />
    <template v-else>
    <div class="flex justify-between items-center mb-6">
      <h2
        :class="[
          'text-2xl font-bold transition-colors',
          isDark ? 'text-white' : 'text-gray-900',
        ]"
      >
        项目管理
      </h2>
      <button
        v-if="projects.length > 0"
        @click="showModal = true; editingProject = null; resetForm()"
        class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        添加项目
      </button>
    </div>

    <!-- 项目列表 - 项目卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300',
          'border hover:shadow-lg hover:-translate-y-1',
          project.featured
            ? isDark
              ? 'bg-gradient-to-br from-purple-900/20 via-gray-800 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-purple-50 via-white to-white border-gray-200 hover:border-blue-300'
            : isDark
              ? 'bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border-gray-700 hover:border-blue-500'
              : 'bg-gradient-to-br from-white via-gray-50/50 to-white border-gray-200 hover:border-blue-300',
        ]"
      >
        <!-- 精选标签 -->
        <div
          v-if="project.featured"
          class="absolute top-0 right-0 z-20"
        >
          <div
            :class="[
              'px-4 py-2 rounded-bl-2xl rounded-tr-2xl text-xs font-bold shadow-xl',
              isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white',
            ]"
          >
            <i class="fa-solid fa-star mr-1.5"></i>
            精选
          </div>
        </div>

        <!-- 封面图 -->
        <div
          v-if="project.coverImage"
          class="relative h-48 overflow-hidden"
        >
          <ImageWithPlaceholder
            :src="project.coverImage"
            :alt="project.title"
            container-class="w-full h-full"
            image-class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            placeholder-class="w-full h-full"
            placeholder-icon-class="text-2xl"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div
          v-else
          :class="[
            'relative h-48 flex items-center justify-center',
            isDark ? 'bg-gradient-to-br from-indigo-900/30 to-gray-800' : 'bg-gradient-to-br from-indigo-100 to-gray-200',
          ]"
        >
          <i
            :class="[
              'text-6xl opacity-20',
              isDark ? 'text-gray-500' : 'text-gray-400',
            ]"
          >
            <i class="fa-solid fa-folder-open"></i>
          </i>
        </div>

        <div class="p-6 pt-8">
          <!-- 标题和类型 -->
          <div class="mb-3">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <h3
                :class="[
                  'text-xl font-bold transition-colors line-clamp-2',
                  isDark ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ project.title }}
              </h3>
              <span
                v-if="project.type"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-full',
                  isDark
                    ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 border border-gray-200',
                ]"
              >
                <i class="fa-solid fa-tag text-xs mr-1"></i>
                {{ project.type }}
              </span>
            </div>
          </div>

          <!-- 描述 -->
          <p
            v-if="project.description"
            :class="[
              'text-sm mb-4 line-clamp-2 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ project.description }}
          </p>

          <!-- 技术栈 -->
          <div v-if="project.techStack && project.techStack.length > 0" class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <i class="fa-solid fa-code text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'"></i>
              <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">技术栈</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tech, index) in project.techStack.slice(0, 5)"
                :key="index"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md font-medium',
                  isDark
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
                ]"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.techStack.length > 5"
                :class="[
                  'px-2 py-0.5 text-xs rounded-md',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                +{{ project.techStack.length - 5 }}
              </span>
            </div>
          </div>

          <!-- 日期信息 -->
          <div
            v-if="project.startDate || project.endDate"
            class="flex items-center gap-3 text-xs mb-4"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <span v-if="project.startDate" class="flex items-center gap-1">
              <i class="fa-solid fa-calendar-start"></i>
              {{ formatDate(project.startDate) }}
            </span>
            <span v-if="project.endDate" class="flex items-center gap-1">
              <i class="fa-solid fa-calendar-check"></i>
              {{ formatDate(project.endDate) }}
            </span>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="editProject(project)"
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
              @click="deleteProject(project.id)"
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
      v-if="projects.length === 0"
      title="暂无项目"
      description="还没有添加任何项目，点击下方按钮创建你的第一个项目吧！"
      icon="fa-solid fa-folder-open"
      action-text="添加项目"
      action-icon="fa-solid fa-plus"
      :action-handler="() => { showModal = true; editingProject = null; resetForm(); }"
    />

    <!-- 模态框 -->
    <Modal
      v-model="showModal"
      :title="editingProject ? '编辑项目' : '添加项目'"
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
              <i class="fa-solid fa-folder text-blue-500 text-sm"></i>
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
              <input
                v-model="form.title"
                type="text"
                required
                :class="inputClass"
                placeholder="请输入项目名称"
              />
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-align-left text-xs mr-1.5"></i>
                描述
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                :class="inputClass"
                placeholder="简要描述项目..."
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-tag text-xs mr-1.5"></i>
                  类型
                </label>
                <div class="relative group">
                  <select
                    v-model="form.type"
                    :class="[
                      inputClass,
                      'pr-12 appearance-none cursor-pointer',
                    ]"
                    :style="!form.type ? (isDark ? { color: '#9ca3af' } : { color: '#9ca3af' }) : {}"
                  >
                    <option value="" disabled hidden>请选择类型</option>
                    <option value="工作项目">工作项目</option>
                    <option value="个人项目">个人项目</option>
                    <option value="开源项目">开源项目</option>
                    <option value="学习项目">学习项目</option>
                    <option value="商业项目">商业项目</option>
                    <option value="其他">其他</option>
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
                    v-if="form.type"
                    @click.stop="form.type = ''"
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
                <input
                  v-if="form.type === '其他'"
                  v-model="form.customType"
                  type="text"
                  :class="[inputClass, 'mt-2']"
                  placeholder="请输入自定义类型"
                />
              </div>
              <div>
                <ImageUpload
                  v-model="form.coverImage"
                  label="封面图"
                  icon="fa-solid fa-image"
                  :max-size-m-b="5"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 项目内容 -->
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
              <i class="fa-solid fa-file-code text-purple-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              项目内容
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-code text-xs mr-1.5"></i>
                技术栈 (每行一个)
              </label>
              <textarea
                v-model="techStackText"
                rows="3"
                placeholder="Vue&#10;TypeScript&#10;Node.js"
                :class="inputClass"
              ></textarea>
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-file-lines text-xs mr-1.5"></i>
                详细内容 (Markdown)
              </label>
              <textarea
                v-model="form.content"
                rows="8"
                placeholder="支持Markdown格式..."
                :class="inputClass"
              ></textarea>
            </div>
            <div>
              <ImageUpload
                v-model="form.images"
                label="项目图片"
                icon="fa-solid fa-photo-film"
                multiple
                :max-count="100"
                :max-size-m-b="5"
              />
            </div>
          </div>
        </div>

        <!-- 链接和日期 -->
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
              <i class="fa-solid fa-link text-green-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              链接和日期
            </h4>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-globe text-xs mr-1.5"></i>
                  演示链接
                </label>
                <input
                  v-model="form.links.demo"
                  type="url"
                  :class="inputClass"
                  placeholder="https://demo.example.com"
                />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-brands fa-github text-xs mr-1.5"></i>
                  GitHub链接
                </label>
                <input
                  v-model="form.links.github"
                  type="url"
                  :class="inputClass"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-calendar-start text-xs mr-1.5"></i>
                  开始日期
                </label>
                <input
                  v-model="form.startDate"
                  type="date"
                  :class="inputClass"
                />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-calendar-check text-xs mr-1.5"></i>
                  结束日期
                </label>
                <input
                  v-model="form.endDate"
                  type="date"
                  :class="inputClass"
                />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span :class="labelClass">
                  <i class="fa-solid fa-star text-xs mr-1.5"></i>
                  精选项目
                </span>
              </label>
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
      description="确定要删除这个项目吗？此操作不可恢复。"
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
import { projectApi } from '@/services/api';
import { logger } from '@/utils/logger';
import Modal from '@/components/Admin/Modal.vue';
import ImageUpload from '@/components/Admin/ImageUpload.vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/Admin/ConfirmDialog.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import type { Project } from '@/types';

const { isDark } = useTheme();

const projects = ref<Project[]>([]);
const showModal = ref(false);
const editingProject = ref<Project | null>(null);
const loading = ref(false);
const initialLoading = ref(true);
const error = ref<string | null>(null);
const showConfirmDialog = ref(false);
const deletingProjectId = ref<number | null>(null);
const toast = useToast();

const form = ref({
  title: '',
  description: '',
  content: '',
  coverImage: '',
  images: [] as string[],
  type: '',
  customType: '',
  featured: false,
  startDate: '',
  endDate: '',
  links: {
    demo: '',
    github: '',
  },
});

const techStackText = ref('');

const labelClass = computed(() => [
  'flex items-center text-sm font-medium mb-2 transition-colors',
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

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    content: '',
    coverImage: '',
    images: [],
    type: '',
    customType: '',
    featured: false,
    startDate: '',
    endDate: '',
    links: {
      demo: '',
      github: '',
    },
  };
  techStackText.value = '';
};

const loadProjects = async () => {
  try {
    initialLoading.value = true;
    const response = await projectApi.getProjects({ limit: 100 });
    projects.value = response.data;
  } catch (err: any) {
    logger.error('加载项目列表失败:', err);
    toast.error('加载项目列表失败');
  } finally {
    initialLoading.value = false;
  }
};

const editProject = (project: Project) => {
  editingProject.value = project;
  const type = project.type || '';
  // 检查是否是预设类型
  const presetTypes = ['工作项目', '个人项目', '开源项目', '学习项目', '商业项目'];
  const isPresetType = presetTypes.includes(type);
  
  form.value = {
    title: project.title,
    description: project.description || '',
    content: project.content || '',
    coverImage: project.coverImage || '',
    images: project.images || [],
    type: isPresetType ? type : '其他',
    customType: isPresetType ? '' : type,
    featured: project.featured,
    startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    links: {
      demo: project.links?.demo || '',
      github: project.links?.github || '',
    },
  };
  techStackText.value = project.techStack?.join('\n') || '';
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 处理类型：如果选择了"其他"，使用自定义类型
    const submitData: any = {
      ...form.value,
      type: form.value.type === '其他' ? form.value.customType : form.value.type,
      techStack: techStackText.value
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t),
      images: form.value.images || [],
      startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
    };
    // 删除 customType，不需要提交到后端
    delete submitData.customType;

    if (editingProject.value) {
      await projectApi.updateProject(editingProject.value.id, submitData);
      toast.success('项目更新成功！');
    } else {
      await projectApi.createProject(submitData);
      toast.success('项目创建成功！');
    }

    showModal.value = false;
    resetForm();
    editingProject.value = null;
    await loadProjects();
  } catch (err: any) {
    error.value = err.message || '保存失败';
    toast.error(err.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

const deleteProject = (id: number) => {
  deletingProjectId.value = id;
  showConfirmDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!deletingProjectId.value) return;

  try {
    loading.value = true;
    await projectApi.deleteProject(deletingProjectId.value);
    toast.success('项目删除成功！');
    await loadProjects();
  } catch (err: any) {
    toast.error(err.message || '删除失败');
  } finally {
    loading.value = false;
    deletingProjectId.value = null;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

onMounted(() => {
  loadProjects();
});
</script>
