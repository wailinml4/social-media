import { useCallback, useRef } from 'react';
import gsap from 'gsap';

const COLLAPSED_W = 72;
const EXPANDED_W = 240;

/**
 * Hook for sidebar expand/collapse animation
 * @param {React.RefObject} asideRef - Reference to sidebar element
 * @param {React.RefObject} labelsRef - Reference to label elements
 */
export const useSidebarAnimation = (asideRef, labelsRef) => {
  const expandedRef = useRef(false);
  const leaveTimer = useRef(null);
  const tlRef = useRef(null);

  const collectLabels = useCallback((node) => {
    if (node) labelsRef.current = node.querySelectorAll('.sidebar-label');
  }, [labelsRef]);

  const expand = useCallback(() => {
    clearTimeout(leaveTimer.current);
    if (expandedRef.current) return;
    expandedRef.current = true;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    // Widen the rail
    tl.to(asideRef.current, {
      width: EXPANDED_W,
      duration: 0.32,
      ease: 'power3.out',
    });

    // Reveal labels with stagger
    tl.to(
      labelsRef.current,
      {
        opacity: 1,
        x: 0,
        width: 'auto',
        duration: 0.22,
        stagger: 0.04,
        ease: 'power2.out',
      },
      '-=0.16'
    );
  }, [asideRef, labelsRef]);

  const collapse = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      if (!expandedRef.current) return;
      expandedRef.current = false;

      if (tlRef.current) tlRef.current.kill();
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Fade + shift labels out first
      tl.to(labelsRef.current, {
        opacity: 0,
        x: -6,
        width: 0,
        duration: 0.16,
        stagger: { each: 0.03, from: 'end' },
        ease: 'power2.in',
      });

      // Narrow the rail
      tl.to(
        asideRef.current,
        {
          width: COLLAPSED_W,
          duration: 0.28,
          ease: 'power3.inOut',
        },
        '-=0.08'
      );
    }, 120);
  }, [asideRef, labelsRef]);

  return { expand, collapse, collectLabels, COLLAPSED_W, EXPANDED_W };
};
