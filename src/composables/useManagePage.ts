import { ref } from 'vue'
import { useToast } from './useToast'
import { logger } from '@/utils/logger'
import { getErrorMessage } from '@/utils/utils'

export function useManagePage<T extends { id: number }>() {
  const toast = useToast()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const showModal = ref(false)
  const showConfirmDialog = ref(false)
  const deletingId = ref<number | null>(null)

  const handleError = (err: unknown, defaultMessage = '操作失败') => {
    const message = getErrorMessage(err, defaultMessage)
    error.value = message
    toast.error(message)
    logger.error('操作失败:', err)
  }

  const handleSuccess = (message: string) => {
    error.value = null
    toast.success(message)
  }

  const openModal = () => {
    error.value = null
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    error.value = null
  }

  const openDeleteDialog = (id: number) => {
    deletingId.value = id
    showConfirmDialog.value = true
  }

  const closeDeleteDialog = () => {
    showConfirmDialog.value = false
    deletingId.value = null
  }

  const executeDelete = async (
    deleteFn: (id: number) => Promise<void>,
    reloadFn: () => Promise<void>,
    successMessage = '删除成功！'
  ) => {
    if (!deletingId.value) return
    try {
      await deleteFn(deletingId.value)
      await reloadFn()
      handleSuccess(successMessage)
    } catch (err) {
      handleError(err, '删除失败')
    } finally {
      closeDeleteDialog()
    }
  }

  const executeSave = async (
    saveFn: () => Promise<void>,
    reloadFn: () => Promise<void>,
    successMessage: string
  ) => {
    try {
      loading.value = true
      error.value = null
      await saveFn()
      await reloadFn()
      handleSuccess(successMessage)
      closeModal()
    } catch (err) {
      handleError(err, '保存失败')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    showModal,
    showConfirmDialog,
    deletingId,
    handleError,
    handleSuccess,
    openModal,
    closeModal,
    openDeleteDialog,
    closeDeleteDialog,
    executeDelete,
    executeSave
  }
}
