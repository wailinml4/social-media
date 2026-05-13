import type { RefObject } from 'react'

export declare function useSidebarAnimation(
  asideRef: RefObject<HTMLElement | null>,
  labelsRef: RefObject<NodeListOf<Element> | null>,
): {
  expand(): void
  collapse(): void
  collectLabels(node: HTMLElement | null): void
  COLLAPSED_W: number
  EXPANDED_W: number
}
