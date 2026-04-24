import React from 'react';

const ChatMessageSkeleton = ({ isMe = false }) => {
  return (
    <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed backdrop-blur-sm shadow-sm animate-pulse ${
            isMe
              ? 'bg-white/10 rounded-br-sm'
              : 'bg-white/5 rounded-bl-sm border border-white/10'
          }`}
        >
          <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
          <div className="h-3 bg-white/5 rounded w-4/5"></div>
        </div>

        {/* Timestamp */}
        <div className="h-3 bg-white/5 rounded w-12 mt-1 mx-1"></div>
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
