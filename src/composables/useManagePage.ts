/**
 * 管理页面通用逻辑 Composable
 * 提取管理页面的公共逻辑，减少重复代码
 */

import { ref } from 'vue';
import { useToast } from './useToast';
import { logger } from '@/utils/logger';
import { getErrorMessage } from '@/utils/utils';

export function useManagePage<T extends { id: number }>() {
  const toast = useToast();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const showModal = ref(false);
  const showConfirmDialog = ref(false);
  const deletingId = ref<number | null>(null);

  /**
   * 处理 API 错误
   */
  const handleError = (err: unknown, defaultMessage = '操作失败') => {
    const message = getErrorMessage(err, defaultMessage);
    error.value = message;
    toast.error(message);
    logger.error('操作失败:', err);
  };

  /**
   * 处理成功操作
   */
  const handleSuccess = (message: string) => {
    error.value = null;
    toast.success(message);
  };

  /**
   * 打开添加/编辑模态框
   */
  const openModal = () => {
    error.value = null;
    showModal.value = true;
  };

  /**
   * 关闭模态框
   */
  const closeModal = () => {
    showModal.value = false;
    error.value = null;
  };

  /**
   * 打开删除确认对话框
   */
  const openDeleteDialog = (id: number) => {
    deletingId.value = id;
    showConfirmDialog.value = true;
  };

  /**
   * 关闭删除确认对话框
   */
  const closeDeleteDialog = () => {
    showConfirmDialog.value = false;
    deletingId.value = null;
  };

  /**
   * 执行删除操作
   */
  const executeDelete = async (
    deleteFn: (id: number) => Promise<void>,
    reloadFn: () => Promise<void>,
    successMessage = '删除成功！'
  ) => {
    if (!deletingId.value) return;

    try {
      await deleteFn(deletingId.value);
      await reloadFn();
      handleSuccess(successMessage);
    } catch (err) {
      handleError(err, '删除失败');
    } finally {
      closeDeleteDialog();
    }
  };

  /**
   * 执行保存操作
   */
  const executeSave = async (
    saveFn: () => Promise<void>,
    reloadFn: () => Promise<void>,
    successMessage: string
  ) => {
    try {
      loading.value = true;
      error.value = null;
      await saveFn();
      await reloadFn();
      handleSuccess(successMessage);
      closeModal();
    } catch (err) {
      handleError(err, '保存失败');
    } finally {
      loading.value = false;
    }
  };

  return {
    // 状态
    loading,
    error,
    showModal,
    showConfirmDialog,
    deletingId,
    // 方法
    handleError,
    handleSuccess,
    openModal,
    closeModal,
    openDeleteDialog,
    closeDeleteDialog,
    executeDelete,
    executeSave,
  };
}
