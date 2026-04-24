import React, { useEffect, useRef, useState } from 'react';

import { Bookmark, Heart, MessageCircle, MoreHorizontal, Paperclip, Send, Share2, Smile, X } from 'lucide-react';

import Button from '../ui/Button';
import CommentItem from './CommentItem';

import { useModal } from '../../context/ModalContext';
import { getCommentsByPostId } from '../../services/commentsService';
import { useSimpleModalAnimation } from '../../animations/useModalAnimation';

const PostModal = () => {
  const { selectedPost: post, isPostModalOpen, closePostModal } = useModal();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState([]);

  const handleClose = useSimpleModalAnimation(isPostModalOpen, {
    overlayRef,
    containerRef: contentRef,
    onClose: closePostModal,
  });

  useEffect(() => {
    const fetchComments = async () => {
      if (post) {
        const comments = await getCommentsByPostId(post.id);
        setPostComments(comments);
      }
    };
    fetchComments();
  }, [post]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  if (!post && !isPostModalOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 opacity-0 pointer-events-none"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#050505] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        {/* Close Button Mobile */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all md:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* LEFT: Media Section */}
        <div className="w-full md:flex-1 bg-black flex items-center justify-center relative overflow-hidden h-[40vh] md:h-auto">
          <div className="modal-media w-full h-full flex items-center justify-center">
            {post?.image ? (
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-12 text-center">
                <p className="text-xl font-light text-text-dim italic">"{post?.content}"</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Detail Section */}
        <div className="w-full md:w-[400px] flex flex-col bg-bg-dark border-l border-white/10">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={post?.avatar} alt={post?.name} className="w-9 h-9 rounded-full border border-white/10" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white text-sm hover:underline cursor-pointer truncate max-w-[120px]">{post?.name}</span>
                  <span className="text-primary text-[10px] font-bold">· Follow</span>
                </div>
                <p className="text-text-dim text-xs truncate">@{post?.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors hidden md:block">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors hidden md:block">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
            
            {/* Caption */}
            <div className="modal-detail-item">
              <p className="text-white text-[14px] leading-relaxed mb-2">
                {post?.content}
              </p>
              <div className="flex flex-wrap gap-2 text-primary text-sm font-medium mb-3">
                <span>#webdesign</span> <span>#frontend</span> <span>#gsap</span>
              </div>
              <span className="text-text-dim text-[12px]">{post?.time} ago</span>
            </div>

            <div className="h-px bg-white/5" />

            {/* Engagement Stats */}
            <div className="modal-detail-item flex items-center gap-5 text-[13px]">
              <div><span className="font-bold text-white">{post?.likes}</span> <span className="text-text-dim">Likes</span></div>
              <div><span className="font-bold text-white">{post?.comments}</span> <span className="text-text-dim">Comments</span></div>
            </div>

            {/* Action Buttons */}
            <div className="modal-detail-item flex items-center justify-between border-y border-white/10 py-1">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-full transition-colors ${liked ? 'text-pink-500' : 'text-text-dim hover:text-white'}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 rounded-full text-text-dim hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full text-text-dim hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => setSaved(!saved)}
                className={`p-2 rounded-full transition-colors ${saved ? 'text-primary' : 'text-text-dim hover:text-white'}`}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Comments List */}
            <div className="modal-detail-item space-y-1 pb-4">
              <h4 className="font-bold text-white text-sm mb-4">Comments</h4>
              {postComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-white/10 bg-bg-dark">
            <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-2xl p-2">
              <button className="p-1.5 text-text-dim hover:text-primary transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <input 
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-600"
              />
              <Button 
                variant="ghost"
                size="sm"
                disabled={!commentText.trim()}
                className={`font-bold transition-all ${commentText.trim() ? 'text-primary' : 'text-gray-600'}`}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default PostModal;
