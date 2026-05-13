import React from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../../types/index.js'
import Avatar from '../ui/Avatar.jsx'
import FollowButton from '../ui/FollowButton.jsx'

interface UserListProps {
  users: User[]
  currentUser: User | null
  followingStatus: Record<string, boolean>
  onFollow: (userId: string) => void
  onUserSelect?: (userId: string) => void
}

const UserList = ({ users, currentUser, followingStatus, onFollow, onUserSelect }: UserListProps) => {
  const navigate = useNavigate()

  const handleUserClick = (userId: string) => {
    if (onUserSelect) {
      onUserSelect(userId)
      return
    }
    navigate(`/profile/${userId}`)
  }

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <div
          key={user._id}
          className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-white/5"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <button type="button" onClick={() => handleUserClick(user._id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
            <Avatar src={user.profilePicture} alt={user.fullName} name={user.fullName} size="lg" border />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-sm text-gray-400 truncate">@{user.email?.split('@')[0]}</p>
            </div>
          </button>

          {currentUser?._id !== user._id && (
            <div onClick={(e: MouseEvent) => e.stopPropagation()}>
              <FollowButton isFollowing={followingStatus[user._id]} isLoading={false} onFollow={() => onFollow(user._id)} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default UserList
