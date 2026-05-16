import React, { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../context/ModalContext.jsx'
import { useModalAnimation } from '../../animations/useModalAnimation.js'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import Spinner from '../loading/Spinner'
import UserList from './UserList.jsx'
import type { User } from '../../types/index.js'
import { getFollowers, getFollowees, getFriends, checkFollowStatus, followUser, unfollowUser } from '../../services/followService.js'

const FollowersModal = () => {
  const { isFollowersModalOpen, followersModalType, followersModalUserId, closeFollowersModal } = useModal()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const { isRendered } = useModalAnimation(isFollowersModalOpen, {
    overlayRef,
    modalRef,
  })

  const title = followersModalType === 'followers' ? 'Followers' : followersModalType === 'following' ? 'Following' : 'Friends'

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({})
  const followingStatusRef = useRef<Record<string, boolean>>({})

  const fetchUsers = useCallback(
    async (pageToFetch: number = 1) => {
      try {
        setLoading(true)
        let response
        if (followersModalType === 'followers') {
          response = await getFollowers(followersModalUserId || '', pageToFetch, 20)
        } else if (followersModalType === 'following') {
          response = await getFollowees(followersModalUserId || '', pageToFetch, 20)
        } else if (followersModalType === 'friends') {
          response = await getFriends(followersModalUserId || '', pageToFetch, 20)
        } else {
          response = { data: [] }
        }

        const newUsers =
          (response as { data?: { followers?: User[]; followees?: User[]; friends?: User[] } }).data?.followers ||
          (response as { data?: { followers?: User[]; followees?: User[]; friends?: User[] } }).data?.followees ||
          (response as { data?: { followers?: User[]; followees?: User[]; friends?: User[] } }).data?.friends ||
          []

        if (pageToFetch === 1) {
          setUsers(newUsers)
        } else {
          setUsers(prev => [...prev, ...newUsers])
        }

        setPage(pageToFetch)
        setHasMore(newUsers.length === 20)

        // Fetch follow status for users only if they're not already cached
        const uncachedUsers = newUsers.filter((user: User) => !(user._id in followingStatusRef.current))

        const newStatuses: Record<string, boolean> = {}
        for (const user of uncachedUsers) {
          try {
            const statusRes = await checkFollowStatus(user._id)
            newStatuses[user._id] = statusRes.isFollowing || false
          } catch (err) {
            void err
            newStatuses[user._id] = false
          }
        }
        if (Object.keys(newStatuses).length > 0) {
          followingStatusRef.current = { ...followingStatusRef.current, ...newStatuses }
          setFollowingStatus(prev => ({ ...prev, ...newStatuses }))
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        setLoading(false)
      }
    },
    [followersModalType, followersModalUserId],
  )

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchUsers(page + 1)
    }
  }

  const handleFollow = async (targetUserId: string) => {
    try {
      // Prevent self-follow
      if (currentUser?._id === targetUserId) {
        toast.error('You cannot follow yourself')
        return
      }

      const previousFollowingState = followingStatus[targetUserId] || false

      // Optimistic UI update
      setFollowingStatus(prev => ({ ...prev, [targetUserId]: !previousFollowingState }))

      try {
        if (previousFollowingState) {
          await unfollowUser(targetUserId)
          toast.success('Unfollowed successfully')
        } else {
          await followUser(targetUserId)
          toast.success('Followed successfully')
        }
      } catch (apiError) {
        // Revert optimistic update if API call fails
        setFollowingStatus(prev => ({ ...prev, [targetUserId]: previousFollowingState }))

        // Handle specific error cases
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error'
        if (errorMessage === 'Already following this user') {
          toast.error('You are already following this user')
        } else if (errorMessage === 'You cannot follow yourself') {
          toast.error('You cannot follow yourself')
        } else {
          throw apiError
        }
      }

      // Refetch follow status to ensure UI is in sync with backend
      const statusRes = await checkFollowStatus(targetUserId)
      setFollowingStatus(prev => ({ ...prev, [targetUserId]: statusRes.isFollowing }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage === 'Already following this user') {
        toast.error('You are already following this user')
      } else if (errorMessage === 'You cannot follow yourself') {
        toast.error('You cannot follow yourself')
      } else {
        toast.error(errorMessage || 'Failed to update follow status')
      }
    }
  }

  useEffect(() => {
    if (followersModalUserId && followersModalType) {
      setPage(1)
      setUsers([])
      setHasMore(true)
      followingStatusRef.current = {}
      setFollowingStatus({})
      fetchUsers(1)
    }
  }, [followersModalUserId, followersModalType, fetchUsers])

  useEffect(() => {
    if (!isFollowersModalOpen) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFollowersModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFollowersModalOpen, closeFollowersModal])

  if (!isRendered) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div ref={overlayRef} className="absolute inset-0 bg-black/40 backdrop-blur-xl" onClick={closeFollowersModal} />

      <div
        ref={modalRef}
        className="relative flex h-[100dvh] w-full flex-col spatial-panel sm:h-auto sm:max-h-[85vh] sm:max-w-[540px]"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
            <p className="mt-1 text-xs text-text-dim">
              {followersModalType === 'friends' ? 'Mutual follows' : `View ${title.toLowerCase()}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeFollowersModal}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 py-4 sm:px-5">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Spinner size="lg" label="Loading..." />
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {followersModalType === 'friends' ? 'No friends yet' : `No ${title.toLowerCase()} yet`}
                </p>
              </div>
            </div>
          ) : (
            <UserList
              users={users}
              currentUser={currentUser}
              followingStatus={followingStatus}
              onFollow={handleFollow}
              onUserSelect={(userId: string) => {
                closeFollowersModal()
                navigate(`/profile/${userId}`)
              }}
            />
          )}
        </div>

        {/* Footer */}
        {hasMore && users.length > 0 && (
          <div className="relative border-t border-white/5 bg-transparent px-4 py-3 sm:px-5">
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full rounded-full bg-white/5 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" inline /> : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowersModal
