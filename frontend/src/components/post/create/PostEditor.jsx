import React from 'react';

const PostEditor = ({ content, onChange, onSave, onCancel, isSaving }) => {
  return (
    <div onClick={(e) => e.stopPropagation()} className="space-y-2 mb-3">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-white/20"
      />
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostEditor;
