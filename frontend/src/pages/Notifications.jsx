import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { Heart, MessageCircle, User, MoreHorizontal, Trash2 } from 'lucide-react'

import NotificationSkeleton from '../components/notifications/NotificationSkeleton'
import Card from '../components/ui/Card'
import Tabs from '../components/ui/Tabs'

import { profileData } from '../data/profile'
import { useNotifications } from '../context/NotificationContext'
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn'

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
      case 'follow':
        return <User className="w-7 h-7 text-blue-500 fill-blue-500" />
      case 'comment':
        return <MessageCircle className="w-7 h-7 text-green-500 fill-green-500" />
      case 'reply':
        return <MessageCircle className="w-7 h-7 text-green-500 fill-green-500" />
      case 'message':
        return <MessageCircle className="w-7 h-7 text-primary fill-primary" />
      default:
        return null
    }
  }

  const getText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post'
      case 'follow':
        return 'followed you'
      case 'comment':
        return 'commented on your post'
      case 'reply':
        return 'replied to your comment'
      case 'message':
        return 'sent you a message'
      default:
        return ''
    }
  }

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await onMarkAsRead(notification._id || notification.id)
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    if (notification.type === 'message') {
      if (notification.conversation?.id) {
        navigate(`/messages/conversation/${notification.conversation.id}`)
      } else {
        navigate(`/messages/${notification.sender._id || notification.sender.id}`)
      }
    }
  }

  const handleProfileClick = e => {
    e.stopPropagation()
    navigate(`/profile/${notification.sender._id || notification.sender.id}`)
  }

  const handleDelete = async e => {
    e.stopPropagation()
    try {
      await onDelete(notification._id || notification.id)
      setShowMenu(false)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  return (
    <article
      onClick={handleClick}
      className="notification-card-animate-in px-3 py-2 hover:bg-white/[0.02] transition-colors duration-200 flex items-center gap-3 w-full cursor-pointer"
    >
      <div className="flex-shrink-0 min-w-[40px]">
        <div className="relative w-8 h-8">
          <img
            src={notification.sender.avatar}
            alt={notification.sender.name}
            className="w-8 h-8 rounded-full border border-white/8 object-cover"
          />
          <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-[#0b0b0d] border border-white/10 flex items-center justify-center">
            {getIcon()}
          </div>
          {!notification.isRead && (
            <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-[#08080a]" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleProfileClick}
            className="text-sm font-semibold text-white hover:underline"
          >
            {notification.sender.name}
          </button>
          {notification.type === 'comment' &&
          notification.comment &&
          notification.comment.content ? (
            <span className="text-sm text-gray-300">
              commented: <span className="text-gray-400">"{notification.comment.content}"</span>
            </span>
          ) : (
            <span className="text-sm text-gray-300">{getText()}</span>
          )}
        </div>
        {notification.post &&
          notification.post.content &&
          notification.type !== 'comment' &&
          notification.type !== 'message' &&
          notification.type !== 'like' && (
            <p className="text-gray-500 text-[15px] leading-relaxed">{notification.post.content}</p>
          )}
        <p className="text-gray-600 text-[12px] mt-1">{notification.time}</p>
      </div>
      <div className="relative">
        <button
          onClick={e => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="p-1 text-text-dim hover:text-white transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-surface border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-white/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all')

  const {
    notifications,
    isLoadingNotifications,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationItem,
  } = useNotifications()

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20 })
  }, [fetchNotifications])

  const notificationTabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
  ]

  const onTabChange = tabId => {
    setActiveTab(tabId)
  }

  const handleMarkAsRead = async notificationId => {
    try {
      await markAsRead(notificationId)
    } catch {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all notifications as read')
    }
  }

  const handleDelete = async notificationId => {
    try {
      await deleteNotificationItem(notificationId)
      toast.success('Notification deleted')
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (notif.type === 'mention') return false
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notif.isRead
    return true
  })

  useStaggeredFadeIn(
    !isLoadingNotifications && filteredNotifications.length > 0,
    '.notification-card-animate-in',
    {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'all',
    },
  )

  return (
    <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-bg-dark">
      {/* Main Column */}
      <div className="w-full max-w-[600px] min-h-screen relative flex flex-col bg-bg-dark">
        {/* Header (not sticky) */}
        <div className="bg-black/70 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold cursor-pointer hidden sm:block">Notifications</h2>
            <div className="w-8 h-8 rounded-full bg-white/10 sm:hidden flex items-center justify-center overflow-hidden">
              <img src={profileData.user.avatar} alt="User" />
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-primary text-black rounded-full text-sm font-medium hover:opacity-95 transition"
            >
              Mark all as read
            </button>
            <div className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors sm:hidden">
              <span className="text-xl font-bold">N</span>
            </div>
            <div className="hidden sm:block"></div>
          </div>

          <Tabs tabs={notificationTabs} activeTab={activeTab} onTabChange={onTabChange} />
        </div>

        {/* Notifications List */}
        <div className="flex-1">
          {isLoadingNotifications ? (
            <div className="flex flex-col">
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Failed to load notifications</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : filteredNotifications.length > 0 ? (
            (() => {
              // simple heuristic to split today vs earlier based on time string
              const startOfToday = (() => {
                const d = new Date()
                d.setHours(0, 0, 0, 0)
                return d
              })()

              const isTodayByTimestamp = n => {
                // prefer `createdAt` or `created_at` if available
                const ts = n.createdAt || n.created_at || n.time
                if (!ts) return false
                // If ts looks like an ISO or numeric timestamp, try parsing
                const parsed = Date.parse(ts)
                if (!isNaN(parsed)) {
                  return new Date(parsed) >= startOfToday
                }
                // fallback to previous humanized-time heuristic
                const s = String(ts).toLowerCase()
                return /now|m|h|minute|hour|today/.test(s) && !/yesterday|d|day/.test(s)
              }

              const today = filteredNotifications.filter(n => isTodayByTimestamp(n))
              const earlier = filteredNotifications.filter(n => !isTodayByTimestamp(n))

              return (
                <div className="space-y-6 mt-6">
                  {today.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-white/80 mb-3">Today</h3>
                      <Card className="rounded-[28px] border border-transparent bg-[#050505]/90 p-0 overflow-hidden">
                        <div>
                          {today.map(notification => (
                            <div key={notification.id || notification._id} className="px-4 py-4">
                              <NotificationCard
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </section>
                  )}

                  {earlier.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-white/80 mb-3">Earlier</h3>
                      <Card className="rounded-[28px] border border-transparent bg-[#050505]/90 p-0 overflow-hidden">
                        <div>
                          {earlier.map(notification => (
                            <div key={notification.id || notification._id} className="px-4 py-4">
                              <NotificationCard
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </section>
                  )}
                </div>
              )
            })()
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Nothing to see here — yet</h3>
              <p className="text-gray-500">
                From likes to reposts and a whole lot more, this is where all the action happens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
