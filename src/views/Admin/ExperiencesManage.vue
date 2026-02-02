<template>
  <div class="h-[calc(100vh-7rem)]">
    <LoadingSpinner v-if="initialLoading" size="md"/>
    <template v-else>
    <div class="flex justify-between items-center mb-6">
      <h2
        :class="[
          'text-2xl font-bold transition-colors',
          isDark ? 'text-white' : 'text-gray-900',
        ]"
      >
        工作经历管理
      </h2>
      <button
        v-if="experiences.length > 0"
        @click="showModal = true; editingExperience = null; resetForm()"
        class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        添加经历
      </button>
    </div>

    <!-- 经历列表 - 时间线布局 -->
    <div class="relative">
      <!-- 时间轴线 -->
      <div
        :class="[
          'absolute left-8 top-0 bottom-0 w-0.5 hidden lg:block',
          isDark ? 'bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500' : 'bg-gradient-to-b from-blue-400 via-purple-400 to-blue-400',
        ]"
      ></div>

      <div class="space-y-8">
        <div
          v-for="(experience, index) in experiences"
          :key="experience.id"
          class="relative"
        >
          <!-- 时间点 -->
          <div class="flex items-start gap-6">
            <!-- 左侧时间轴节点 -->
            <div class="flex-shrink-0 hidden lg:flex flex-col items-center w-16">
              <div
                :class="[
                  'w-4 h-4 rounded-full border-4 flex-shrink-0 z-10',
                  isDark
                    ? 'bg-gray-800 border-blue-500 shadow-lg shadow-blue-500/50'
                    : 'bg-white border-blue-500 shadow-lg shadow-blue-500/30',
                ]"
              >
                <div class="w-full h-full rounded-full bg-blue-500"></div>
              </div>
              <div
                v-if="index < experiences.length - 1"
                class="w-0.5 flex-1 mt-2"
                :class="isDark ? 'bg-gray-700' : 'bg-gray-200'"
              ></div>
            </div>

            <!-- 右侧内容卡片 -->
            <div
              :class="[
                'group flex-1 rounded-2xl transition-all duration-300',
                'border hover:shadow-lg hover:-translate-y-1',
                isDark
                  ? 'bg-gradient-to-r from-gray-800 via-gray-800/95 to-gray-800 border-gray-700 hover:border-blue-500'
                  : 'bg-gradient-to-r from-white via-gray-50/50 to-white border-gray-200 hover:border-blue-300',
              ]"
            >
              <div class="p-6">
                <!-- 时间标签 -->
                <div class="flex items-center justify-between mb-4">
                  <div
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      isDark
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-blue-100 text-blue-700 border border-blue-200',
                    ]"
                  >
                    <i class="fa-solid fa-calendar-days mr-1.5"></i>
                    {{ formatDate(experience.startDate) }} - {{ experience.endDate ? formatDate(experience.endDate) : '至今' }}
                  </div>
                </div>

                <!-- 主要内容区域 -->
                <div class="flex items-start gap-5 mb-4">
                  <!-- 公司Logo -->
                  <div
                    v-if="experience.companyLogo"
                    class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-md"
                    :class="isDark ? 'border-gray-600' : 'border-gray-200'"
                  >
                    <ImageWithPlaceholder
                      :src="experience.companyLogo"
                      :alt="experience.companyName"
                      container-class="w-full h-full"
                      image-class="w-full h-full object-cover"
                      placeholder-class="w-full h-full"
                      placeholder-icon-class="text-xl"
                    />
                  </div>
                  <div
                    v-else
                    :class="[
                      'flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-md',
                      isDark
                        ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30'
                        : 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200',
                    ]"
                  >
                    <i class="fa-solid fa-building text-3xl" :class="isDark ? 'text-blue-400' : 'text-blue-600'"></i>
                  </div>

                  <!-- 职位和公司信息 -->
                  <div class="flex-1 min-w-0">
                    <h3
                      :class="[
                        'text-xl font-bold mb-2 transition-colors',
                        isDark ? 'text-white' : 'text-gray-900',
                      ]"
                    >
                      {{ experience.position }}
                    </h3>
                    <p
                      :class="[
                        'text-base font-semibold mb-3 transition-colors',
                        isDark ? 'text-blue-400' : 'text-blue-600',
                      ]"
                    >
                      <i class="fa-solid fa-building mr-2"></i>
                      {{ experience.companyName }}
                    </p>
                    <p
                      v-if="experience.description"
                      :class="[
                        'text-sm mb-4 line-clamp-2 transition-colors',
                        isDark ? 'text-gray-300' : 'text-gray-600',
                      ]"
                    >
                      {{ experience.description }}
                    </p>
                  </div>
                </div>

                <!-- 技术栈 -->
                <div v-if="experience.techStack && experience.techStack.length > 0" class="mb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid fa-code text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'"></i>
                    <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">技术栈</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tech, techIndex) in experience.techStack.slice(0, 6)"
                      :key="techIndex"
                      :class="[
                        'px-3 py-1.5 text-xs font-medium rounded-lg',
                        isDark
                          ? 'bg-gray-700/60 text-gray-200 border border-gray-600'
                          : 'bg-gray-100 text-gray-700 border border-gray-200',
                      ]"
                    >
                      {{ tech }}
                    </span>
                    <span
                      v-if="experience.techStack.length > 6"
                      :class="[
                        'px-3 py-1.5 text-xs font-medium rounded-lg',
                        isDark ? 'text-gray-400' : 'text-gray-500',
                      ]"
                    >
                      +{{ experience.techStack.length - 6 }}
                    </span>
                  </div>
                </div>

                <!-- 成就 -->
                <div v-if="experience.achievements && experience.achievements.length > 0" class="mb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid fa-trophy text-xs" :class="isDark ? 'text-yellow-400' : 'text-yellow-600'"></i>
                    <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">主要成就</span>
                  </div>
                  <ul class="space-y-1.5">
                    <li
                      v-for="(achievement, achIndex) in experience.achievements.slice(0, 3)"
                      :key="achIndex"
                      class="flex items-start gap-2 text-sm"
                      :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                    >
                      <i class="fa-solid fa-check-circle text-xs mt-1" :class="isDark ? 'text-green-400' : 'text-green-600'"></i>
                      <span>{{ achievement }}</span>
                    </li>
                  </ul>
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center justify-end gap-2 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
                  <button
                    @click="editExperience(experience)"
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
                    @click="deleteExperience(experience.id)"
                    class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <i class="fa-solid fa-trash text-xs"></i>
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="experiences.length === 0"
      title="暂无工作经历"
      description="还没有添加任何工作经历，点击下方按钮记录你的职业历程吧！"
      icon="fa-solid fa-briefcase"
      action-text="添加经历"
      action-icon="fa-solid fa-plus"
      :action-handler="() => { showModal = true; editingExperience = null; resetForm(); }"
    />

    <!-- 模态框 -->
    <Modal
      v-model="showModal"
      :title="editingExperience ? '编辑工作经历' : '添加工作经历'"
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
              <i class="fa-solid fa-briefcase text-blue-500 text-sm"></i>
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
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-building text-xs mr-1.5"></i>
                  公司名称 <span class="text-red-500">*</span>
                </label>
                <input v-model="form.companyName" type="text" required :class="inputClass" placeholder="请输入公司名称" />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-user-tie text-xs mr-1.5"></i>
                  职位 <span class="text-red-500">*</span>
                </label>
                <input v-model="form.position" type="text" required :class="inputClass" placeholder="请输入职位" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-calendar-start text-xs mr-1.5"></i>
                  开始时间 <span class="text-red-500">*</span>
                </label>
                <input v-model="form.startDate" type="date" required :class="inputClass" />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-calendar-check text-xs mr-1.5"></i>
                  结束时间
                </label>
                <input v-model="form.endDate" type="date" :class="inputClass" />
              </div>
            </div>
            <div>
              <ImageUpload
                v-model="form.companyLogo"
                label="公司Logo"
                icon="fa-solid fa-image"
                :max-size-m-b="5"
              />
            </div>
          </div>
        </div>

        <!-- 工作内容 -->
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
              工作内容
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-align-left text-xs mr-1.5"></i>
                描述
              </label>
              <textarea v-model="form.description" rows="3" :class="inputClass" placeholder="简要描述工作内容..."></textarea>
            </div>
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-file-code text-xs mr-1.5"></i>
                详细内容 (Markdown)
              </label>
              <textarea v-model="form.content" rows="6" :class="inputClass" placeholder="支持Markdown格式..."></textarea>
            </div>
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
                <i class="fa-solid fa-trophy text-xs mr-1.5"></i>
                成就 (每行一个)
              </label>
              <textarea
                v-model="achievementsText"
                rows="4"
                placeholder="完成项目重构&#10;提升性能30%"
                :class="inputClass"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 其他设置 -->
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
              <i class="fa-solid fa-sliders text-green-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              其他设置
            </h4>
          </div>
          <div>
            <label :class="labelClass">
              <i class="fa-solid fa-sort text-xs mr-1.5"></i>
              排序
            </label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              :class="inputClass"
              placeholder="数字越小越靠前"
            />
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
      description="确定要删除这个工作经历吗？此操作不可恢复。"
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
import { experienceApi } from '@/services/api';
import { logger } from '@/utils/logger';
import Modal from '@/components/Admin/Modal.vue';
import ImageUpload from '@/components/Admin/ImageUpload.vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/Admin/ConfirmDialog.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import type { Experience } from '@/types';

