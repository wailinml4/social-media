import React, { useEffect, useRef, useState } from 'react';

import { Plus } from 'lucide-react';

import StoryViewer from './StoryViewer';
import { useStoryAvatarAnimation } from '../../animations/useStoryAvatarAnimation';
import { useHoverScale } from '../../animations/useHoverScale';
import { getStories, markStoryViewed, getStoryResumeSlideIndex, clearStoryResumeSlideIndex } from '../../services/storyService';
import { useModal } from '../../context/ModalContext';

// ── Individual story avatar pill ─────────────────────────────────────────────
const StoryAvatar = ({ story, index, onClick }) => {
  const avatarRef = useRef(null);
  const seen = story.seen;

  const { handleMouseEnter, handleMouseLeave, handleClick } = useStoryAvatarAnimation(avatarRef, () => onClick(index));

  return (
    <button
      ref={avatarRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
      aria-label={`View ${story.user.name}'s story`}
    >
      {/* Ring + avatar */}
      <div
        className="relative w-[62px] h-[62px] rounded-full p-[2.5px]"
        style={{
          background: seen
            ? 'rgba(255,255,255,0.12)'
            : 'linear-gradient(135deg, #a78bfa 0%, #818cf8 35%, #38bdf8 100%)',
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-[2px] border-neutral-950">
          <img
            src={story.user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={story.user.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        {/* Seen indicator — faint ring */}
        {seen && (
          <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
        )}
      </div>

      {/* Username label */}
      <span
        className="text-[11px] font-medium leading-none max-w-[64px] truncate"
        style={{ color: seen ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)' }}
      >
        {story.user.name.split(' ')[0]}
      </span>
    </button>
  );
};

// ── "Your Story" add button ──────────────────────────────────────────────────
const AddStoryButton = ({ onClick }) => {
  const ref = useRef(null);
  const { handleMouseEnter, handleMouseLeave } = useHoverScale({ scale: 1.06 });

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => handleMouseEnter(ref.current)}
      onMouseLeave={() => handleMouseLeave(ref.current)}
      className="flex flex-col items-center gap-1.5 flex-shrink-0"
      aria-label="Add your story"
    >
      <div className="relative w-[62px] h-[62px] rounded-full bg-neutral-900 border border-white/[0.08] flex items-center justify-center">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wailin"
          alt="You"
          className="w-full h-full object-cover rounded-full opacity-40"
          draggable={false}
        />
        {/* Plus badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary border-2 border-neutral-950 flex items-center justify-center">
          <Plus className="w-3 h-3 text-white" strokeWidth={2.5} />
        </div>
      </div>
      <span className="text-[11px] font-medium text-white/40 leading-none">Your story</span>
    </button>
  );
};

// ── Main stories bar ─────────────────────────────────────────────────────────
const StoriesBar = () => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [startSlideIndex, setStartSlideIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openCreateStoryModal } = useModal();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);
        const data = await getStories();
        setStories(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Unable to load stories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const openStory = (index) => {
    const storyId = stories[index]?.id;
    const resumeIndex = storyId ? getStoryResumeSlideIndex(storyId) : 0;
    setActiveStoryIndex(index);
    setStartSlideIndex(resumeIndex);
    setViewerOpen(true);
  };

  const handleStoryComplete = async (storyId, completedStoryIndex) => {
    const story = stories[completedStoryIndex];
    if (!story || story.seen) {
      return;
    }

    setStories((prev) =>
      prev.map((s, i) => (i === completedStoryIndex ? { ...s, seen: true } : s))
    );

    await markStoryViewed(storyId).catch(() => {
      // Keep client state even if the backend call fails
    });

    clearStoryResumeSlideIndex(storyId);
  };

  const closeViewer = (viewedStoryIndex = activeStoryIndex) => {
    setViewerOpen(false);
  };

  return (
    <>
      <div className="relative w-full border-b border-white/10">
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-dark to-transparent pointer-events-none z-10" />

        <div
          ref={scrollRef}
          className="flex items-end gap-4 px-4 py-5 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          <AddStoryButton onClick={openCreateStoryModal} />

          {isLoading ? (
            <div className="text-sm text-white/50">Loading stories...</div>
          ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : stories.length === 0 ? (
            <div className="text-sm text-white/50">Follow users to see stories from your network.</div>
          ) : (
            stories.map((story, i) => (
              <StoryAvatar key={story.id} story={story} index={i} onClick={openStory} />
            ))
          )}
        </div>
      </div>

      {viewerOpen && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          startIndex={activeStoryIndex}
          startSlideIndex={startSlideIndex}
          onStoryChange={setActiveStoryIndex}
          onClose={closeViewer}
          onComplete={handleStoryComplete}
        />
      )}
    </>
  );
};

export default StoriesBar;
