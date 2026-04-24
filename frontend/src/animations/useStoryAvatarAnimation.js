import { useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for story avatar hover and click animations
 * @param {React.RefObject} avatarRef - Reference to avatar element
 * @param {Function} onClick - Click callback
 */
export const useStoryAvatarAnimation = (avatarRef, onClick) => {
  const handleMouseEnter = () => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, { scale: 1.06, duration: 0.25, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, { scale: 1, duration: 0.2, ease: 'power2.inOut' });
    }
  };

  const handleClick = () => {
    if (avatarRef.current) {
      gsap.to(avatarRef.current, {
        scale: 0.94,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(avatarRef.current, { scale: 1, duration: 0.15, ease: 'power2.out' });
          onClick?.();
        },
      });
    }
  };

  return { handleMouseEnter, handleMouseLeave, handleClick };
};
