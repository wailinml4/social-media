import type { RefObject } from 'react'

interface StaggeredFadeInOptions {
  y?: number
  opacity?: number
  duration?: number
  stagger?: number
  ease?: string
  clearProps?: string
  delay?: number
}

export declare function useStaggeredFadeIn(shouldAnimate: boolean, selector: string, options?: StaggeredFadeInOptions): void

export declare function useProfileAnimation(shouldAnimate: boolean, scope: RefObject<HTMLElement | null>): void
