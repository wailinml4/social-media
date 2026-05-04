import React, { useRef } from 'react'

import { Heart, MessageCircle } from 'lucide-react'

import { useModal } from '../../context/ModalContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePosts } from '../../context/PostContext'
import { likePost, unlikePost } from '../../services/likeService'
import { useHoverScale } from '../../animations/useHoverScale'

const PostGrid = ({ items, user, large = false }) => {
  const { openPostModal } = useModal()
  const navigate = useNavigate()
  const { patchPostState } = usePosts()
  const clickTimerRef = useRef(null)
  const { handleMouseEnter, handleMouseLeave } = useHoverScale({ scale: 1.02 })

  const handlePostClick = item => {
    const author =
      item.author ||
      (user
        ? {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
          }
        : {
            _id: item.author?._id || item.authorId || item.user?._id || null,
            fullName: item.author?.fullName || item.name || item.user?.fullName || 'Unknown',
            email: item.author?.email || (item.handle ? `${item.handle}@example.com` : ''),
            profilePicture: item.author?.profilePicture || item.user?.profilePicture || null,
          })

    const post = {
      _id: item._id,
      id: item._id,
      author,
      name: author.fullName,
      handle: (author.email || '').split('@')[0],
      avatar: author.profilePicture,
      createdAt: item.createdAt,
      shareCount: item.shareCount || 0,
      time: new Date(item.createdAt).toLocaleDateString(),
      description: item.description || item.content,
      content: item.content,
      media:
        item.media ||
        (item.images || []).map(url => ({
          url,
          type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
        })),
      images: item.images || [],
      likeCount: item.likes?.length || 0,
      comments: item.comments?.length || 0,
      likes: item.likes?.length || 0,
      commentsCount: item.comments?.length || 0,
    }
    // update URL for deep-linking and open modal
    try {
      navigate(`/post/${post._id}`)
    } catch (err) {
      void err
    }
    openPostModal(post)
  }

  const toggleLike = async (item, e) => {
    e?.stopPropagation()
    if (!item._id) return

    const currentlyLiked = !!item.isLiked
    const currentCount = item.likeCount || item.likes?.length || 0 || 0

    // optimistic update
    try {
      patchPostState(item._id, {
        isLiked: !currentlyLiked,
        likeCount: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
      })
      if (currentlyLiked) {
        await unlikePost(item._id)
      } else {
        await likePost(item._id)
        toast.success('Post liked')
      }
    } catch (error) {
      // revert
      patchPostState(item._id, { isLiked: currentlyLiked, likeCount: currentCount })
      toast.error(error.message || 'Failed to update like')
    }
  }

  const handleClick = item => {
    // delay single-click action to allow double-click detection
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    clickTimerRef.current = setTimeout(() => {
      handlePostClick(item)
      clickTimerRef.current = null
    }, 200)
  }

  const handleDoubleClick = (e, item) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    toggleLike(item, e)
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-gray-400">No posts yet</p>
      </div>
    )
  }

  const gridClass = large
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 px-6'
    : 'grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 px-4'
  const cardRounded = large ? 'rounded-2xl' : 'rounded-xl'
  const overlayIconSize = large ? 'w-7 h-7' : 'w-6 h-6'

  return (
    <div className={gridClass}>
      {items.map(item => (
        <div
          key={item._id}
          className={`content-grid-anim group relative aspect-square overflow-hidden ${cardRounded} bg-white/5 border border-white/10 cursor-pointer`}
          onClick={() => handleClick(item)}
          onDoubleClick={e => handleDoubleClick(e, item)}
          onMouseEnter={e => {
            handleMouseEnter(e.currentTarget)
            const overlay = e.currentTarget.querySelector('.overlay')
            if (overlay) overlay.style.opacity = '1'
          }}
          onMouseLeave={e => {
            handleMouseLeave(e.currentTarget)
            const overlay = e.currentTarget.querySelector('.overlay')
            if (overlay) overlay.style.opacity = '0'
          }}
        >
          {item.media?.[0]?.url || item.images?.[0] ? (
            <img
              src={item.media?.[0]?.url || item.images[0]}
              alt={item.description || item.content}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <p className="text-gray-400 text-sm px-4 text-center line-clamp-3">{item.content}</p>
            </div>
          )}
          <div className="overlay absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center gap-6 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-white font-bold">
              <Heart className={`${overlayIconSize} fill-white`} />
              <span className={large ? 'text-lg' : ''}>{item.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostGrid
