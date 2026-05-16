import React, { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { Calendar, Edit3, MapPin, MessageCircle } from 'lucide-react'
import type { User } from '../../types/index.js'
import Button from '../ui/Button.jsx'
import FollowButton from '../ui/FollowButton.jsx'
import { useModal } from '../../context/ModalContext.jsx'
import { followUser, unfollowUser, checkFollowStatus } from '../../services/followService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import defaultAvatar from '../../assets/default-avatar.svg'

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
  onAvatarClick: () => void
  hasStory?: boolean
}

const ProfileHeader = ({ user, isOwnProfile, onAvatarClick, hasStory = false }: ProfileHeaderProps) => {
  const { openEditProfileModal } = useModal()
  const { user: currentUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOwnProfile && currentUser) {
      checkFollowStatus(user._id)
        .then(response => {
          setIsFollowing(response.isFollowing)
        })
        .catch(() => console.error('Failed to check follow status'))
    }
  }, [user._id, isOwnProfile, currentUser])

  const handleFollow = async () => {
    if (currentUser?._id === user._id) {
      toast.error('You cannot follow yourself')
      return
    }

    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser(user._id)
        setIsFollowing(false)
        toast.success('Unfollowed successfully')
      } else {
        await followUser(user._id)
        setIsFollowing(true)
        toast.success('Followed successfully')
      }

      // Refetch follow status to ensure UI is in sync with backend
      const response = await checkFollowStatus(user._id)
      setIsFollowing(response.isFollowing)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update follow status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-6 mt-8">
      <div className="relative spatial-panel overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-44 md:h-56 overflow-hidden rounded-t-[28px]">
          {user.coverPicture ? (
            <img src={user.coverPicture} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
        </div>

        {/* Profile Info Card */}
        <div className="px-4 md:px-6 -mt-8 relative z-10">
          <div className="flex justify-between items-start mb-2">
            <button
              type="button"
              onClick={onAvatarClick}
              className={`profile-header-anim w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary ${hasStory ? 'p-[2px] bg-gradient-to-br from-primary to-secondary' : 'border-4 border-black/50'}`}
            >
              <div className={`w-full h-full rounded-full overflow-hidden ${hasStory ? 'bg-black/50' : ''}`}>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <img src={defaultAvatar} alt={user.fullName} className="w-full h-full object-cover" />
                )}
              </div>
            </button>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <Button variant="outline" className="profile-header-anim mb-2" onClick={openEditProfileModal}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="profile-header-anim flex gap-2 mb-2">
                  <FollowButton isFollowing={isFollowing} isLoading={isLoading} onFollow={handleFollow} variant="primary" size="md" />
                  <Button variant="outline" onClick={() => (window.location.href = `/messages/${user._id}`)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="profile-header-anim text-2xl md:text-3xl font-extrabold text-white">{user.fullName}</h1>
            <p className="profile-header-anim text-[15px] leading-relaxed text-gray-200 max-w-lg mb-3">{user.bio || 'No bio yet'}</p>
            <div className="profile-header-anim flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
