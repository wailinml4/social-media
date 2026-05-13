import React, { useRef } from 'react'
import type { MouseEvent } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { useModal } from '../../context/ModalContext.jsx'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePosts } from '../../context/PostContext.jsx'
import { likePost, unlikePost } from '../../services/likeService.js'
import { useHoverScale } from '../../animations/useHoverScale.js'
import type { User, Post, Media } from '../../types/index.js'

interface PostItem {
  _id: string
  author?: User
  authorId?: string
  user?: User
  name?: string
  handle?: string
  description?: string
  content?: string
  createdAt: string
  shareCount?: number
  media?: Media[]
  images?: string[]
  likes?: string[]
  comments?: string[]
  isLiked?: boolean
  likeCount?: number
}

interface PostGridProps {
  items: PostItem[]
  user?: User
  large?: boolean
}

const PostGrid = ({ items, user, large = false }: PostGridProps) => {
  const { openPostModal } = useModal()
  const navigate = useNavigate()
  const { patchPostState } = usePosts()
  const clickTimerRef = useRef<number | null>(null)
  const { handleMouseEnter, handleMouseLeave } = useHoverScale({ scale: 1.02 })

  const handlePostClick = (item: PostItem) => {
    const author: User = (() => {
      if (item.author) {
        return item.author
      }
      if (user) {
        return user
      }
      // Fallback author object
      return {
        _id: item.authorId || '',
        fullName: item.name || 'Unknown',
        email: item.handle ? `${item.handle}@example.com` : '',
        profilePicture: undefined,
        followerCount: 0,
        followingCount: 0,
        friendsCount: 0,
        postCount: 0,
        isOnline: false,
        isVerified: false,
        createdAt: '',
        updatedAt: '',
      }
    })()

    const post: Post = {
      _id: item._id,
      author: author,
      description: item.description || item.content || '',
      content: item.content,
      media:
        item.media ||
        (item.images || []).map((url: string) => ({
          url,
          type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
        })),
      images: item.images || [],
      likeCount: item.likes?.length || 0,
      bookmarkCount: 0,
      commentCount: item.comments?.length || 0,
      shareCount: item.shareCount || 0,
      isLiked: item.isLiked,
      isBookmarked: false,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
    }
    // update URL for deep-linking and open modal
    try {
      navigate(`/post/${post._id}`)
    } catch (err) {
      void err
    }
    openPostModal(post)
  }

  const toggleLike = async (item: PostItem, e: MouseEvent) => {
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
    } catch (err) {
      // revert
      patchPostState(item._id, { isLiked: currentlyLiked, likeCount: currentCount })
      toast.error(err instanceof Error ? err.message : 'Failed to update like')
    }
  }

  const handleClick = (item: PostItem) => {
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

  const handleDoubleClick = (e: MouseEvent, item: PostItem) => {
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
          onDoubleClick={(e: MouseEvent) => handleDoubleClick(e, item)}
          onMouseEnter={e => {
            handleMouseEnter(e.currentTarget)
            const overlay = e.currentTarget.querySelector<HTMLElement>('.overlay')
            if (overlay) overlay.style.opacity = '1'
          }}
          onMouseLeave={e => {
            handleMouseLeave(e.currentTarget)
            const overlay = e.currentTarget.querySelector<HTMLElement>('.overlay')
            if (overlay) overlay.style.opacity = '0'
          }}
        >
          {item.media?.[0]?.url || item.images?.[0] ? (
            <img
              src={item.media?.[0]?.url || item.images?.[0] || ''}
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
