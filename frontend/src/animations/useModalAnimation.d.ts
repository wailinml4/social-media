import type { RefObject } from 'react'

interface ModalAnimationConfig {
  openDuration?: number
  closeDuration?: number
  openScale?: number
  closeScale?: number
  yOffset?: number
  closeYOffset?: number
}

interface UseModalAnimationOptions {
  overlayRef: RefObject<HTMLElement | null>
  modalRef: RefObject<HTMLElement | null>
  onCloseComplete?: () => void
  config?: ModalAnimationConfig
}

interface UseSimpleModalAnimationOptions {
  overlayRef: RefObject<HTMLElement | null>
  containerRef: RefObject<HTMLElement | null>
  onClose?: () => void
}

export declare function useModalAnimation(isOpen: boolean, options: UseModalAnimationOptions): { isRendered: boolean }

export declare function useSimpleModalAnimation(isOpen: boolean | undefined, options: UseSimpleModalAnimationOptions): () => void
