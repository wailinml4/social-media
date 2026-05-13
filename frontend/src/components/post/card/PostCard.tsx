import React, { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MoreHorizontal, Edit3, Trash2 } from 'lucide-react'
import { useModal } from '../../../context/ModalContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { usePosts } from '../../../context/PostContext.jsx'
import { likePost, unlikePost, checkLikeStatus } from '../../../services/likeService.js'
import { bookmarkPost, unbookmarkPost, checkBookmarkStatus } from '../../../services/bookmarkService.js'
import PostActions from './PostActions.jsx'
import PostMediaCarousel from './PostMediaCarousel.jsx'
import PostAuthor from './PostAuthor.jsx'
import PostEditor from '../create/PostEditor.jsx'
import type { Post } from '../../../types/index.js'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { openPostModal, openShareModal, openConfirmModal } = useModal()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { deleteExistingPost, updateExistingPost, patchPostState } = usePosts()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likeCount || 0)
  const [shareCount, setShareCount] = useState(post.shareCount || 0)
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [editContent, setEditContent] = useState(post.description || post.content || '')
  const menuRef = useRef<HTMLDivElement>(null)

  const isOwnPost = post.author?._id === currentUser?._id

  // Check like and bookmark status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (post._id && currentUser) {
        try {
          const [isLiked, isBookmarked] = await Promise.all([checkLikeStatus(post._id), checkBookmarkStatus(post._id)])
          setLiked(isLiked)
          setSaved(isBookmarked)
        } catch (err) {
          console.error(err)
          toast.error('Failed to check post status')
        }
      }
    }
    checkStatus()
  }, [post._id, currentUser])

  useEffect(() => {
    setTimeout(() => {
      setLikesCount(post.likeCount || 0)
      setShareCount(post.shareCount || 0)
      if (typeof post.isLiked !== 'undefined') {
        setLiked(post.isLiked)
      }
      if (typeof post.isBookmarked !== 'undefined') {
        setSaved(post.isBookmarked)
      }
    }, 0)
  }, [post.likeCount, post.shareCount, post.isLiked, post.isBookmarked])

  const handleLike = async (e?: MouseEvent) => {
    e?.stopPropagation()
    if (isLiking) return

    try {
      setIsLiking(true)
      if (liked) {
        await unlikePost(post._id)
        setLiked(false)
        setLikesCount((prev: number) => Math.max(0, prev - 1))
        patchPostState(post._id, { likeCount: Math.max(0, likesCount - 1), isLiked: false })
      } else {
        await likePost(post._id)
        setLiked(true)
        setLikesCount((prev: number) => prev + 1)
        patchPostState(post._id, { likeCount: likesCount + 1, isLiked: true })
        toast.success('Post liked')
      }
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Failed to update like')
      // Revert state on error
      setLiked(!liked)
      setLikesCount((prev: number) => (liked ? prev + 1 : prev - 1))
    } finally {
      setIsLiking(false)
    }
  }

  const handleSave = async (e?: MouseEvent) => {
    e?.stopPropagation()
    if (isBookmarking) return

    try {
      setIsBookmarking(true)
      if (saved) {
        await unbookmarkPost(post._id)
        setSaved(false)
        patchPostState(post._id, { isBookmarked: false })
      } else {
        await bookmarkPost(post._id)
        setSaved(true)
        patchPostState(post._id, { isBookmarked: true })
        toast.success('Post bookmarked')
      }
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Failed to update bookmark')
      // Revert state on error
      setSaved(!saved)
    } finally {
      setIsBookmarking(false)
    }
  }

  const handleDeletePost = () => {
    setIsMenuOpen(false)

    openConfirmModal({
      title: 'Delete post',
      message: 'This action will permanently remove your post. Are you sure?',
      onConfirm: async () => {
        try {
          await deleteExistingPost(post._id)
          toast.success('Post deleted successfully')
        } catch (err) {
          console.error(err)
          toast.error(err instanceof Error ? err.message : 'Failed to delete post')
        }
      },
    })
  }

  const handleEditPost = () => {
    setIsMenuOpen(false)
    setIsEditing(true)
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (!(event.target instanceof Node)) return
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const handleSaveEdit = async () => {
    try {
      setIsUpdating(true)
      await updateExistingPost(post._id, { description: editContent })
      toast.success('Post updated successfully')
      setIsEditing(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update post')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(post.description || post.content || '')
  }

  const handleOpenPost = (e?: React.MouseEvent) => {
    if (e?.target instanceof Element && e.target.closest('button, a, svg, input, textarea')) return
    try {
      navigate(`/post/${post._id}`)
    } catch (e) {
      void e
    }
    openPostModal(post)
  }

  const authorName = post.author?.fullName || post.author?.name
  const authorHandle = post.author?.email?.split('@')[0] || post.author?.handle
  const authorId = post.author?._id

  return (
    <article
      onClick={handleOpenPost}
      className="post-card w-full rounded-3xl border border-white/10 bg-[#070707] shadow-[0_24px_80px_rgba(0,0,0,0.38)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_110px_rgba(0,0,0,0.45)] duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative p-5" ref={menuRef}>
        <PostAuthor
          author={{
            fullName: authorName,
            email: authorHandle ? `${authorHandle}@example.com` : post.author?.email,
            _id: authorId,
            profilePicture: post.author?.profilePicture,
          }}
          time={post.createdAt}
          onTimeClick={() => {
            try {
              navigate(`/post/${post._id}`)
            } catch (e) {
              void e
            }
            openPostModal(post)
          }}
        />

        {isOwnPost && (
          <div className="absolute right-5 top-5 z-10 text-right">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-xl">
                <button
                  type="button"
                  onClick={handleEditPost}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDeletePost}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.media && post.media.length > 0 ? (
        <div className="border-t border-b border-white/10 bg-transparent">
          <PostMediaCarousel images={post.media} className="max-h-[600px]" onDoubleClick={handleLike} />
        </div>
      ) : null}

      <div className="p-5">
        {isEditing ? (
          <PostEditor
            content={editContent}
            onChange={setEditContent}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            isSaving={isUpdating}
          />
        ) : (
          <p className="text-gray-200 text-[15px] leading-7 mb-5 whitespace-pre-wrap">{post.description || post.content}</p>
        )}

        <div className="flex flex-col gap-3 w-full">
          <PostActions
            postId={post._id}
            isOwnPost={isOwnPost}
            likesCount={likesCount}
            commentsCount={post.commentCount || 0}
            shareCount={shareCount}
            liked={liked}
            saved={saved}
            isLiking={isLiking}
            isBookmarking={isBookmarking}
            onLike={handleLike}
            onBookmark={handleSave}
            onComment={() => {
              try {
                navigate(`/post/${post._id}`)
              } catch (e) {
                void e
              }
              openPostModal(post)
            }}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            onShare={() => openShareModal(post)}
            showComments={true}
            showShare={true}
            variant="card"
          />
        </div>
      </div>
    </article>
  )
}

export default PostCard
