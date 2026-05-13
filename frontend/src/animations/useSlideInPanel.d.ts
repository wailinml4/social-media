import type { RefObject } from 'react'

interface SlideInPanelOptions {
  closeDelay?: number
  openDuration?: number
  closeDuration?: number
  staggerOpen?: number
  staggerClose?: number
}

export declare function useSlideInPanel(
  panelRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  options?: SlideInPanelOptions,
): {
  openPanel(): void
  closePanel(): void
  initializePanel(): void
}
