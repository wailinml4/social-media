import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { Calendar, Edit3, MapPin, MessageCircle } from 'lucide-react'

import Button from '../ui/Button'
import FollowButton from '../ui/FollowButton'
import { useModal } from '../../context/ModalContext'
import { followUser, unfollowUser, checkFollowStatus } from '../../services/followService'
import { useAuth } from '../../context/AuthContext'

const ProfileHeader = ({ user, isOwnProfile, onAvatarClick, hasStory = false }) => {
  const { openEditProfileModal } = useModal()
  const { user: currentUser } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!isOwnProfile && currentUser) {
        try {
          const response = await checkFollowStatus(user._id)
          setIsFollowing(response.data.isFollowing)
        } catch (err) {
          console.error(err)
          toast.error('Failed to check follow status')
        }
      }
    }
    fetchFollowStatus()
  }, [user._id, isOwnProfile, currentUser])

  const handleFollow = async () => {
    try {
      setIsLoading(true)
      if (isFollowing) {
        await unfollowUser(user._id)
        setIsFollowing(false)
        toast.success('Unfollowed successfully')
      } else {
        await followUser(user._id)
        setIsFollowing(true)
        toast.success('Followed successfully')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update follow status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-6 mt-8">
      <div className="relative rounded-[28px] bg-[#050505]/80 border border-white/6 backdrop-blur-xl overflow-hidden shadow-lg">
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
              className={`profile-header-anim w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary ${hasStory ? 'p-[2px] bg-gradient-to-br from-primary to-secondary' : 'border-4 border-[#050505]'}`}
            >
              <div
                className={`w-full h-full rounded-full overflow-hidden ${hasStory ? 'bg-[#050505]' : ''}`}
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </button>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  className="profile-header-anim mb-2"
                  onClick={openEditProfileModal}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="profile-header-anim flex gap-2 mb-2">
                  <FollowButton
                    isFollowing={isFollowing}
                    isLoading={isLoading}
                    onFollow={handleFollow}
                    variant="primary"
                    size="md"
                  />
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = `/messages/${user._id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="profile-header-anim text-2xl md:text-3xl font-extrabold text-white">
              {user.fullName}
            </h1>
            <p className="profile-header-anim text-[15px] leading-relaxed text-gray-200 max-w-lg mb-3">
              {user.bio || 'No bio yet'}
            </p>
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
