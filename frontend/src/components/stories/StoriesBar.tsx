import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import StoryViewer from './StoryViewer.jsx'
import { useStoryAvatarAnimation } from '../../animations/useStoryAvatarAnimation.js'
import { getStories, markStoryViewed, getStoryResumeSlideIndex, clearStoryResumeSlideIndex } from '../../services/storyService.js'
import { getFriends } from '../../services/followService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import type { User, Story, StorySlide } from '../../types/index.js'
import defaultAvatar from '../../assets/default-avatar.svg'

interface StoryUser {
  name: string
  avatar?: string
  profilePicture?: string
  id?: string
  _id?: string
  uuid?: string
}

interface StoryItem {
  id?: string
  user: StoryUser
  seen: boolean
}

// Convert domain Story to local StoryItem
const convertStoryToStoryItem = (story: Story, currentUser: User): StoryItem => {
  // API returns story.user (from controller formatStory), but Story type uses story.author
  const authorSource =
    (
      story as unknown as {
        user?: { id?: string; _id?: string; name?: string; fullName?: string; avatar?: string; profilePicture?: string }
      }
    ).user || story.author
  return {
    id: story._id || story.id,
    user: {
      name: authorSource?.fullName || (authorSource as { name?: string })?.name || 'Unknown',
      avatar: authorSource?.avatar || authorSource?.profilePicture,
      profilePicture: authorSource?.profilePicture || authorSource?.avatar,
      id: authorSource?.id,
      _id: authorSource?._id,
    },
    seen: Array.isArray(story.viewedBy) ? story.viewedBy.includes(currentUser._id) : !!(story as unknown as { seen?: boolean }).seen,
  }
}

interface StoryAvatarProps {
  story: StoryItem
  index: number
  onClick: (index: number) => void
}

const StoryAvatar = ({ story, index, onClick }: StoryAvatarProps) => {
  const avatarRef = useRef<HTMLButtonElement>(null)
  const seen = story.seen

  const { handleMouseEnter, handleMouseLeave, handleClick } = useStoryAvatarAnimation(avatarRef, () => onClick(index))

  return (
    <button
      ref={avatarRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
      aria-label={`View ${story.user.name}'s story`}
    >
      {/* Ring + avatar */}
      <div
        className="relative w-[68px] h-[68px] rounded-full p-[3px]"
        style={{
          background: seen ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, #a78bfa 0%, #818cf8 35%, #38bdf8 100%)',
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-[2px] border-neutral-950">
          <img
            src={story.user.avatar || story.user.profilePicture || defaultAvatar}
            alt={story.user.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        {/* Seen indicator — faint ring */}
        {seen && <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />}
      </div>

      {/* Username label */}
      <span
        className="text-[11px] font-medium leading-none max-w-[64px] truncate"
        style={{ color: seen ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)' }}
      >
        {story.user.name.split(' ')[0]}
      </span>
    </button>
  )
}

interface StoriesBarProps {
  activeTab?: string
}

const StoriesBar = ({ activeTab = 'following' }: StoriesBarProps) => {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [startSlideIndex, setStartSlideIndex] = useState(0)
  const [stories, setStories] = useState<StoryItem[]>([])
  const [rawStories, setRawStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Convert domain stories to local StoryItems
  const convertStories = useCallback(
    (domainStories: Story[]): StoryItem[] => {
      if (!user) return []
      return domainStories.map(story => convertStoryToStoryItem(story, user))
    },
    [user],
  )

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true)

        // Default: fetch stories from users you follow
        const data = await getStories()

        // If the active tab is 'friends', filter to mutual follows only
        if (activeTab === 'friends') {
          if (!user || !user._id) {
            setStories([])
            setError(null)
            return
          }

          try {
            const friendsResp = await getFriends(user._id, 1, 1000)
            const friendUsers = friendsResp.friends || []

            // Guard against null/undefined entries in friends list.
            const friendIds = friendUsers
              .filter(Boolean)
              .map((f: User | string) => {
                if (typeof f === 'string') return f.toString()
                const id = f._id ?? f.id
                return id ? id.toString() : null
              })
              .filter((id): id is string => Boolean(id))

            const filtered = convertStories(data).filter((story: StoryItem) => {
              const uid = story.user.id || story.user._id || story.user.uuid
              return uid ? friendIds.includes(uid.toString()) : false
            })
            setRawStories(data)
            setStories(filtered)
            setError(null)
            return
          } catch (err) {
            // If friend fetch fails, fall back to empty or default set
            setError(err instanceof Error ? err.message : 'Unable to load friends')
            setStories([])
            return
          }
        }

        // for 'following' (and any other non-friends tab), show the fetched stories
        setRawStories(data)
        setStories(convertStories(data))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load stories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [activeTab, user, convertStories])

  const openStory = (index: number) => {
    const storyId = stories[index]?.id
    const resumeIndex = storyId ? getStoryResumeSlideIndex(storyId) : 0
    setActiveStoryIndex(index)
    setStartSlideIndex(resumeIndex)
    setViewerOpen(true)
  }

  const handleStoryComplete = async (storyId: string, completedStoryIndex: number) => {
    const story = stories[completedStoryIndex]
    if (!story || story.seen) {
      return
    }

    setStories(prev => prev.map((s, i) => (i === completedStoryIndex ? { ...s, seen: true } : s)))

    await markStoryViewed(storyId).catch(() => void 0)

    clearStoryResumeSlideIndex(storyId)
  }

  const closeViewer = () => {
    setViewerOpen(false)
  }

  return (
    <>
      <div className="relative w-full rounded-3xl border border-white/10 bg-[#050505]/80 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-dark to-transparent pointer-events-none z-10" />

        <div ref={scrollRef} className="flex items-end gap-4 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {isLoading ? (
            <div className="text-sm text-white/50">Loading stories...</div>
          ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : stories.length === 0 ? (
            <div className="text-sm text-white/50">Follow users to see stories from your network.</div>
          ) : (
            stories.map((story, i) => <StoryAvatar key={story.id} story={story} index={i} onClick={openStory} />)
          )}
        </div>
      </div>

      {viewerOpen && stories.length > 0 && (
        <StoryViewer
          stories={rawStories.map((raw, i) => ({
            id: raw._id || raw.id || stories[i]?.id,
            user: {
              _id: stories[i]?.user.id || stories[i]?.user._id,
              fullName: stories[i]?.user.name,
              profilePicture: stories[i]?.user.avatar || stories[i]?.user.profilePicture,
            },
            createdAt: (raw as unknown as { createdAt?: string }).createdAt || '',
            slides: (raw.slides || []).map((s: StorySlide) => ({
              id: s._id || s.id,
              mediaUrl: s.mediaUrl || s.url,
              type: s.type,
              caption: s.caption,
              duration: s.duration,
              timestamp: s.timestamp,
            })),
          }))}
          startIndex={activeStoryIndex}
          startSlideIndex={startSlideIndex}
          onStoryChange={setActiveStoryIndex}
          onClose={closeViewer}
          onComplete={handleStoryComplete}
        />
      )}
    </>
  )
}

export default StoriesBar
