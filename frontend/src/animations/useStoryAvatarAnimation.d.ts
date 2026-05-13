import type { RefObject } from 'react'

export declare function useStoryAvatarAnimation(
  avatarRef: RefObject<HTMLElement | null>,
  onClick?: () => void,
): {
  handleMouseEnter(): void
  handleMouseLeave(): void
  handleClick(): void
}
