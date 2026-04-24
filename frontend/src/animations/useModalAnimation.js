import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Reusable modal open/close animation hook
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Object} options - Animation options
 * @param {React.RefObject} options.overlayRef - Reference to overlay element
 * @param {React.RefObject} options.modalRef - Reference to modal content element
 * @param {Function} options.onCloseComplete - Callback when close animation completes
 * @param {Object} options.config - Custom animation config
 */
export const useModalAnimation = (isOpen, { overlayRef, modalRef, onCloseComplete, config = {} }) => {
  const closeTweenRef = useRef(null);
  const isRenderedRef = useRef(false);
  const hasAnimatedOpenRef = useRef(false);
  const onCloseCompleteRef = useRef(onCloseComplete);
  const [isRendered, setIsRendered] = useState(false);

  // Update ref when callback changes
  useEffect(() => {
    onCloseCompleteRef.current = onCloseComplete;
  }, [onCloseComplete]);

  const {
    openDuration = 0.38,
    closeDuration = 0.18,
    openScale = 0.95,
    closeScale = 0.96,
    yOffset = 10,
    closeYOffset = 8,
  } = config;

  useEffect(() => {
    if (isOpen) {
      if (!isRenderedRef.current) {
        isRenderedRef.current = true;
        setIsRendered(true);
      }

      // Only run open animation once per open session
      if (!hasAnimatedOpenRef.current) {
        hasAnimatedOpenRef.current = true;

        const openAnimation = requestAnimationFrame(() => {
          if (!overlayRef.current || !modalRef.current) return;
          
          try {
            gsap.killTweensOf([overlayRef.current, modalRef.current]);

            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set(modalRef.current, { opacity: 0, scale: openScale, y: yOffset });

            gsap.timeline()
              .to(overlayRef.current, {
                opacity: 1,
                duration: 0.24,
                ease: 'power2.out',
              })
              .to(
                modalRef.current,
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: openDuration,
                  ease: 'power3.out',
                },
                0
              );
          } catch (error) {
            console.warn('GSAP animation error:', error);
          }
        });

        return () => cancelAnimationFrame(openAnimation);
      }
    } else {
      // Reset animation flag when modal closes
      hasAnimatedOpenRef.current = false;
    }

    if (!isRenderedRef.current) return undefined;

    if (!overlayRef.current || !modalRef.current) {
      isRenderedRef.current = false;
      setIsRendered(false);
      onCloseCompleteRef.current?.();
      return undefined;
    }

    try {
      gsap.killTweensOf([overlayRef.current, modalRef.current]);
      closeTweenRef.current = gsap.timeline({
        onComplete: () => {
          isRenderedRef.current = false;
          setIsRendered(false);
          onCloseCompleteRef.current?.();
        },
      });

      closeTweenRef.current
        .to(modalRef.current, {
          opacity: 0,
          scale: closeScale,
          y: closeYOffset,
          duration: closeDuration,
          ease: 'power2.inOut',
        })
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: closeDuration,
            ease: 'power2.out',
          },
          0
        );
    } catch (error) {
      console.warn('GSAP close animation error:', error);
      isRenderedRef.current = false;
      setIsRendered(false);
      onCloseCompleteRef.current?.();
    }

    return () => {
      closeTweenRef.current?.kill();
    };
  }, [isOpen, openDuration, closeDuration, openScale, closeScale, yOffset, closeYOffset]);

  return { isRendered };
};

/**
 * Simpler modal animation for story viewer and other lightweight modals
 * If isOpen is undefined, it runs open animation on mount (uncontrolled mode)
 */
export const useSimpleModalAnimation = (isOpen, { overlayRef, containerRef, onClose }) => {
  const isRenderedRef = useRef(false);
  const isUncontrolled = isOpen === undefined;

  useEffect(() => {
    if (isUncontrolled || isOpen) {
      // Wait for refs to be available with a slight delay
      const timeout = setTimeout(() => {
        if (!overlayRef.current || !containerRef.current) return;

        isRenderedRef.current = true;

        const tl = gsap.timeline();
        tl.set(overlayRef.current, { pointerEvents: 'auto' });
        tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        tl.fromTo(
          containerRef.current,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' },
          '-=0.15'
        );
      }, 10);

      return () => {
        clearTimeout(timeout);
        gsap.killTweensOf([overlayRef.current, containerRef.current]);
      };
    }

    if (!isRenderedRef.current) return undefined;

    const tl = gsap.timeline({ onComplete: () => {
      isRenderedRef.current = false;
      onClose?.();
    }});
    tl.to(containerRef.current, { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
    tl.set(overlayRef.current, { pointerEvents: 'none' });

    return () => tl.kill();
  }, [isOpen, overlayRef, containerRef, onClose, isUncontrolled]);

  const handleClose = () => {
    if (isUncontrolled) {
      const tl = gsap.timeline({ onComplete: onClose });
      tl.to(containerRef.current, { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' });
      tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
      tl.set(overlayRef.current, { pointerEvents: 'none' });
    } else {
      onClose?.();
    }
  };

  return handleClose;
};
