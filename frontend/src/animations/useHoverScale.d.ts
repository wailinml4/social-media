export declare function useHoverScale(options?: { scale?: number; duration?: number; ease?: string }): {
  handleMouseEnter(element: HTMLElement | null): void
  handleMouseLeave(element: HTMLElement | null): void
}

export declare function useHoverBackground(options?: { enterColor?: string; exitColor?: string; duration?: number }): {
  handleMouseEnter(element: HTMLElement | null): void
  handleMouseLeave(element: HTMLElement | null): void
}
