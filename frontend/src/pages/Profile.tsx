import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { User, Story } from '../types'
import type { StorySlide } from '../types'

import { Bookmark, Grid, Heart } from 'lucide-react'

import PostGrid from '../components/profile/PostGrid.jsx'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import ProfileSkeleton from '../components/loading/skeletons/ProfileSkeleton'
import ProfileStats from '../components/profile/ProfileStats.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import StoryViewer from '../components/stories/StoryViewer.jsx'

import { getCurrentProfile, getProfileById } from '../services/userService.js'
import {
  getUserStories,
  deleteStorySlide,
  getStoryResumeSlideIndex,
  clearStoryResumeSlideIndex,
  markStoryViewed,
} from '../services/storyService.js'
import { useProfileAnimation } from '../animations/useStaggeredFadeIn.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePosts } from '../context/PostContext.jsx'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const { userPosts, bookmarkedPosts, likedPosts, fetchUserPosts, fetchBookmarkedPosts, fetchLikedPosts } = usePosts()
  const [activeTab, setActiveTab] = useState('posts')
  const [profileData, setProfileData] = useState<{ user: User } | null>(null)
  const [userStories, setUserStories] = useState<Story[]>([])
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false)
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [startSlideIndex, setStartSlideIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)

        const user = userId ? await getProfileById(userId) : await getCurrentProfile()
        setProfileData({ user })

        const fetches = [
          fetchUserPosts({ userId: user._id, page: 1, limit: 100 }),
          fetchBookmarkedPosts({ userId: user._id, page: 1, limit: 100 }),
        ]

        if (!userId || user._id === currentUser?._id) {
          fetches.push(fetchLikedPosts({ page: 1, limit: 100 }))
        }

        const storiesPromise = getUserStories(user._id).catch(() => [])

        await Promise.all(fetches)
        const stories = await storiesPromise
        setUserStories(stories || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
        toast.error('Failed to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    // listen for profile updates and refresh local profileData
    const handleProfileUpdated = (e: Event) => {
      if (!(e instanceof CustomEvent) || !e.detail) return
      setProfileData({ user: e.detail as User })
    }

    window.addEventListener('profile-updated', handleProfileUpdated)

    fetchProfileData()

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdated)
    }
  }, [userId, fetchUserPosts, fetchBookmarkedPosts, fetchLikedPosts, currentUser?._id])

  const user = profileData?.user
  const isOwnProfile = !userId || user?._id === currentUser?._id

  const profileTabs = [
    { id: 'posts', label: 'Posts', icon: Grid },
    ...(isOwnProfile ? [{ id: 'liked', label: 'Liked', icon: Heart }] : []),
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  ]

  useProfileAnimation(!!user && !loading, profileRef)

  const openProfileStories = () => {
    if (!userStories.length) return

    const resumeIndex = getStoryResumeSlideIndex(userStories[0]._id)
    setActiveStoryIndex(0)
    setStartSlideIndex(resumeIndex)
    setIsStoryViewerOpen(true)
  }

  const handleDeleteStorySlide = async (slideId: string, storyIndex: number) => {
    try {
      await deleteStorySlide(slideId)
      setUserStories((prevStories: Story[]) => {
        const nextStories = [...prevStories]
        const story = nextStories[storyIndex]
        if (!story) return prevStories

        const updatedSlides = story.slides.filter((slide: StorySlide) => slide._id !== slideId)
        if (updatedSlides.length === 0) {
          nextStories.splice(storyIndex, 1)
        } else {
          nextStories[storyIndex] = { ...story, slides: updatedSlides }
        }

        return nextStories
      })
      toast.success('Story slide deleted successfully')
    } catch (deleteError) {
      toast.error(deleteError instanceof Error ? deleteError.message : 'Failed to delete story')
    }
  }

  const handleStoryComplete = async (storyId: string, completedStoryIndex: number) => {
    const story = userStories[completedStoryIndex]
    if (!story || story.viewedBy.includes(currentUser?._id || '')) return

    setUserStories((prevStories: Story[]) =>
      prevStories.map((s: Story, index: number) => {
        if (index === completedStoryIndex && !s.viewedBy.includes(currentUser?._id || '')) {
          return { ...s, viewedBy: [...s.viewedBy, currentUser?._id || ''] }
        }
        return s
      }),
    )

    await markStoryViewed(storyId).catch(() => void 0)
    clearStoryResumeSlideIndex(storyId)
  }

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false)
  }

  useEffect(() => {
    if (isStoryViewerOpen && userStories.length === 0) {
      setTimeout(() => setIsStoryViewerOpen(false), 0)
    }
  }, [isStoryViewerOpen, userStories.length])

  const onTabChange = (tabId: string) => {
    if (tabId === activeTab) return
    setActiveTab(tabId)
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error || !user) {
    return (
      <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-transparent">
        <div className="w-full max-w-[1100px] min-h-screen relative flex flex-col bg-transparent p-8">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Failed to load profile</h3>
            <p className="text-gray-500 mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="spatial-button px-4 py-2"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={profileRef} className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-transparent">
      <div className="w-full max-w-[1100px] min-h-screen relative flex flex-col bg-transparent">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} hasStory={userStories.length > 0} onAvatarClick={openProfileStories} />

        {/* Stats Grid */}
        <ProfileStats stats={user} />

        {/* Tab Navigation */}
        <div className="px-4 md:px-6">
          <Tabs
            tabs={profileTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            className="-mx-4 md:-mx-6 px-4 md:px-6 mb-6"
          />
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="pb-10 px-4 md:px-6">
          {activeTab === 'posts' && <PostGrid items={userPosts || []} user={user} large />}
          {activeTab === 'liked' &&
            ((likedPosts?.length || 0) > 0 ? (
              <PostGrid items={likedPosts || []} user={user} large />
            ) : (
              <div className="content-grid-anim flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your liked posts will appear here</h3>
                <p className="text-gray-400 max-w-xs">Like posts to save them here for quick reference later.</p>
              </div>
            ))}
          {activeTab === 'bookmarks' &&
            ((bookmarkedPosts?.length || 0) > 0 ? (
              <PostGrid items={bookmarkedPosts || []} user={user} large />
            ) : (
              <div className="content-grid-anim flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Bookmark className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Save posts for later</h3>
                <p className="text-gray-400 max-w-xs">Don't let the good stuff disappear! Bookmark posts to easily find them later.</p>
              </div>
            ))}
          {/* 'About' tab removed as requested */}
        </div>
      </div>

      {isStoryViewerOpen && userStories.length > 0 && (
        <StoryViewer
          stories={userStories}
          startIndex={activeStoryIndex}
          startSlideIndex={startSlideIndex}
          canDelete={isOwnProfile}
          onDelete={handleDeleteStorySlide}
          onStoryChange={setActiveStoryIndex}
          onClose={closeStoryViewer}
          onComplete={handleStoryComplete}
        />
      )}
    </div>
  )
}

export default Profile
