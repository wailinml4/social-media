import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { X } from 'lucide-react';

import PostModalHeader from './PostModalHeader';
import PostModalMedia from './PostModalMedia';
import PostModalCaption from './PostModalCaption';
import PostModalEngagement from './PostModalEngagement';
import PostComments from '../comments/PostComments';

import { useModal } from '../../../context/ModalContext';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostContext';
import { getCommentsByPostId } from '../../../services/commentsService';
import { useSimpleModalAnimation } from '../../../animations/useModalAnimation';
import { likePost, unlikePost, checkLikeStatus } from '../../../services/likeService';
import { bookmarkPost, unbookmarkPost, checkBookmarkStatus } from '../../../services/bookmarkService';
import { followUser, unfollowUser, checkFollowStatus } from '../../../services/followService';

const PostModal = () => {
  const { selectedPost: post, isPostModalOpen, closePostModal } = useModal();
  const { user: currentUser } = useAuth();
  const { deleteExistingPost, updateExistingPost } = usePosts();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [postComments, setPostComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  const isOwnPost = post?.author?._id === currentUser?._id;

  const handleClose = useSimpleModalAnimation(isPostModalOpen, {
    overlayRef,
    containerRef: contentRef,
    onClose: closePostModal,
  });

  useEffect(() => {
    const fetchComments = async () => {
      if (post) {
        try {
          setIsLoadingComments(true);
          const comments = await getCommentsByPostId(post.id);
          setPostComments(comments);
          setEditContent(post.content || '');
          setLikesCount(post.likeCount || 0);

          // Check like and bookmark status from API
          if (currentUser) {
            try {
              setIsCheckingStatus(true);
              const [isLiked, isBookmarked] = await Promise.all([
                checkLikeStatus(post._id),
                checkBookmarkStatus(post._id)
              ]);
              setLiked(isLiked);
              setSaved(isBookmarked);
            } catch (error) {
              toast.error('Failed to check post status');
            } finally {
              setIsCheckingStatus(false);
            }

            // Check follow status for post author
            if (!isOwnPost && post?.author?._id) {
              try {
                const followStatus = await checkFollowStatus(post.author._id);
                setIsFollowingAuthor(followStatus.data?.isFollowing || false);
              } catch (error) {
                toast.error('Failed to check follow status');
              }
            }
          }
        } catch (error) {
          toast.error('Failed to load comments');
        } finally {
          setIsLoadingComments(false);
        }
      }
    };
    fetchComments();
  }, [post, currentUser, isOwnPost]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleClose]);


  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await deleteExistingPost(post._id);
      toast.success('Post deleted successfully');
      closePostModal();
    } catch (error) {
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPost = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      setIsUpdating(true);
      await updateExistingPost(post._id, { content: editContent });
      toast.success('Post updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content || '');
  };

  const handleLike = async () => {
    if (!post || isLiking) return;

    try {
      setIsLiking(true);
      if (liked) {
        await unlikePost(post._id);
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likePost(post._id);
        setLiked(true);
        setLikesCount(prev => prev + 1);
        toast.success('Post liked');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update like');
      setLiked(!liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!post || isBookmarking) return;

    try {
      setIsBookmarking(true);
      if (saved) {
        await unbookmarkPost(post._id);
        setSaved(false);
      } else {
        await bookmarkPost(post._id);
        setSaved(true);
        toast.success('Post bookmarked');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update bookmark');
      setSaved(!saved);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleAddComment = (text) => {
    // Add comment logic here
    console.log('Add comment:', text);
  };

  const handleFollowAuthor = async () => {
    if (!post?.author?._id) return;

    try {
      setIsFollowingLoading(true);
      if (isFollowingAuthor) {
        await unfollowUser(post.author._id);
        setIsFollowingAuthor(false);
        toast.success('Unfollowed successfully');
      } else {
        await followUser(post.author._id);
        setIsFollowingAuthor(true);
        toast.success('Followed successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update follow status');
    } finally {
      setIsFollowingLoading(false);
    }
  };

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
        <PostModalMedia post={post} />

        {/* RIGHT: Detail Section */}
        <div className="w-full md:w-[400px] flex flex-col bg-bg-dark border-l border-white/10">
          <PostModalHeader
            post={post}
            onClose={handleClose}
            isOwnPost={isOwnPost}
            isFollowing={isFollowingAuthor}
            isFollowingLoading={isFollowingLoading}
            onFollow={handleFollowAuthor}
          />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
            <PostModalCaption
              post={post}
              isEditing={isEditing}
              editContent={editContent}
              onEditContentChange={setEditContent}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
            />

            <PostModalEngagement
              postId={post?._id}
              isOwnPost={isOwnPost}
              likesCount={likesCount}
              commentsCount={post?.comments}
              liked={liked}
              saved={saved}
              isLiking={isLiking}
              isBookmarking={isBookmarking}
              onLike={handleLike}
              onBookmark={handleSave}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
            />

            {/* Comments List */}
            <PostComments
              comments={postComments}
              isLoading={isLoadingComments}
              onAddComment={handleAddComment}
            />
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
