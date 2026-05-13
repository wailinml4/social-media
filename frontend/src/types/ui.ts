// ===== UI TYPES =====

export interface ConfirmModalProps {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
}

export interface ConfirmModalData {
  title?: string
  message?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
}
