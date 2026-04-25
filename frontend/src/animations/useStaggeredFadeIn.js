import { useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Hook for staggered fade-in animations on lists/grids
 * @param {boolean} shouldAnimate - Whether to run the animation
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} options - Animation options
 */
export const useStaggeredFadeIn = (shouldAnimate, selector, options = {}) => {
  const {
    y = 30,
    opacity = 0,
    duration = 0.5,
    stagger = 0.1,
    ease = 'power2.out',
    clearProps = 'all',
    delay = 0,
  } = options;

  useGSAP(() => {
    if (!shouldAnimate) return;

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    gsap.fromTo(selector,
      { y, opacity },
      { y: 0, opacity: 1, duration, stagger, ease, clearProps, delay }
    );

    // Remove class after animation to prevent re-animation
    setTimeout(() => {
      elements.forEach(el => el.classList.remove(selector.replace('.', '')));
    }, (duration + stagger * elements.length) * 1000 + 100);
  }, [shouldAnimate, selector, y, opacity, duration, stagger, ease, clearProps, delay]);
};

/**
 * Hook for complex profile page animations
 */
export const useProfileAnimation = (shouldAnimate, scope) => {
  useGSAP(() => {
    if (!shouldAnimate) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.profile-header-anim',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
    )
      .fromTo('.stat-card-anim',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.4'
      )
      .fromTo('.tab-anim',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
        '-=0.2'
      )
      .fromTo('.content-grid-anim',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 },
        '-=0.2'
      );
  }, { scope, dependencies: [shouldAnimate] });
};

/**
 * Hook for tab content transition animation
 */
export const useTabTransition = (onComplete) => {
  const animateTabChange = () => {
    gsap.to('.content-grid-anim', {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        onComplete();
        gsap.fromTo('.content-grid-anim',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }
        );
      }
    });
  };

  return animateTabChange;
};
