import React from 'react';

const PostModalCaption = ({ post, isEditing, editContent, onEditContentChange, onSaveEdit, onCancelEdit }) => {
  return (
    <div className="modal-detail-item">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-white/20"
          />
          <div className="flex gap-2">
            <button
              onClick={onSaveEdit}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-white text-[14px] leading-relaxed mb-2">
            {post?.content}
          </p>
          <div className="flex flex-wrap gap-2 text-primary text-sm font-medium mb-3">
            <span>#webdesign</span> <span>#frontend</span> <span>#gsap</span>
          </div>
          <span className="text-text-dim text-[12px]">{post?.time} ago</span>
        </>
      )}
    </div>
  );
};

export default PostModalCaption;
