import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import CreatePost from '../components/post/create/CreatePost';
import PostCard from '../components/post/card/PostCard';
import PostSkeleton from '../components/post/card/PostSkeleton';
import StoriesBar from '../components/stories/StoriesBar';
import Tabs from '../components/ui/Tabs';
import TrendingSidebar from '../components/layout/TrendingSidebar';

import { usePosts } from '../context/PostContext';
import { useStaggeredFadeIn } from '../animations/useStaggeredFadeIn';
import { useAuth } from '../context/AuthContext';

const FEED_MAX_WIDTH = 600;

const Home = () => {
  const { posts, isLoadingPosts, error, fetchAllPosts, fetchFollowingPosts, followingPosts, isLoadingFollowingPosts, fetchFriendsPosts, friendsPosts, isLoadingFriendsPosts } = usePosts();
  const [activeTab, setActiveTab] = useState('for_you');
  const feedRef = useRef(null);
  const loaderRef = useRef(null);

  const homeTabs = [
    { id: 'for_you', label: 'For you' },
    { id: 'friends', label: 'Friends' },
    { id: 'following', label: 'Following' },
  ];

  const onTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Initial Load
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        if (activeTab === 'following') {
          await fetchFollowingPosts({ offset: 0, limit: 3 });
        } else if (activeTab === 'friends') {
          await fetchFriendsPosts({ offset: 0, limit: 3 });
        } else {
          await fetchAllPosts({ offset: 0, limit: 3, filter: activeTab });
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load posts. Please try again.');
      }
    };
    fetchInitialPosts();
  }, [activeTab, fetchAllPosts, fetchFollowingPosts, fetchFriendsPosts]);

  // GSAP Animation for newly loaded posts
  const currentPosts = activeTab === 'following' ? followingPosts : activeTab === 'friends' ? friendsPosts : posts;
  const currentIsLoading = activeTab === 'following' ? isLoadingFollowingPosts : activeTab === 'friends' ? isLoadingFriendsPosts : isLoadingPosts;

  useStaggeredFadeIn(!currentIsLoading && currentPosts.length > 0, '.post-card-animate-in', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    clearProps: 'all',
  });

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !currentIsLoading && currentPosts.length > 0) {
        loadMorePosts();
      }
    }, { threshold: 0.5 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [currentIsLoading, currentPosts, activeTab, fetchAllPosts, fetchFollowingPosts, fetchFriendsPosts]);

  const loadMorePosts = async () => {
    try {
      if (activeTab === 'following') {
        await fetchFollowingPosts({ offset: followingPosts.length, limit: 2 });
      } else if (activeTab === 'friends') {
        await fetchFriendsPosts({ offset: friendsPosts.length, limit: 2 });
      } else {
        await fetchAllPosts({ offset: posts.length, limit: 2, filter: activeTab });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load more posts. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-clip pb-20 sm:pb-0 bg-bg-dark">
      <div className="home-feed-shell pointer-events-none relative w-full">
        <div className="mx-auto flex min-h-screen w-full justify-center px-4 sm:px-6 lg:px-10">
          {/* Main Feed Column */}
          <div
            className="pointer-events-auto relative flex min-h-screen w-full flex-col overflow-hidden border-r border-white/10 bg-bg-dark"
            style={{ maxWidth: `${FEED_MAX_WIDTH}px` }}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-xl">
              <StoriesBar />

              <Tabs
                tabs={homeTabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
              />
            </div>

            <CreatePost />

            {/* Feed List */}
            <div ref={feedRef} className="flex-1">
              {error ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Failed to load posts</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  {currentPosts.map((post) => (
                    <div key={post.id} className="post-card-animate-in">
                      <PostCard post={post} />
                    </div>
                  ))}

                  {currentIsLoading && (
                    <div className="flex flex-col">
                      <PostSkeleton />
                      <PostSkeleton />
                    </div>
                  )}

                  {/* Invisible target for intersection observer */}
                  <div ref={loaderRef} className="h-20 w-full" />

                  {!currentIsLoading && currentPosts.length > 0 && (
                    <div className="border-b border-white/10 p-8 text-center text-sm text-white/40">
                      You&apos;re all caught up!
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Component */}
      <TrendingSidebar />
    </div>
  );
};

export default Home;
