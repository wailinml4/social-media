import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AtSign, Heart, MessageCircle, User, MoreHorizontal, Trash2 } from 'lucide-react';

import NotificationSkeleton from '../components/notifications/NotificationSkeleton';
import Tabs from '../components/ui/Tabs';
import TrendingSidebar from '../components/layout/TrendingSidebar';

import { profileData } from '../data/profile';
import { useNotifications } from '../context/NotificationContext';
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />;
      case 'follow': return <User className="w-7 h-7 text-blue-500 fill-blue-500" />;
      case 'comment': return <MessageCircle className="w-7 h-7 text-green-500 fill-green-500" />;
      case 'reply': return <MessageCircle className="w-7 h-7 text-green-500 fill-green-500" />;
      case 'mention': return <AtSign className="w-7 h-7 text-purple-500" />;
      default: return null;
    }
  };

  const getText = () => {
    switch (notification.type) {
      case 'like': return 'liked your post';
      case 'follow': return 'followed you';
      case 'comment': return 'commented on your post';
      case 'reply': return 'replied to your comment';
      case 'mention': return 'mentioned you in a comment';
      default: return '';
    }
  };

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await onMarkAsRead(notification._id || notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await onDelete(notification._id || notification.id);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <article 
      onClick={handleClick}
      className={`notification-card-animate-in px-4 py-4 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 flex gap-4 w-full cursor-pointer ${!notification.isRead ? 'bg-white/[0.03]' : ''}`}
    >
      <div className="flex-shrink-0 flex justify-end min-w-[40px] pt-1">
        <div className="relative">
          {getIcon()}
          {!notification.isRead && (
            <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-[#08080a]" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 mb-2">
          <img src={notification.sender.avatar} alt={notification.sender.name} className="w-8 h-8 rounded-full border border-white/10" />
        </div>
        <div className="text-[15px] mb-2">
          <span className="font-bold text-white mr-1 hover:underline">
            {notification.sender.name}
          </span>
          <span className="text-gray-300">{getText()}</span>
        </div>
        {notification.post && notification.post.content && (
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {notification.post.content}
          </p>
        )}
        {notification.comment && notification.comment.content && (
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {notification.comment.content}
          </p>
        )}
        <p className="text-gray-600 text-[12px] mt-1">{notification.time}</p>
      </div>
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
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
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    notifications,
    isLoadingNotifications,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationItem,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const notificationTabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'mentions', label: 'Mentions' },
  ];

  const onTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotificationItem(notificationId);
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'mentions') return notif.type === 'mention' || notif.type === 'reply';
    return true;
  });

  useStaggeredFadeIn(!isLoadingNotifications && filteredNotifications.length > 0, '.notification-card-animate-in', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.08,
    ease: 'power2.out',
    clearProps: 'all',
  });

  return (
    <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-bg-dark">

      {/* Main Column */}
      <div className="w-full max-w-[600px] border-r border-white/10 min-h-screen relative flex flex-col bg-bg-dark">

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-bold cursor-pointer hidden sm:block">Notifications</h2>
            <div className="w-8 h-8 rounded-full bg-white/10 sm:hidden flex items-center justify-center overflow-hidden">
              <img src={profileData.user.avatar} alt="User" />
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary hover:text-primary/80 transition-colors hidden sm:block"
            >
              Mark all as read
            </button>
            <div className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors sm:hidden">
              <span className="text-xl font-bold">N</span>
            </div>
            <div className="hidden sm:block"></div>
          </div>

          <Tabs
            tabs={notificationTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
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
            filteredNotifications.map(notification => (
              <NotificationCard 
                key={notification.id || notification._id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Nothing to see here — yet</h3>
              <p className="text-gray-500">From likes to reposts and a whole lot more, this is where all the action happens.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar Component */}
      <TrendingSidebar />
    </div>
  );
};

export default Notifications;
