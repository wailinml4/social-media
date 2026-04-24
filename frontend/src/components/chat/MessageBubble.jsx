import React from 'react';

const MessageBubble = ({ message, isMe }) => {
  return (
    <div className={`message-bubble flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed backdrop-blur-sm shadow-sm ${
            isMe 
              ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-sm' 
              : 'bg-surface text-white rounded-bl-sm border border-white/10'
          }`}
        >
          {message.text}
        </div>
        <span className="text-[11px] text-text-dim mt-1 mx-1">{message.createdAt}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
