import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Hook for auth page entrance animations
 * @param {React.RefObject} containerRef - Reference to container element
 */
export const useAuthPageAnimation = (containerRef) => {
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Page fade and slight upward motion
    tl.from(containerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Staggered input fields and elements
    tl.from('.auth-stagger', {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.4');
  }, { scope: containerRef });
};

/**
 * Hook for button hover animation
 */
export const useButtonHover = () => {
  const handleMouseEnter = (element) => {
    gsap.to(element, { scale: 1.02, duration: 0.2, ease: 'power2.out' });
  };

  const handleMouseLeave = (element) => {
    gsap.to(element, { scale: 1, duration: 0.2, ease: 'power2.out' });
  };

  return { handleMouseEnter, handleMouseLeave };
};
