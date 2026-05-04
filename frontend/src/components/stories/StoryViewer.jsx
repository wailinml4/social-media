import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createPortal } from 'react-dom'
import gsap from 'gsap'

import { ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react'

import StoryProgressBar from './StoryProgressBar'
import { useModal } from '../../context/ModalContext'
import { setStoryResumeSlideIndex } from '../../services/storyService'
import defaultAvatar from '../../assets/default-avatar.svg'

const DEFAULT_STORY_DURATION = 5000

const formatRelativeTimestamp = (timestamp, fallbackDate) => {
  const parseDate = value => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof timestamp === 'string') {
    const normalized = timestamp.trim().toLowerCase()
    if (normalized !== 'just now') {
      const unitMatch = normalized.match(/^(\d+)\s*(s|sec|secs|seconds?)\s*ago$/)
      if (unitMatch) {
        return `${unitMatch[1]}s`
      }

      const minMatch = normalized.match(/^(\d+)\s*(m|min|mins|minutes?)\s*ago$/)
      if (minMatch) {
        return `${minMatch[1]}m`
      }

      const hourMatch = normalized.match(/^(\d+)\s*(h|hr|hrs|hours?)\s*ago$/)
      if (hourMatch) {
        return `${hourMatch[1]}h`
      }

      const dayMatch = normalized.match(/^(\d+)\s*(d|day|days?)\s*ago$/)
      if (dayMatch) {
        return `${dayMatch[1]}d`
      }
    }
  }

  const date = parseDate(timestamp) || parseDate(fallbackDate)
  if (!date) {
    return timestamp || ''
  }

  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h`
  }

  const days = Math.floor(hours / 24)
  return `${days}d`
}

const StoryViewer = ({
  stories,
  startIndex = 0,
  startSlideIndex = 0,
  canDelete = false,
  onDelete,
  onStoryChange,
  onClose,
  onComplete,
}) => {
  const [storyIndex, setStoryIndex] = useState(startIndex)
  const [slideIndex, setSlideIndex] = useState(startSlideIndex)
  const [paused, setPaused] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const overlayRef = useRef(null)
  const containerRef = useRef(null)
  const progressInterval = useRef(null)
  const progressStart = useRef(null)
  const elapsed = useRef(null)
  const holdTimeout = useRef(null)
  const isHolding = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' },
    )
    tl.fromTo(
      containerRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' },
      '-=0.15',
    )
    return () => tl.kill()
  }, [])

  useEffect(() => {
    setTimeout(() => setStoryIndex(startIndex), 0)
    setTimeout(
      () => setSlideIndex(Math.min(startSlideIndex, stories[startIndex]?.slides.length - 1 || 0)),
      0,
    )
  }, [startIndex, startSlideIndex, stories])

  useEffect(() => {
    if (!stories?.length) return

    const clampedStoryIndex = Math.min(storyIndex, stories.length - 1)
    if (clampedStoryIndex !== storyIndex) {
      setTimeout(() => setStoryIndex(clampedStoryIndex), 0)
      return
    }

    const slideCount = stories[storyIndex]?.slides.length ?? 0
    if (slideCount > 0 && slideIndex >= slideCount) {
      setTimeout(() => setSlideIndex(slideCount - 1), 0)
    }
  }, [stories, storyIndex, slideIndex])

  useEffect(() => {
    const story = stories?.[storyIndex]
    if (!story) return

    try {
      setStoryResumeSlideIndex(story.id, slideIndex)
    } catch (err) {
      void err
    }
  }, [storyIndex, slideIndex, stories])

  const currentStory = stories[storyIndex]
  const currentSlide = currentStory?.slides[slideIndex]
  const totalSlides = currentStory?.slides.length ?? 0
  const storyDuration = currentSlide?.duration ?? DEFAULT_STORY_DURATION

  const handleClose = useCallback(() => {
    clearInterval(progressInterval.current)
    const tl = gsap.timeline({
      onComplete: () => {
        if (slideIndex === totalSlides - 1) {
          onComplete?.(stories[storyIndex].id, storyIndex)
        }
        onClose?.(storyIndex)
      },
    })
    tl.to(containerRef.current, { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' })
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1')
  }, [onClose, onComplete, slideIndex, storyIndex, stories, totalSlides])

  const goNext = useCallback(() => {
    if (slideIndex < totalSlides - 1) {
      setCurrentProgress(0)
      setSlideIndex(i => i + 1)
    } else if (storyIndex < stories.length - 1) {
      onComplete?.(stories[storyIndex].id, storyIndex)
      setCurrentProgress(0)
      setStoryIndex(i => i + 1)
      setSlideIndex(0)
    } else {
      onComplete?.(stories[storyIndex].id, storyIndex)
      onClose?.(storyIndex)
    }
  }, [slideIndex, storyIndex, stories, totalSlides, onClose, onComplete])

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setCurrentProgress(0)
      setSlideIndex(i => i - 1)
    } else if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1]
      setCurrentProgress(0)
      setStoryIndex(i => i - 1)
      setSlideIndex(prevStory.slides.length - 1)
    }
  }, [slideIndex, storyIndex, stories])

  useEffect(() => {
    onStoryChange?.(storyIndex)
  }, [storyIndex, onStoryChange])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const startProgress = useCallback(() => {
    clearInterval(progressInterval.current)
    progressStart.current = Date.now() - elapsed.current

    progressInterval.current = setInterval(() => {
      if (isHolding.current) return
      const delta = Date.now() - progressStart.current
      const pct = Math.min(delta / storyDuration, 1)
      setCurrentProgress(pct)

      if (pct >= 1) {
        clearInterval(progressInterval.current)
        elapsed.current = 0
        goNext()
      }
    }, 30)
  }, [goNext, storyDuration])

  useEffect(() => {
    elapsed.current = 0
    startProgress()
    return () => clearInterval(progressInterval.current)
  }, [slideIndex, storyIndex, startProgress])

  useEffect(() => {
    if (paused) {
      elapsed.current = Date.now() - (progressStart.current ?? Date.now())
      clearInterval(progressInterval.current)
      return
    }

    startProgress()
  }, [paused, startProgress])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, handleClose])

  const { openConfirmModal } = useModal()

  const handleDeleteSlide = useCallback(async () => {
    if (!canDelete || !onDelete || !currentSlide) return

    openConfirmModal({
      title: 'Delete story slide',
      message: 'This will permanently delete the current story slide.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setIsDeleting(true)
        try {
          await onDelete(currentSlide.id, storyIndex, slideIndex)
        } finally {
          setIsDeleting(false)
        }
      },
    })
  }, [canDelete, currentSlide, onDelete, openConfirmModal, storyIndex, slideIndex])

  const onPointerDown = () => {
    holdTimeout.current = setTimeout(() => {
      isHolding.current = true
      setPaused(true)
    }, 150)
  }

  const onPointerUp = () => {
    clearTimeout(holdTimeout.current)
    if (isHolding.current) {
      isHolding.current = false
      setPaused(false)
    }
  }

  if (!currentStory || !currentSlide) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-6 opacity-0"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-full max-w-sm mx-auto"
        style={{ maxHeight: '100dvh' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative w-full aspect-[9/16] max-h-[90vh] overflow-hidden rounded-none sm:rounded-3xl select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ maxWidth: 420 }}
        >
          {currentSlide.type === 'video' ? (
            <video
              key={currentSlide.id}
              src={currentSlide.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              loop={false}
            />
          ) : (
            <img
              key={currentSlide.id}
              src={currentSlide.mediaUrl}
              alt={currentSlide.caption}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          )}

          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

          <div className="absolute top-0 inset-x-0 px-4 pt-4 z-30">
            <StoryProgressBar
              slides={currentStory.slides}
              currentIndex={slideIndex}
              currentProgress={currentProgress}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shrink-0 cursor-pointer"
                  onClick={e => {
                    e.stopPropagation()
                    try {
                      const uid =
                        (currentStory.user &&
                          (currentStory.user._id ||
                            currentStory.user.id ||
                            currentStory.user.uuid)) ||
                        null
                      // Close viewer then navigate to profile
                      onClose?.(storyIndex)
                      if (uid) {
                        navigate(`/profile/${uid}`)
                      } else {
                        navigate('/profile')
                      }
                    } catch (err) {
                      void err
                    }
                  }}
                >
                  <img
                    src={
                      currentStory.user.avatar || currentStory.user.profilePicture || defaultAvatar
                    }
                    alt={currentStory.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={e => {
                      e.stopPropagation()
                      try {
                        const uid =
                          (currentStory.user &&
                            (currentStory.user._id ||
                              currentStory.user.id ||
                              currentStory.user.uuid)) ||
                          null
                        onClose?.(storyIndex)
                        if (uid) {
                          navigate(`/profile/${uid}`)
                        } else {
                          navigate('/profile')
                        }
                      } catch (err) {
                        void err
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        const uid =
                          (currentStory.user &&
                            (currentStory.user._id ||
                              currentStory.user.id ||
                              currentStory.user.uuid)) ||
                          null
                        onClose?.(storyIndex)
                        if (uid) {
                          navigate(`/profile/${uid}`)
                        } else {
                          navigate('/profile')
                        }
                      }
                    }}
                    className="text-white text-sm font-semibold leading-tight cursor-pointer"
                  >
                    {currentStory.user.name}
                  </span>
                  <span className="text-white/50 text-[11px] leading-tight">
                    {formatRelativeTimestamp(currentSlide.timestamp, currentStory.createdAt)}
                  </span>
                </div>
              </div>

              {canDelete && (
                <button
                  onClick={handleDeleteSlide}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/15 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Delete story slide"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                </button>
              )}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close story"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {currentSlide.caption && (
            <div className="absolute bottom-8 inset-x-0 px-5 z-10 pointer-events-none">
              <p className="text-white text-sm font-medium leading-snug drop-shadow-sm">
                {currentSlide.caption}
              </p>
            </div>
          )}

          <button
            className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
            onClick={goPrev}
            aria-label="Previous"
          />
          <button
            className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
            onClick={goNext}
            aria-label="Next"
          />
        </div>

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
    document.body,
  )
}

export default StoryViewer
