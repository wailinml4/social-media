import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Link } from 'react-router-dom';

import { Repeat2 } from 'lucide-react';

import { useModal } from '../../../context/ModalContext';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostContext';
import { likePost, unlikePost, checkLikeStatus } from '../../../services/likeService';
import { bookmarkPost, unbookmarkPost, checkBookmarkStatus } from '../../../services/bookmarkService';
import Avatar from '../../ui/Avatar';
import PostActions from './PostActions';
import PostMediaCarousel from './PostMediaCarousel';
import PostAuthor from './PostAuthor';
import PostEditor from '../create/PostEditor';

const PostCard = ({ post }) => {
  const { openPostModal } = useModal();
  const { user: currentUser } = useAuth();
  const { deleteExistingPost, updateExistingPost } = usePosts();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  const isOwnPost = post.author?._id === currentUser?._id;

  // Check like and bookmark status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (post._id && currentUser) {
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
      }
    };
    checkStatus();
  }, [post._id, currentUser]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;

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
      // Revert state on error
      setLiked(!liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (isBookmarking) return;

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
      // Revert state on error
      setSaved(!saved);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await deleteExistingPost(post._id);
      toast.success('Post deleted successfully');
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

  const authorName = post.author?.fullName || post.name;
  const authorHandle = post.author?.email?.split('@')[0] || post.handle;
  const authorId = post.author?._id || post.authorId;

  return (
    <article className="post-card px-4 py-5 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 flex gap-4 w-full">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar
          src={post.author?.profilePicture || post.avatar}
          alt={authorName}
          name={authorName}
          size="lg"
          border
          to={`/profile/${authorId}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <PostAuthor
          author={{
            fullName: authorName,
            email: authorHandle ? `${authorHandle}@example.com` : post.author?.email,
            _id: authorId,
          }}
          time={post.time}
          onTimeClick={() => openPostModal(post)}
        />

        {/* Text Body - Clickable (Opens Modal) */}
        <div onClick={() => openPostModal(post)} className="cursor-pointer">
          {isEditing ? (
            <PostEditor
              content={editContent}
              onChange={setEditContent}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              isSaving={isUpdating}
            />
          ) : (
            <p className="text-gray-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
              {post.content}
            </p>
          )}

          {/* Media */}
          {post.images && post.images.length > 0 && (
            <PostMediaCarousel images={post.images} className="mb-3" />
          )}
        </div>

        {/* Actions */}
        <PostActions
          postId={post._id}
          isOwnPost={isOwnPost}
          likesCount={likesCount}
          commentsCount={post.comments}
          liked={liked}
          saved={saved}
          isLiking={isLiking}
          isBookmarking={isBookmarking}
          onLike={handleLike}
          onBookmark={handleSave}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
          showComments={true}
          showShare={true}
          variant="card"
        />
      </div>
    </article>
  );
};

export default PostCard;
