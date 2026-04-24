import React from 'react';

import { Heart, MessageCircle } from 'lucide-react';

import { useModal } from '../../context/ModalContext';
import { useHoverScale } from '../../animations/useHoverScale';

const PostGrid = ({ items, user }) => {
  const { openPostModal } = useModal();
  const { handleMouseEnter, handleMouseLeave } = useHoverScale({ scale: 1.02 });

  const handlePostClick = (item) => {
    const post = {
      id: item.id,
      name: user.name,
      handle: user.handle,
      avatar: user.avatar,
      time: '1d',
      content: item.caption,
      image: item.image,
      likes: item.likes,
      comments: item.comments,
      reposts: 0,
      isLiked: false,
      isSaved: false
    };
    openPostModal(post);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 px-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="content-grid-anim group relative aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10 cursor-pointer"
          onClick={() => handlePostClick(item)}
          onMouseEnter={(e) => {
            handleMouseEnter(e.currentTarget);
            const overlay = e.currentTarget.querySelector('.overlay');
            if (overlay) overlay.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            handleMouseLeave(e.currentTarget);
            const overlay = e.currentTarget.querySelector('.overlay');
            if (overlay) overlay.style.opacity = '0';
          }}
        >
          <img src={item.image} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="overlay absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center gap-6 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-white font-bold">
              <Heart className="w-6 h-6 fill-white" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold">
              <MessageCircle className="w-6 h-6 fill-white" />
              <span>{item.comments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
