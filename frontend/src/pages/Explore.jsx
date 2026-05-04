import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import PostGrid from '../components/profile/PostGrid'
import { usePosts } from '../context/PostContext'
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn'

const Explore = () => {
  const { explorePosts, isLoadingExplorePosts, fetchExplorePosts } = usePosts()
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchExplorePosts({ page: 1, limit: 12 })
        setCurrentPage(1)
        // Determine whether there are more pages to load
        if (!res || !res.pagination) {
          setHasMore(false)
        } else {
          setHasMore(res.pagination.pages > 1)
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load explore posts')
      }
    }
    load()
  }, [fetchExplorePosts])

  useStaggeredFadeIn(!isLoadingExplorePosts && explorePosts.length > 0, '.post-card-animate-in', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        if (target.isIntersecting && !isLoadingExplorePosts && explorePosts.length > 0 && hasMore) {
          const nextPage = currentPage + 1
          fetchExplorePosts({ page: nextPage, limit: 12 })
            .then(res => {
              setCurrentPage(nextPage)
              if (!res || !res.pagination) {
                setHasMore(false)
              } else if (res.posts.length < 12 || nextPage >= res.pagination.pages) {
                setHasMore(false)
              }
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
    <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-bg-dark">
      <div className="w-full max-w-[1100px] min-h-screen relative flex flex-col bg-bg-dark">
        <div className="bg-black/70 backdrop-blur-xl pt-6 pb-4 px-6 mb-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-white">Explore</h1>
        </div>

        <div className="pb-10">
          <PostGrid items={explorePosts} large />

          {isLoadingExplorePosts && <div className="p-6 text-center text-white/60">Loading...</div>}

          <div ref={loaderRef} className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}

export default Explore
