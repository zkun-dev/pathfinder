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
        技能管理
      </h2>
      <button
        v-if="skills.length > 0"
        @click="showModal = true; editingSkill = null; resetForm()"
        class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        添加技能
      </button>
    </div>

    <!-- 技能列表 - 技能卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div
        v-for="skill in skills"
        :key="skill.id"
        :class="[
          'group relative overflow-hidden rounded-2xl transition-all duration-300',
          'border hover:shadow-lg hover:-translate-y-1',
          isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800 border-gray-700 hover:border-blue-500'
            : 'bg-gradient-to-br from-white via-gray-50/50 to-white border-gray-200 hover:border-blue-300',
        ]"
      >
        <!-- 顶部装饰条 -->
        <div
          :class="[
            'absolute top-0 left-0 right-0 h-1',
            isDark ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500' : 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400',
          ]"
        ></div>

        <div class="p-6 pt-7">
          <!-- 技能图标和名称 -->
          <div class="flex flex-col items-center text-center mb-4">
            <div
              :class="[
                'w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-6',
                getIconBgClass(skill),
              ]"
            >
              <i
                :class="[
                  getSkillIconConfig(skill).icon,
                  'text-4xl transition-all duration-300',
                  getSkillIconConfig(skill).color || (isDark ? 'text-blue-400' : 'text-blue-600'),
                ]"
              ></i>
            </div>
            <h3
              :class="[
                'text-lg font-bold mb-1 transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ skill.name }}
            </h3>
            <span
              v-if="skill.category"
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-full',
                isDark
                  ? 'bg-gray-700/60 text-gray-300 border border-gray-600'
                  : 'bg-gray-100 text-gray-700 border border-gray-200',
              ]"
            >
              {{ skill.category }}
            </span>
          </div>

          <!-- 熟练度显示 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                熟练度
              </span>
              <span
                :class="[
                  'text-sm font-bold',
                  isDark ? 'text-blue-400' : 'text-blue-600',
                ]"
              >
                {{ skill.proficiency || 0 }}/5
              </span>
            </div>
            <!-- 进度条 -->
            <div
              :class="[
                'h-2.5 rounded-full overflow-hidden',
                isDark ? 'bg-gray-700' : 'bg-gray-200',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400',
                ]"
                :style="{ width: `${((skill.proficiency || 0) / 5) * 100}%` }"
              ></div>
            </div>
            <!-- 星级显示 -->
            <div class="flex items-center justify-center gap-0.5 mt-2">
              <span
                v-for="i in 5"
                :key="i"
                :class="[
                  'text-sm transition-all',
                  i <= (skill.proficiency || 0)
                    ? isDark
                      ? 'text-blue-400'
                      : 'text-blue-500'
                    : isDark
                      ? 'text-gray-600'
                      : 'text-gray-300',
                ]"
              >
                ★
              </span>
            </div>
          </div>

          <!-- 描述 -->
          <p
            v-if="skill.description"
            :class="[
              'text-xs mb-4 line-clamp-2 text-center transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ skill.description }}
          </p>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-center gap-2 pt-4 border-t" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
            <button
              @click="editSkill(skill)"
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
              @click="deleteSkill(skill.id)"
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
      v-if="skills.length === 0"
      title="暂无技能"
      description="还没有添加任何技能，点击下方按钮展示你的技能吧！"
      icon="fa-solid fa-code"
      action-text="添加技能"
      action-icon="fa-solid fa-plus"
      :action-handler="() => { showModal = true; editingSkill = null; resetForm(); }"
    />

    <!-- 模态框 -->
    <Modal
      v-model="showModal"
      :title="editingSkill ? '编辑技能' : '添加技能'"
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
              <i class="fa-solid fa-code text-blue-500 text-sm"></i>
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
                <i class="fa-solid fa-tag text-xs mr-1.5"></i>
                名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                :class="inputClass"
                placeholder="请输入技能名称"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-folder text-xs mr-1.5"></i>
                  分类
                </label>
                <input
                  v-model="form.category"
                  type="text"
                  :class="inputClass"
                  placeholder="前端/后端/工具"
                />
              </div>
              <div>
                <label :class="labelClass">
                  <i class="fa-solid fa-chart-line text-xs mr-1.5"></i>
                  熟练度 (1-5)
                </label>
                <input
                  v-model.number="form.proficiency"
                  type="number"
                  min="1"
                  max="5"
                  :class="inputClass"
                  placeholder="1-5"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
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
              <i class="fa-solid fa-info-circle text-purple-500 text-sm"></i>
            </div>
            <h4
              :class="[
                'text-base font-semibold transition-colors',
                isDark ? 'text-white' : 'text-gray-900',
              ]"
            >
              详细信息
            </h4>
          </div>
          <div class="space-y-4">
            <div>
              <label :class="labelClass">
                <i class="fa-solid fa-icons text-xs mr-1.5"></i>
                图标类名
              </label>
              <input
                v-model="form.icon"
                type="text"
                placeholder="fa-solid fa-code"
                :class="inputClass"
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
                placeholder="描述技能特点..."
              ></textarea>
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
      description="确定要删除这个技能吗？此操作不可恢复。"
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
import { skillApi } from '@/services/api';
import { logger } from '@/utils/logger';
import { getSkillIcon } from '@/utils/skillIcons';
import Modal from '@/components/Admin/Modal.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmDialog from '@/components/Admin/ConfirmDialog.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import type { Skill } from '@/types';

