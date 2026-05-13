// no React hooks required
import gsap from 'gsap'

/**
 * Hook for like button heart animation
 * @param {React.RefObject} iconRef - Reference to the heart icon element
 * @param {boolean} isLiked - Current like state
 */
export const getLikeAnimation = (iconRef, isLiked) => {
  const animateLike = () => {
    if (iconRef?.current && !isLiked) {
      gsap.fromTo(iconRef.current, { scale: 1 }, { scale: 1.4, duration: 0.3, ease: 'back.out(2)', yoyo: true, repeat: 1 })
    }
  }

  return animateLike
}
