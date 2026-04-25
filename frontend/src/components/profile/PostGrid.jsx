import React from 'react';

import { Heart, MessageCircle } from 'lucide-react';

import { useModal } from '../../context/ModalContext';
import { useHoverScale } from '../../animations/useHoverScale';

const PostGrid = ({ items, user }) => {
  const { openPostModal } = useModal();
  const { handleMouseEnter, handleMouseLeave } = useHoverScale({ scale: 1.02 });

  const handlePostClick = (item) => {
    const post = {
      _id: item._id,
      id: item._id,
      author: item.author || {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture
      },
      name: user.fullName,
      handle: user.email?.split('@')[0],
      avatar: user.profilePicture,
      time: new Date(item.createdAt).toLocaleDateString(),
      content: item.content,
      images: item.images || [],
      likeCount: item.likes?.length || 0,
      comments: item.comments?.length || 0,
      likes: item.likes?.length || 0,
      commentsCount: item.comments?.length || 0
    };
    openPostModal(post);
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-gray-400">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 px-4">
      {items.map((item) => (
        <div
          key={item._id}
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
          {item.images?.[0] ? (
            <img src={item.images[0]} alt={item.content} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <p className="text-gray-400 text-sm px-4 text-center line-clamp-3">{item.content}</p>
            </div>
          )}
          <div className="overlay absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center gap-6 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-white font-bold">
              <Heart className="w-6 h-6 fill-white" />
              <span>{item.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
