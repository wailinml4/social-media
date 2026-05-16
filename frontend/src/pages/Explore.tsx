import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import type { PaginatedResponse } from '../types'

import PostGrid from '../components/profile/PostGrid.jsx'
import Spinner from '../components/loading/Spinner'
import Skeleton from '../components/loading/Skeleton'
import { usePosts } from '../context/PostContext.jsx'
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn.js'

const Explore = () => {
  const { explorePosts, isLoadingExplorePosts, fetchExplorePosts } = usePosts()
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchExplorePosts({ page: 1, limit: 12 })
        setCurrentPage(1)
        setHasMore(1 < response.pagination.pages)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load explore posts')
      }
    }
    load()
  }, [fetchExplorePosts])

  useStaggeredFadeIn(!isLoadingExplorePosts && (explorePosts?.length || 0) > 0, '.post-card-animate-in', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoadingExplorePosts && (explorePosts?.length || 0) > 0 && hasMore) {
          const nextPage = currentPage + 1
          fetchExplorePosts({ page: nextPage, limit: 12 })
            .then(response => {
              setCurrentPage(nextPage)
              setHasMore(nextPage < response.pagination.pages)
            })
            .catch(() => void 0)
        }
      },
      { threshold: 0.5 },
    )

    const node = loaderRef.current
    if (node) observer.observe(node)
    return () => {
      if (node) observer.unobserve(node)
    }
  }, [currentPage, explorePosts, fetchExplorePosts, isLoadingExplorePosts, hasMore])

  return (
    <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-transparent">
      <div className="w-full max-w-[1100px] min-h-screen relative flex flex-col bg-transparent">
        <div className="spatial-panel mx-4 md:mx-6 mt-6 py-5 px-6 mb-6">
          <h1 className="text-2xl font-bold text-white">Explore</h1>
        </div>

        <div className="pb-10 px-4 md:px-6">
          <PostGrid items={explorePosts || []} large />

          {isLoadingExplorePosts && (
            <div className="p-6 text-center text-white/60">
              <Skeleton rows={6} />
            </div>
          )}

          <div ref={loaderRef} className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}

export default Explore
