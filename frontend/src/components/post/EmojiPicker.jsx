import React from 'react';

const EMOJI_SUGGESTIONS = ['✨', '🔥', '🤍', '🚀', '🎧', '📸'];

const EmojiPicker = ({ onEmojiSelect }) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-surface p-2.5">
      {EMOJI_SUGGESTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onEmojiSelect(emoji)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6 text-lg transition-colors duration-200 hover:bg-white/10"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
