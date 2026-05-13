import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { RefObject } from 'react'
import toast from 'react-hot-toast'
import type { Post } from '../types'

import PostCard from '../components/post/card/PostCard.jsx'
import PostSkeleton from '../components/loading/skeletons/PostSkeleton'
import StoriesBar from '../components/stories/StoriesBar.jsx'
import Tabs from '../components/ui/Tabs.jsx'

import { usePosts } from '../context/PostContext.jsx'
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn.js'

const FEED_MAX_WIDTH = 600

const Home = () => {
  const { error, fetchFollowingPosts, followingPosts, isLoadingFollowingPosts, fetchFriendsPosts, friendsPosts, isLoadingFriendsPosts } =
    usePosts()
  const [activeTab, setActiveTab] = useState('following')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const feedRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  const homeTabs = [
    { id: 'following', label: 'Following' },
    { id: 'friends', label: 'Friends' },
  ]

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setCurrentPage(1)
  }

  // Initial Load
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        let res = null
        if (activeTab === 'following') {
          res = await fetchFollowingPosts({ page: 1, limit: 3 })
        } else {
          res = await fetchFriendsPosts({ page: 1, limit: 3 })
        }

        // Determine whether there are more pages to load
        if (!res || !res.pagination) {
          setHasMore((res && Array.isArray(res.posts) && res.posts.length >= 3) || false)
        } else {
          setHasMore(res.pagination.page < res.pagination.pages)
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load posts. Please try again.')
      }
    }
    fetchInitialPosts()
  }, [activeTab, fetchFollowingPosts, fetchFriendsPosts])

  // GSAP Animation for newly loaded posts
  const currentPosts = activeTab === 'following' ? followingPosts : friendsPosts
  const currentIsLoading = activeTab === 'following' ? isLoadingFollowingPosts : isLoadingFriendsPosts

  useStaggeredFadeIn(!currentIsLoading && (currentPosts?.length || 0) > 0, '.post-card-animate-in', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    clearProps: 'all',
  })

  // Infinite Scroll helper: load more posts
  const loadMorePosts = useCallback(async () => {
    try {
      const nextPage = currentPage + 1
      let res = null
      if (activeTab === 'following') {
        res = await fetchFollowingPosts({ page: nextPage, limit: 2 })
      } else {
        res = await fetchFriendsPosts({ page: nextPage, limit: 2 })
      }

      setCurrentPage(nextPage)

      // Stop loading if API indicates there are no more pages or fewer items returned than requested
      if (!res || !res.pagination) {
        if (!res || !Array.isArray(res.posts) || res.posts.length < 2) setHasMore(false)
      } else {
        if (nextPage >= res.pagination.pages || (Array.isArray(res.posts) && res.posts.length < 2)) setHasMore(false)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load more posts. Please try again.')
    }
  }, [currentPage, activeTab, fetchFollowingPosts, fetchFriendsPosts])

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const target = entries[0]
        if (target.isIntersecting && !currentIsLoading && (currentPosts?.length || 0) > 0 && hasMore) {
          loadMorePosts()
        }
      },
      { threshold: 0.5 },
    )

    const node = loaderRef.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [currentIsLoading, currentPosts, activeTab, fetchFollowingPosts, fetchFriendsPosts, hasMore, loadMorePosts])

  return (
    <div className="relative min-h-screen w-full overflow-x-clip pb-20 sm:pb-0 bg-bg-dark flex justify-center">
      {/* Main Feed Column */}
      <div className="relative flex min-h-screen w-full flex-col bg-bg-dark" style={{ maxWidth: `${FEED_MAX_WIDTH}px` }}>
        {/* Header (not sticky) */}
        <div className="bg-black/70 backdrop-blur-xl pt-6 pb-4 space-y-4">
          <Tabs tabs={homeTabs} activeTab={activeTab} onTabChange={onTabChange} />

          <StoriesBar activeTab={activeTab} />
        </div>

        {/* Feed List */}
        <div ref={feedRef} className="flex-1 space-y-6">
          {error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Failed to load posts</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {(currentPosts || []).map((post: Post) => (
                <div key={post._id} className="post-card-animate-in">
                  <PostCard post={post} />
                </div>
              ))}

              {currentIsLoading && (
                <div className="flex flex-col">
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              )}

              {/* Invisible target for intersection observer */}
              <div ref={loaderRef} className="h-20 w-full" />

              {!currentIsLoading && (currentPosts?.length || 0) === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📭</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-4">There are no posts in this feed right now.</p>
                </div>
              )}

              {!currentIsLoading && (currentPosts?.length || 0) > 0 && (
                <div className="border-b border-white/10 p-8 text-center text-sm text-white/40">You&apos;re all caught up!</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
