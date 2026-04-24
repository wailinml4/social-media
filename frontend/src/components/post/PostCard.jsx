import React, { useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Share2 } from 'lucide-react';

import { useModal } from '../../context/ModalContext';
import { useLikeAnimation } from '../../animations/useLikeAnimation';

const PostCard = ({ post }) => {
  const { openPostModal } = useModal();
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.isSaved);
  const likeIconRef = useRef(null);

  const animateLike = useLikeAnimation(likeIconRef, liked);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    animateLike();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  return (
    <article className="post-card px-4 py-5 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 flex gap-4 w-full">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Link to={`/profile/${post.handle}`} className="block w-12 h-12 rounded-full overflow-hidden border border-white/10 hover:opacity-80 transition-opacity">
          <img src={post.avatar} alt={post.name} className="w-full h-full object-cover" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-sm">
            <Link to={`/profile/${post.handle}`} className="font-bold text-white hover:underline truncate">
              {post.name}
            </Link>
            <span className="text-text-dim truncate">@{post.handle}</span>
            <span className="text-gray-600">·</span>
            <span onClick={() => openPostModal(post)} className="text-text-dim hover:underline cursor-pointer">{post.time}</span>
          </div>
          <button className="text-text-dim hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Text Body - Clickable (Opens Modal) */}
        <div onClick={() => openPostModal(post)} className="cursor-pointer">
          <p className="text-gray-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Media */}
          {post.image && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 max-h-[500px] bg-surface">
              <img src={post.image} alt="Post media" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between text-text-dim mt-4 max-w-md">
          <button onClick={(e) => { e.stopPropagation(); openPostModal(post); }} className="flex items-center gap-2 group transition-colors hover:text-blue-400">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 group transition-colors hover:text-green-400">
            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">{post.reposts}</span>
          </button>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 group transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
          >
            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors relative">
              <Heart
                ref={likeIconRef}
                className="w-5 h-5"
                fill={liked ? "currentColor" : "none"}
              />
            </div>
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 group transition-colors ${saved ? 'text-primary' : 'hover:text-primary'}`}
          >
            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
              <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
            </div>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