const { isDark } = useTheme();

const skills = ref<Skill[]>([]);
const showModal = ref(false);
const editingSkill = ref<Skill | null>(null);
const loading = ref(false);
const initialLoading = ref(true);
const error = ref<string | null>(null);
const showConfirmDialog = ref(false);
const deletingSkillId = ref<number | null>(null);
const toast = useToast();

const form = ref({
  name: '',
  category: '',
  proficiency: 3,
  icon: '',
  description: '',
  sortOrder: 0,
});

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

const getSkillIconConfig = (skill: Skill) => {
  return getSkillIcon(skill.name, skill.icon);
};

const getIconBgClass = (skill: Skill) => {
  const config = getSkillIconConfig(skill);
  const baseClasses = 'bg-gradient-to-br border-2';
  
  if (isDark.value) {
    if (config.bgGradientDark) {
      // 使用完整的类名字符串
      return `${baseClasses} ${config.bgGradientDark} border-gray-700/50 hover:border-gray-600`;
    }
    return `${baseClasses} from-gray-800/80 to-gray-900/80 border-gray-700/50 hover:border-gray-600`;
  } else {
    if (config.bgGradient) {
      // 使用完整的类名字符串
      return `${baseClasses} ${config.bgGradient} border-gray-200/50 hover:border-gray-300`;
    }
    return `${baseClasses} from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300`;
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    category: '',
    proficiency: 3,
    icon: '',
    description: '',
    sortOrder: 0,
  };
};

const loadSkills = async () => {
  try {
    initialLoading.value = true;
    skills.value = await skillApi.getSkills();
  } catch (err: any) {
    logger.error('加载技能列表失败:', err);
    toast.error('加载技能列表失败');
  } finally {
    initialLoading.value = false;
  }
};

const editSkill = (skill: Skill) => {
  editingSkill.value = skill;
  form.value = {
    name: skill.name,
    category: skill.category || '',
    proficiency: skill.proficiency || 3,
    icon: skill.icon || '',
    description: skill.description || '',
    sortOrder: skill.sortOrder,
  };
  showModal.value = true;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (editingSkill.value) {
      await skillApi.updateSkill(editingSkill.value.id, form.value);
      toast.success('技能更新成功！');
    } else {
      await skillApi.createSkill(form.value);
      toast.success('技能创建成功！');
    }

    showModal.value = false;
    resetForm();
    editingSkill.value = null;
    await loadSkills();
  } catch (err: any) {
    error.value = err.message || '保存失败';
    toast.error(err.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

const deleteSkill = (id: number) => {
  deletingSkillId.value = id;
  showConfirmDialog.value = true;
};

const handleDeleteConfirm = async () => {
  if (!deletingSkillId.value) return;

  try {
    loading.value = true;
    await skillApi.deleteSkill(deletingSkillId.value);
    toast.success('技能删除成功！');
    await loadSkills();
  } catch (err: any) {
    toast.error(err.message || '删除失败');
  } finally {
    loading.value = false;
    deletingSkillId.value = null;
  }
};

onMounted(() => {
  loadSkills();
});
</script>
