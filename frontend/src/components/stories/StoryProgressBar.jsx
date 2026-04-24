import React from 'react';

const StoryProgressBar = ({ slides, currentIndex, currentProgress }) => {
  return (
    <div className="flex gap-1 mb-3">
      {slides.map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[2.5px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
        >
          <div
            className="h-full rounded-full bg-white"
            style={{
              width: `${(i < currentIndex ? 1 : i === currentIndex ? currentProgress : 0) * 100}%`,
              transition: i === currentIndex && currentProgress === 0 ? 'none' : undefined,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryProgressBar;
