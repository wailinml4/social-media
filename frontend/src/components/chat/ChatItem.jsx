import React, { useRef } from 'react';

import { useHoverBackground } from '../../animations/useHoverScale';

const ChatItem = ({ chat, isActive, onClick, isCollapsed }) => {
  const itemRef = useRef(null);

  const { handleMouseEnter, handleMouseLeave } = useHoverBackground({
    enterColor: 'rgba(255, 255, 255, 0.05)',
    exitColor: 'transparent',
    duration: 0.2,
  });

  return (
    <div
      ref={itemRef}
      onClick={onClick}
      onMouseEnter={() => !isActive && handleMouseEnter(itemRef.current)}
      onMouseLeave={() => !isActive && handleMouseLeave(itemRef.current)}
      className={`chat-list-item flex items-center gap-3 p-4 cursor-pointer border-b border-white/10 transition-colors ${
        isActive ? 'bg-white/10 relative' : ''
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? chat.user.name : ''}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(10,132,255,0.4)]" />
      )}
      
      <div className="relative flex-shrink-0">
        <img src={chat.user.avatar} alt={chat.user.name} className="w-12 h-12 rounded-full border border-white/10" />
        {chat.user.online && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0 transition-opacity duration-300">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-white truncate pr-2">{chat.user.name}</h3>
            <span className="text-xs text-text-dim whitespace-nowrap">{chat.timestamp}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className={`text-sm truncate ${chat.unread ? 'text-white font-medium' : 'text-text-dim'}`}>
              {chat.lastMessage}
            </p>
            {chat.unread > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