const { isDark } = useTheme();

const experiences = ref<Experience[]>([]);
const showModal = ref(false);
const editingExperience = ref<Experience | null>(null);
const loading = ref(false);
const initialLoading = ref(true);
const error = ref<string | null>(null);
const showConfirmDialog = ref(false);
const deletingExperienceId = ref<number | null>(null);
const toast = useToast();

const form = ref({
  companyName: '',
  companyLogo: '',
  position: '',
  startDate: '',
  endDate: '',
  description: '',
  content: '',
  sortOrder: 0,
});

const techStackText = ref('');
const achievementsText = ref('');

const inputClass = computed(() => {
  const base = 'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  if (isDark.value) {
    return `${base} bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500`;
  } else {
    return `${base} bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500`;
  }
});

const labelClass = computed(() => [
  'block text-sm font-medium mb-2 transition-colors',
  isDark.value ? 'text-gray-300' : 'text-gray-700',
]);

const resetForm = () => {
  form.value = {
    companyName: '',
    companyLogo: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    content: '',
    sortOrder: 0,
  };
  techStackText.value = '';
  achievementsText.value = '';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const loadExperiences = async () => {
  try {
    initialLoading.value = true;
    experiences.value = await experienceApi.getExperiences();
  } catch (err: any) {
    logger.error('加载工作经历失败:', err);
    toast.error('加载工作经历失败');
  } finally {
    initialLoading.value = false;
  }
};

const editExperience = (experience: Experience) => {
  editingExperience.value = experience;
  form.value = {
    companyName: experience.companyName,
    companyLogo: experience.companyLogo || '',
    position: experience.position,
    startDate: experience.startDate.split('T')[0],
    endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
    description: experience.description || '',
    content: experience.content || '',
    sortOrder: experience.sortOrder || 0,
  };
  techStackText.value = experience.techStack?.join('\n') || '';
  achievementsText.value = experience.achievements?.join('\n') || '';
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    const submitData: any = {
      ...form.value,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
      techStack: techStackText.value
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t),
      achievements: achievementsText.value
        .split('\n')
        .map((a) => a.trim())
        .filter((a) => a),
    };

    if (editingExperience.value) {
      await experienceApi.updateExperience(editingExperience.value.id, submitData);
      toast.success('工作经历更新成功！');
    } else {
      await experienceApi.createExperience(submitData);
      toast.success('工作经历创建成功！');
    }

    showModal.value = false;
    resetForm();
    editingExperience.value = null;
    await loadExperiences();
  } catch (err: any) {
    error.value = err.message || '保存失败';
    toast.error(err.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

const deleteExperience = (id: number) => {
  deletingExperienceId.value = id;
  showConfirmDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!deletingExperienceId.value) return;

  try {
    loading.value = true;
    await experienceApi.deleteExperience(deletingExperienceId.value);
    toast.success('工作经历删除成功！');
    await loadExperiences();
  } catch (err: any) {
    toast.error(err.message || '删除失败');
  } finally {
    loading.value = false;
    deletingExperienceId.value = null;
  }
};

onMounted(() => {
  loadExperiences();
});
</script>
