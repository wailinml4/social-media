import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Bookmark, Grid, Info } from 'lucide-react';

import PostGrid from '../components/profile/PostGrid';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSkeleton from '../components/profile/ProfileSkeleton';
import ProfileStats from '../components/profile/ProfileStats';
import StoriesBar from '../components/stories/StoriesBar';
import Tabs from '../components/ui/Tabs';
import TrendingSidebar from '../components/layout/TrendingSidebar';

import { getCurrentProfile, getUserBookmarks, getUserPosts } from '../services/profileService';
import { useProfileAnimation, useTabTransition } from '../animations/useStaggeredFadeIn';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentProfile();
        setProfileData(data);
        setPosts(data.posts);
        setBookmarks(data.bookmarks);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const user = profileData?.user;

  const profileTabs = [
    { id: 'posts', label: 'Posts', icon: Grid },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'about', label: 'About', icon: Info },
  ];

  useProfileAnimation(!loading && user, profileRef);

  const animateTabChange = useTabTransition(() => {
    setActiveTab(activeTab);
  });

  const onTabChange = (tabId) => {
    if (tabId === activeTab) return;
    animateTabChange();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-bg-dark">
        <div className="w-full max-w-[600px] border-r border-white/10 min-h-screen relative flex flex-col bg-bg-dark p-8">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Failed to load profile</h3>
            <p className="text-gray-500 mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={profileRef} className="flex justify-center w-full min-h-screen pb-20 sm:pb-0 bg-bg-dark">
      <div className="w-full max-w-[600px] border-r border-white/10 min-h-screen relative flex flex-col bg-bg-dark">

        <ProfileHeader user={user} />

        {/* Stats Section */}
        <ProfileStats stats={user.stats} />

        {/* Stories Section */}
        <StoriesBar />

        {/* Tab Navigation */}
        <div className="px-4 md:px-6">
          <Tabs
            tabs={profileTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            className="-mx-4 md:-mx-6 px-4 md:px-6 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-20 mb-6"
          />
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="pb-10">
          {activeTab === 'posts' && <PostGrid items={posts} user={user} />}
          {activeTab === 'bookmarks' && (
            bookmarks.length > 0 ? (
              <PostGrid items={bookmarks} user={user} />
            ) : (
              <div className="content-grid-anim flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Bookmark className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Save posts for later</h3>
                <p className="text-gray-400 max-w-xs">Don't let the good stuff disappear! Bookmark posts to easily find them later.</p>
              </div>
            )
          )}
          {activeTab === 'about' && (
            <div className="content-grid-anim px-6 py-4 space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  About {user.name}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {user.bio}
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Username</span>
                    <span className="text-gray-200">{user.handle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Member since</span>
                    <span className="text-gray-200">April 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Location</span>
                    <span className="text-gray-200">{user.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <TrendingSidebar />
    </div>
  );
};

export default Profile;
