import React, { useCallback, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import gsap from 'gsap';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import StoryProgressBar from './StoryProgressBar';

const STORY_DURATION = 5000;

const StoryViewer = ({ stories, startIndex = 0, onStoryChange, onClose }) => {
  const [storyIndex, setStoryIndex] = useState(startIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const progressInterval = useRef(null);
  const progressStart = useRef(null);
  const elapsed = useRef(null);
  const holdTimeout = useRef(null);
  const isHolding = useRef(false);

  // ─── GSAP open animation ──────────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    tl.fromTo(
      containerRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' },
      '-=0.15'
    );
    return () => tl.kill();
  }, []);

  // ─── Close with GSAP ─────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    clearInterval(progressInterval.current);
    const tl = gsap.timeline({ onComplete: () => onClose?.(storyIndex) });
    tl.to(containerRef.current, { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
  }, [onClose, storyIndex]);

  const currentStory = stories[storyIndex];
  const currentSlide = currentStory?.slides[slideIndex];
  const totalSlides = currentStory?.slides.length ?? 0;

  const goNext = useCallback(() => {
    if (slideIndex < totalSlides - 1) {
      setCurrentProgress(0);
      setSlideIndex(i => i + 1);
    } else if (storyIndex < stories.length - 1) {
      setCurrentProgress(0);
      setStoryIndex(i => i + 1);
      setSlideIndex(0);
    } else {
      onClose?.(storyIndex);
    }
  }, [slideIndex, storyIndex, stories.length, totalSlides, onClose]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setCurrentProgress(0);
      setSlideIndex(i => i - 1);
    } else if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1];
      setCurrentProgress(0);
      setStoryIndex(i => i - 1);
      setSlideIndex(prevStory.slides.length - 1);
    }
  }, [slideIndex, storyIndex, stories]);

  useEffect(() => {
    onStoryChange?.(storyIndex);
  }, [storyIndex, onStoryChange]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);


  // ─── Progress ticker ──────────────────────────────────────────────────────
  const startProgress = useCallback(() => {
    clearInterval(progressInterval.current);
    progressStart.current = Date.now() - elapsed.current;

    progressInterval.current = setInterval(() => {
      if (isHolding.current) return;
      const delta = Date.now() - progressStart.current;
      const pct = Math.min(delta / STORY_DURATION, 1);
      setCurrentProgress(pct);

      if (pct >= 1) {
        clearInterval(progressInterval.current);
        elapsed.current = 0;
        goNext();
      }
    }, 30);
  }, [goNext]);

  useEffect(() => {
    elapsed.current = 0;
    startProgress();
    return () => clearInterval(progressInterval.current);
  }, [slideIndex, storyIndex, startProgress]);

  // Pause / resume on hold
  useEffect(() => {
    if (paused) {
      elapsed.current = Date.now() - (progressStart.current ?? Date.now());
      clearInterval(progressInterval.current);
      return;
    }

    startProgress();
  }, [paused, startProgress]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, handleClose]);

  // ─── Hold to pause handlers ───────────────────────────────────────────────
  const onPointerDown = () => {
    holdTimeout.current = setTimeout(() => {
      isHolding.current = true;
      setPaused(true);
    }, 150);
  };

  const onPointerUp = () => {
    clearTimeout(holdTimeout.current);
    if (isHolding.current) {
      isHolding.current = false;
      setPaused(false);
    }
  };

  if (!currentStory || !currentSlide) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-6 opacity-0"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={handleClose}
    >
      {/* Story container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-full max-w-sm mx-auto"
        style={{ maxHeight: '100dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image fill */}
        <div
          className="relative w-full h-full overflow-hidden rounded-none sm:rounded-3xl select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ maxWidth: 420, maxHeight: '100dvh' }}
        >
          {/* Background image */}
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.caption}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Gradient overlays — top & bottom for legibility */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

          {/* ── Top bar: progress + user info ── */}
          <div className="absolute top-0 inset-x-0 px-4 pt-4 z-10">
            {/* Segmented progress bars */}
            <StoryProgressBar 
              slides={currentStory.slides}
              currentIndex={slideIndex}
              currentProgress={currentProgress}
            />

            {/* User identity row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                  <img
                    src={currentStory.user.avatar}
                    alt={currentStory.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold leading-tight">
                    {currentStory.user.name}
                  </span>
                  <span className="text-white/50 text-[11px] leading-tight">
                    {currentSlide.timestamp}
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close story"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* ── Caption ── */}
          {currentSlide.caption && (
            <div className="absolute bottom-8 inset-x-0 px-5 z-10 pointer-events-none">
              <p className="text-white text-sm font-medium leading-snug drop-shadow-sm">
                {currentSlide.caption}
              </p>
            </div>
          )}

          {/* ── Tap zones ── */}
          {/* Left: previous */}
          <button
            className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
            onClick={goPrev}
            aria-label="Previous"
          />
          {/* Right: next */}
          <button
            className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
            onClick={goNext}
            aria-label="Next"
          />
        </div>

        {/* ── External nav arrows (desktop only) ── */}
        <button
          onClick={goPrev}
          disabled={storyIndex === 0 && slideIndex === 0}
          className="hidden sm:flex absolute -left-14 w-10 h-10 rounded-full items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <button
          onClick={goNext}
          className="hidden sm:flex absolute -right-14 w-10 h-10 rounded-full items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          aria-label="Next story"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default StoryViewer;
