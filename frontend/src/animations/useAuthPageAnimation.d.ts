import type { RefObject } from 'react'

export declare function useAuthPageAnimation(containerRef: RefObject<HTMLElement | null>): void

export declare function useButtonHover(): {
  handleMouseEnter(element: HTMLElement): void
  handleMouseLeave(element: HTMLElement): void
}
