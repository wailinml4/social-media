import React, { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getSuggestedUsers } from '../../services/userService.js'
import defaultAvatar from '../../assets/default-avatar.svg'
import { followUser, unfollowUser } from '../../services/followService.js'
import FollowButton from '../ui/FollowButton.jsx'
import Card from '../ui/Card.jsx'

interface SuggestedUserProps {
  name: string
  handle: string
  avatar: string
  userId: string
  isFollowing: boolean
  isFollowingLoading: boolean
  onFollow: () => void
}

const SuggestedUser = ({ name, handle, avatar, userId, isFollowing, isFollowingLoading, onFollow }: SuggestedUserProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${userId}`)}>
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white hover:underline">{name}</div>
          <div className="truncate text-sm text-text-dim">{handle}</div>
        </div>
      </div>
      <FollowButton isFollowing={isFollowing} isLoading={isFollowingLoading} onFollow={onFollow} variant="default" />
    </div>
  )
}

interface FormattedUser {
  name: string
  handle: string
  avatar: string
  userId: string
}

interface SuggestedUsersProps {
  className?: string
}

const SuggestedUsers = ({ className = '' }: SuggestedUsersProps) => {
  const [users, setUsers] = useState<FormattedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({})
  const [followingLoading, setFollowingLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const data = await getSuggestedUsers({ limit: 5 })
        const formattedUsers = (data.users || []).map(
          (user: { fullName?: string; email?: string; profilePicture?: string; _id?: string }) => ({
            name: user.fullName || 'Unknown',
            handle: user.email?.split('@')[0] || 'user',
            avatar: user.profilePicture || defaultAvatar,
            userId: user._id || '',
          }),
        )
        setUsers(formattedUsers)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to fetch suggested users')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSuggestedUsers()
  }, [])

  const handleFollow = async (userId: string) => {
    try {
      setFollowingLoading(prev => ({ ...prev, [userId]: true }))
      if (followingStatus[userId]) {
        await unfollowUser(userId)
        setFollowingStatus(prev => ({ ...prev, [userId]: false }))
        toast.success('User unfollowed')
      } else {
        await followUser(userId)
        setFollowingStatus(prev => ({ ...prev, [userId]: true }))
        toast.success('User followed')
      }
    } catch (err) {
      toast.error('Failed to update follow status')
      console.error('Follow error:', err)
    } finally {
      setFollowingLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  if (isLoading) {
    return (
      <Card
        className={`trending-sidebar-card mb-4 overflow-hidden border-white/10 bg-[#050505]/90 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl ${className}`}
      >
        <div className="px-5 pb-2 pt-5">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">Who to follow</h3>
        </div>
        <div className="px-5 py-4 text-sm text-text-dim">
          <div className="space-y-3">
            <div className="h-10 w-full rounded bg-white/6 animate-pulse motion-reduce:animate-none" />
            <div className="h-10 w-full rounded bg-white/6 animate-pulse motion-reduce:animate-none" />
            <div className="h-10 w-full rounded bg-white/6 animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`trending-sidebar-card mb-4 overflow-hidden border-white/10 bg-[#050505]/90 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl ${className}`}
    >
      <div className="px-5 pb-2 pt-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">Who to follow</h3>
      </div>

      <div className="px-5">
        {users.length > 0 ? (
          users.map((user: FormattedUser, index: number) => (
            <div key={user.userId || index} className={index !== users.length - 1 ? 'border-b border-white/10' : ''}>
              <SuggestedUser
                {...user}
                isFollowing={followingStatus[user.userId] || false}
                isFollowingLoading={followingLoading[user.userId] || false}
                onFollow={() => handleFollow(user.userId)}
              />
            </div>
          ))
        ) : (
          <div className="py-4 text-sm text-text-dim">No suggested users found</div>
        )}
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-sm text-white/64 transition-colors hover:bg-white/[0.03] hover:text-white cursor-pointer">
        Show more
      </div>
    </Card>
  )
}

export default SuggestedUsers
