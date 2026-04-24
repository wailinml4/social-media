import React, { useRef, useState } from 'react';

import { Plus } from 'lucide-react';

import StoryViewer from './StoryViewer';

import { storiesData } from '../../data/stories';
import { useStoryAvatarAnimation } from '../../animations/useStoryAvatarAnimation';
import { useHoverScale } from '../../animations/useHoverScale';

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
            src={story.user.avatar}
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
const AddStoryButton = () => {
  const ref = useRef(null);

  const { handleMouseEnter, handleMouseLeave } = useHoverScale({ scale: 1.06 });

  return (
    <button
      ref={ref}
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
  const [stories, setStories] = useState(storiesData);
  const scrollRef = useRef(null);

  const openStory = (index) => {
    setActiveStoryIndex(index);
    setViewerOpen(true);
  };

  const closeViewer = (viewedStoryIndex = activeStoryIndex) => {
    // Mark the last viewed story as seen when the modal closes.
    setStories(prev =>
      prev.map((s, i) => (i === viewedStoryIndex ? { ...s, seen: true } : s))
    );
    setViewerOpen(false);
  };

  return (
    <>
      {/* Horizontal scroll container */}
      <div className="relative w-full border-b border-white/10">
        {/* Fade edges */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-dark to-transparent pointer-events-none z-10" />

        <div
          ref={scrollRef}
          className="flex items-end gap-4 px-4 py-5 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          <AddStoryButton />

          {stories.map((story, i) => (
            <StoryAvatar
              key={story.id}
              story={story}
              index={i}
              onClick={openStory}
            />
          ))}
        </div>
      </div>

      {/* Full-screen viewer portal */}
      {viewerOpen && (
        <StoryViewer
          stories={stories}
          startIndex={activeStoryIndex}
          onStoryChange={setActiveStoryIndex}
          onClose={closeViewer}
        />
      )}
    </>
  );
};

export default StoriesBar;
