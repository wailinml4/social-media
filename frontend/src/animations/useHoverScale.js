import { useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for hover scale animations
 * @param {Object} options - Animation options
 * @param {number} options.scale - Scale amount on hover (default: 1.06)
 * @param {number} options.duration - Animation duration (default: 0.25)
 * @param {string} options.ease - Easing function (default: 'power2.out')
 */
export const useHoverScale = (options = {}) => {
  const { scale = 1.06, duration = 0.25, ease = 'power2.out' } = options;

  const handleMouseEnter = (element) => {
    if (element) {
      gsap.to(element, { scale, duration, ease });
    }
  };

  const handleMouseLeave = (element) => {
    if (element) {
      gsap.to(element, { scale: 1, duration: 0.2, ease: 'power2.inOut' });
    }
  };

  return { handleMouseEnter, handleMouseLeave };
};

/**
 * Hook for click press animation
 */
export const useClickPress = () => {
  const handleClick = (element, onComplete) => {
    if (element) {
      gsap.to(element, {
        scale: 0.94,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(element, { scale: 1, duration: 0.15, ease: 'power2.out' });
          onComplete?.();
        },
      });
    }
  };

  return handleClick;
};

/**
 * Hook for background color hover animation
 */
export const useHoverBackground = (options = {}) => {
  const { 
    enterColor = 'rgba(255, 255, 255, 0.05)', 
    exitColor = 'transparent',
    duration = 0.2 
  } = options;

  const handleMouseEnter = (element) => {
    if (element) {
      gsap.to(element, { backgroundColor: enterColor, duration });
    }
  };

  const handleMouseLeave = (element) => {
    if (element) {
      gsap.to(element, { backgroundColor: exitColor, duration });
    }
  };

  return { handleMouseEnter, handleMouseLeave };
};
