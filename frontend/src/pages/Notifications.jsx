import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AtSign, Heart, MessageCircle, User } from 'lucide-react';

import NotificationSkeleton from '../components/notifications/NotificationSkeleton';
import Tabs from '../components/ui/Tabs';
import TrendingSidebar from '../components/layout/TrendingSidebar';

import { profileData } from '../data/profile';
import { getAllNotifications } from '../services/notificationsService';
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn';

const NotificationCard = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />;
      case 'follow': return <User className="w-7 h-7 text-blue-500 fill-blue-500" />;
      case 'reply': return <MessageCircle className="w-7 h-7 text-green-500 fill-green-500" />;
      case 'mention': return <AtSign className="w-7 h-7 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <article className="notification-card-animate-in px-4 py-4 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 flex gap-4 w-full cursor-pointer">
      <div className="flex-shrink-0 flex justify-end min-w-[40px] pt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 mb-2">
          {notification.users.map((user, idx) => (
            <img key={idx} src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/10" />
          ))}
        </div>
        <div className="text-[15px] mb-2">
          <span className="font-bold text-white mr-1 hover:underline">
            {notification.users.length > 1 ? `${notification.users[0].name} and ${notification.users.length - 1} others` : notification.users[0].name}
          </span>
          <span className="text-gray-300">{notification.text}</span>
        </div>
        {notification.postPreview && (
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {notification.postPreview}
          </p>
        )}
      </div>
    </article>
  )
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
        toast.error('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const notificationTabs = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified' },
    { id: 'mentions', label: 'Mentions' },
  ];

  const onTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'verified') return false; // For mock, none are verified
    if (activeTab === 'mentions') return notif.type === 'mention' || notif.type === 'reply';
    return true;
  });

  useStaggeredFadeIn(!loading && filteredNotifications.length > 0, '.notification-card-animate-in', {
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
          {loading ? (
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
              <NotificationCard key={notification.id} notification={notification} />
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
