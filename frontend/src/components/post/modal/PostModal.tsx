import React, { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import PostModalHeader from './PostModalHeader.jsx'
import PostModalMedia from './PostModalMedia.jsx'
import PostModalCaption from './PostModalCaption.jsx'
import PostModalEngagement from './PostModalEngagement.jsx'
import PostComments from '../comments/PostComments.jsx'
import { useModal } from '../../../context/ModalContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { usePosts } from '../../../context/PostContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { getPostById } from '../../../services/postService.js'
import { getPostComments, createComment, updateComment, deleteComment, getCommentReplies } from '../../../services/commentService.js'
import { useSimpleModalAnimation } from '../../../animations/useModalAnimation.js'
import { likePost, unlikePost, checkLikeStatus } from '../../../services/likeService.js'
import { bookmarkPost, unbookmarkPost, checkBookmarkStatus } from '../../../services/bookmarkService.js'
import { followUser, unfollowUser, checkFollowStatus } from '../../../services/followService.js'
import type { Comment as DomainComment, User } from '../../../types/index.js'

interface CommentUser {
  _id: string
  id?: string
  fullName?: string
  profilePicture?: string
  avatar?: string
  name?: string
  handle?: string
  time?: string
}

interface Comment {
  _id?: string
  id?: string
  text: string
  user: CommentUser
  userId?: string
  time?: string
  likes?: string[]
  replies?: Comment[]
}

// Type conversion functions
const convertDomainCommentToLocal = (domainComment: DomainComment): Comment => ({
  _id: domainComment._id,
  id: domainComment.id,
  text: domainComment.text || domainComment.content || '',
  user: {
    _id: domainComment.user._id,
    id: domainComment.user.id,
    fullName: domainComment.user.fullName,
    profilePicture: domainComment.user.profilePicture,
    avatar: domainComment.user.avatar,
    name: domainComment.user.name,
    handle: domainComment.user.handle,
  },
  time: domainComment.createdAt,
  likes: [],
  replies: (domainComment.replies || []).map(convertDomainCommentToLocal),
})

const PostModal = () => {
  const { selectedPost: post, isPostModalOpen, closePostModal, openShareModal, openPostModal } = useModal()
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { deleteExistingPost, updateExistingPost, patchPostState } = usePosts()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [postComments, setPostComments] = useState<Comment[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [_isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [_isDeleting, setIsDeleting] = useState(false)
  const [_isUpdating, setIsUpdating] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false)
  const [isFollowingLoading, setIsFollowingLoading] = useState(false)

  const isOwnPost = post?.author?._id === currentUser?._id

  const handleClose = useSimpleModalAnimation(isPostModalOpen, {
    overlayRef,
    containerRef: contentRef,
    onClose: closePostModal,
  })

  useEffect(() => {
    const fetchComments = async () => {
      if (post) {
        try {
          setIsLoadingComments(true)
          const result = await getPostComments(post._id)

          // Load replies for each comment
          const commentsWithReplies = await Promise.all(
            (result.comments || []).map(async (domainComment: DomainComment): Promise<Comment> => {
              try {
                const repliesResult = await getCommentReplies(domainComment._id || domainComment.id || '')
                const convertedComment = convertDomainCommentToLocal(domainComment)
                return {
                  ...convertedComment,
                  replies: (repliesResult.replies || []).map(convertDomainCommentToLocal),
                }
              } catch (err) {
                void err
                // If loading replies fails, return comment with empty replies
                return convertDomainCommentToLocal(domainComment)
              }
            }),
          )

          setPostComments(commentsWithReplies)
          setEditContent(post.description || post.content || '')
          setLikesCount(post.likeCount || 0)

          // Check like and bookmark status from API
          if (currentUser) {
            try {
              setIsCheckingStatus(true)
              const [isLiked, isBookmarked] = await Promise.all([checkLikeStatus(post._id), checkBookmarkStatus(post._id)])
              setLiked(isLiked)
              setSaved(isBookmarked)
            } catch (err) {
              console.error(err)
              toast.error('Failed to check post status')
            } finally {
              setIsCheckingStatus(false)
            }

            // Check follow status for post author
            if (!isOwnPost && post?.author?._id) {
              try {
                const followStatus = await checkFollowStatus(post.author._id)
                setIsFollowingAuthor(followStatus.isFollowing || false)
              } catch (err) {
                console.error(err)
                toast.error('Failed to check follow status')
              }
            }
          }
        } catch (err) {
          console.error(err)
          toast.error('Failed to load comments')
        } finally {
          setIsLoadingComments(false)
        }
      }
    }
    fetchComments()
  }, [post, currentUser, isOwnPost])

  // Open modal when directly navigating to /post/:postId
  useEffect(() => {
    const match = location.pathname.match(/^\/post\/([^/]+)/)
    if (match) {
      const postId = match[1]
      if (!isPostModalOpen) {
        // If selected post is not present or doesn't match, fetch it and open modal
        if (!post || post._id !== postId) {
          ;(async () => {
            try {
              const fetched = await getPostById(postId)
              if (fetched) {
                openPostModal(fetched)
              } else {
                toast.error('Post not found')
                navigate(-1)
              }
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Failed to load post')
              navigate(-1)
            }
          })()
        }
      }
    }
  }, [location.pathname, isPostModalOpen, navigate, openPostModal, post])

  // When modal closes, if URL contains /post/:id, go back
  useEffect(() => {
    if (!isPostModalOpen && location.pathname.startsWith('/post/')) {
      try {
        navigate(-1)
      } catch (err) {
        void err
      }
    }
  }, [isPostModalOpen, location.pathname, navigate])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [handleClose])

  const handleDeletePost = async () => {
    if (!post) return
    try {
      setIsDeleting(true)
      await deleteExistingPost(post._id)
      toast.success('Post deleted successfully')
      closePostModal()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditPost = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!post) return
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
    setEditContent(post?.content || '')
  }

  const handleLike = async () => {
    if (!post || isLiking) return

    try {
      setIsLiking(true)
      let newLiked
      let newCount

      if (liked) {
        await unlikePost(post._id)
        newLiked = false
        newCount = Math.max(0, likesCount - 1)
        setLiked(false)
        setLikesCount(newCount)
      } else {
        await likePost(post._id)
        newLiked = true
        newCount = likesCount + 1
        setLiked(true)
        setLikesCount(newCount)
        toast.success('Post liked')
      }

      syncLikeState(newLiked, newCount)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update like')
      setLiked(!liked)
      setLikesCount((prev: number) => (liked ? prev + 1 : prev - 1))
    } finally {
      setIsLiking(false)
    }
  }

  const syncLikeState = (newLiked: boolean, newCount: number) => {
    if (!post) return
    patchPostState(post._id, { likeCount: newCount, isLiked: newLiked })
  }

  const handleShare = () => {
    if (!post) return
    openShareModal(post)
  }

  const handleSave = async () => {
    if (!post || isBookmarking) return

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
      toast.error(err instanceof Error ? err.message : 'Failed to update bookmark')
      setSaved(!saved)
    } finally {
      setIsBookmarking(false)
    }
  }

  const handleAddComment = async (text: string) => {
    if (!post || !text.trim()) return

    try {
      const newComment = await createComment(post._id, text)
      setPostComments(prev => [convertDomainCommentToLocal(newComment), ...prev])
      // Update post comment count in state
      if (post) {
        const newCount = (post.commentCount || 0) + 1
        patchPostState(post._id, { commentCount: newCount })
      }
      toast.success('Comment added successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add comment')
    }
  }

  const handleReply = async (parentId: string, text: string) => {
    if (!post || !text.trim()) return

    try {
      const newReply = await createComment(post._id, text, parentId)
      const convertedReply = convertDomainCommentToLocal(newReply)
      // Add reply to the parent comment's replies array
      setPostComments(prev =>
        prev.map((comment: Comment) => {
          if (comment._id === parentId || comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), convertedReply],
            }
          }
          return comment
        }),
      )
      // Update post comment count in state
      if (post) {
        const newCount = (post.commentCount || 0) + 1
        patchPostState(post._id, { commentCount: newCount })
      }
      toast.success('Reply added successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add reply')
    }
  }

  const handleEditComment = async (commentId: string, newText: string) => {
    try {
      await updateComment(commentId, newText)
      // Update comment in state
      setPostComments(prev =>
        prev.map((comment: Comment) => {
          if (comment._id === commentId || comment.id === commentId) {
            return { ...comment, text: newText }
          }
          // Also check in replies
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies?.map((reply: Comment) =>
                reply._id === commentId || reply.id === commentId ? { ...reply, text: newText } : reply,
              ),
            }
          }
          return comment
        }),
      )
      toast.success('Comment updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId)

      // Remove comment from state
      setPostComments(prev =>
        prev
          .map((comment: Comment) => {
            // If this is the comment being deleted, remove it
            if (comment._id === commentId || comment.id === commentId) {
              return null
            }
            // If this is a parent comment, remove the deleted reply from its replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies?.filter((reply: Comment) => reply._id !== commentId && reply.id !== commentId) || [],
              }
            }
            return comment
          })
          .filter((comment: Comment | null): comment is Comment => comment !== null),
      )

      // Update post comment count in state
      if (post) {
        const newCount = Math.max(0, (post.commentCount || 0) - 1)
        patchPostState(post._id, { commentCount: newCount })
      }

      toast.success('Comment deleted successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  const handleFollowAuthor = async () => {
    if (!post?.author?._id) return

    try {
      setIsFollowingLoading(true)
      if (isFollowingAuthor) {
        await unfollowUser(post.author._id)
        setIsFollowingAuthor(false)
        toast.success('Unfollowed successfully')
      } else {
        await followUser(post.author._id)
        setIsFollowingAuthor(true)
        toast.success('Followed successfully')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update follow status')
    } finally {
      setIsFollowingLoading(false)
    }
  }

  if (!post || !isPostModalOpen) return null

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 opacity-0 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" onClick={handleClose} />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-6xl h-full max-h-[90vh] spatial-panel flex flex-col md:flex-row p-0 overflow-hidden"
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
        <div className="w-full md:w-[400px] flex flex-col bg-transparent border-l border-white/10">
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
              commentsCount={post?.commentCount || postComments.length}
              shareCount={post?.shareCount || 0}
              liked={liked}
              saved={saved}
              isLiking={isLiking}
              isBookmarking={isBookmarking}
              onLike={handleLike}
              onBookmark={handleSave}
              onShare={handleShare}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
            />

            {/* Comments List */}
            <PostComments
              comments={postComments}
              isLoading={isLoadingComments}
              onAddComment={handleAddComment}
              onReply={handleReply}
              postId={post?._id}
              currentUserId={currentUser?._id || ''}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  )
}

export default PostModal
