import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for slide-in panel animation (e.g., TrendingSidebar)
 * @param {React.RefObject} panelRef - Reference to panel element
 * @param {React.RefObject} triggerRef - Reference to trigger element
 * @param {Object} options - Animation options
 */
export const useSlideInPanel = (panelRef, triggerRef, options = {}) => {
  const {
    closeDelay = 140,
    openDuration = 0.6,
    closeDuration = 0.42,
    staggerOpen = 0.06,
    staggerClose = 0.03,
  } = options;

  const closeTimerRef = useRef(null);
  const isOpenRef = useRef(false);
  const animationRef = useRef(null);

  const openPanel = () => {
    clearTimeout(closeTimerRef.current);

    if (isOpenRef.current || !panelRef.current || !triggerRef.current) return;
    isOpenRef.current = true;

    animationRef.current?.kill();
    animationRef.current = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    animationRef.current
      .set(panelRef.current, { pointerEvents: 'auto' })
      .to(panelRef.current, {
        xPercent: 0,
        autoAlpha: 1,
        duration: openDuration,
        ease: 'expo.out',
      })
      .to(
        '.trending-sidebar-card',
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          stagger: staggerOpen,
          clearProps: 'transform',
        },
        '-=0.4'
      )
      .to(
        triggerRef.current,
        {
          autoAlpha: 0,
          duration: 0.2,
          pointerEvents: 'none',
        },
        0
      );
  };

  const closePanel = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      if (!isOpenRef.current || !panelRef.current || !triggerRef.current) return;
      isOpenRef.current = false;

      animationRef.current?.kill();
      animationRef.current = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
      });

      animationRef.current
        .to('.trending-sidebar-card', {
          y: 10,
          autoAlpha: 0,
          duration: 0.22,
          stagger: { each: staggerClose, from: 'end' },
        })
        .to(
          panelRef.current,
          {
            xPercent: 100,
            autoAlpha: 0,
            duration: closeDuration,
            ease: 'power3.inOut',
            onComplete: () => {
              gsap.set(panelRef.current, { pointerEvents: 'none' });
            },
          },
          0
        )
        .to(
          triggerRef.current,
          {
            autoAlpha: 1,
            duration: 0.22,
            pointerEvents: 'auto',
          },
          0.12
        );
    }, closeDelay);
  };

  useEffect(() => {
    return () => {
      clearTimeout(closeTimerRef.current);
      animationRef.current?.kill();
    };
  }, [closeDelay]);

  const initializePanel = (rootRef) => {
    if (!panelRef.current || !triggerRef.current) return;

    gsap.set(panelRef.current, {
      xPercent: 100,
      autoAlpha: 0,
      pointerEvents: 'none',
    });

    gsap.set('.trending-sidebar-card', {
      y: 18,
      autoAlpha: 0,
    });
  };

  return { openPanel, closePanel, initializePanel };
};
