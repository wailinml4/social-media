import { useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for like button heart animation
 * @param {React.RefObject} iconRef - Reference to the heart icon element
 * @param {boolean} isLiked - Current like state
 */
export const useLikeAnimation = (iconRef, isLiked) => {
  const animateLike = () => {
    if (iconRef.current && !isLiked) {
      gsap.fromTo(iconRef.current,
        { scale: 1 },
        { scale: 1.4, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 1 }
      );
    }
  };

  return animateLike;
};

/**
 * Hook for message bubble pop animation
 */
export const useMessageBubbleAnimation = () => {
  const animateNewMessage = (element) => {
    if (element) {
      gsap.fromTo(element,
        { scale: 0.9, opacity: 0, transformOrigin: 'bottom right' },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
      );
    }
  };

  return animateNewMessage;
};
