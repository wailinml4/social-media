import React from 'react';

const CommentItem = ({ comment, isReply = false }) => {
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10 mt-3' : 'mb-5'} comment-item`}>
      <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-white text-[13px] hover:underline cursor-pointer">{comment.user.name}</span>
          <span className="text-text-dim text-[11px] truncate">@{comment.user.handle}</span>
          <span className="text-gray-600 text-[11px]">·</span>
          <span className="text-text-dim text-[11px]">{comment.time}</span>
        </div>
        <p className="text-gray-300 text-[13px] leading-relaxed mb-1.5">{comment.text}</p>
        <div className="flex items-center gap-4 text-text-dim text-[11px] font-semibold">
          <button className="hover:text-primary transition-colors">Reply</button>
          {!isReply && <button className="hover:text-pink-500 transition-colors">Like</button>}
          {comment.likes > 0 && <span>{comment.likes} likes</span>}
        </div>
        
        {comment.replies && comment.replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    </div>
  );
};

export default CommentItem;
