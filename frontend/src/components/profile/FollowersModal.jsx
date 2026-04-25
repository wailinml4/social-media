import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useModalAnimation } from '../../animations/useModalAnimation';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import UserList from './UserList';
import { getFollowers, getFollowees, getFriends, checkFollowStatus, followUser, unfollowUser } from '../../services/followService';

const FollowersModal = () => {
  const { isFollowersModalOpen, followersModalType, followersModalUserId, closeFollowersModal } = useModal();
  const { user: currentUser } = useAuth();
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const listRef = useRef(null);

  const { isRendered } = useModalAnimation(isFollowersModalOpen, {
    overlayRef,
    modalRef,
  });

  const title = followersModalType === 'followers' ? 'Followers' :
                followersModalType === 'following' ? 'Following' : 'Friends';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});

  const fetchUsers = async (currentOffset = 0) => {
    try {
      setLoading(true);
      const offsetToUse = currentOffset === 0 ? 0 : offset;
      
      let response;
      if (followersModalType === 'followers') {
        response = await getFollowers(followersModalUserId, offsetToUse, 20);
      } else if (followersModalType === 'following') {
        response = await getFollowees(followersModalUserId, offsetToUse, 20);
      } else if (followersModalType === 'friends') {
        response = await getFriends(followersModalUserId, offsetToUse, 20);
      } else {
        response = { data: [] };
      }

      const newUsers = response.data || [];
      
      if (currentOffset === 0) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      
      setOffset(offsetToUse + newUsers.length);
      setHasMore(newUsers.length >= 20);

      // Fetch follow status for users
      const statusMap = { ...followingStatus };
      for (const user of newUsers) {
        try {
          const statusRes = await checkFollowStatus(user._id);
          statusMap[user._id] = statusRes.data?.isFollowing || false;
        } catch (error) {
          statusMap[user._id] = false;
        }
      }
      setFollowingStatus(statusMap);
    } catch (error) {
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchUsers(offset);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      if (followingStatus[targetUserId]) {
        await unfollowUser(targetUserId);
        setFollowingStatus(prev => ({ ...prev, [targetUserId]: false }));
        toast.success('Unfollowed successfully');
      } else {
        await followUser(targetUserId);
        setFollowingStatus(prev => ({ ...prev, [targetUserId]: true }));
        toast.success('Followed successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update follow status');
    }
  };

  useEffect(() => {
    if (followersModalUserId && followersModalType) {
      fetchUsers(0);
    }
  }, [followersModalUserId, followersModalType]);

  useEffect(() => {
    if (!isFollowersModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeFollowersModal();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFollowersModalOpen, closeFollowersModal]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={closeFollowersModal}
      />

      <div
        ref={modalRef}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:h-auto sm:max-h-[85vh] sm:max-w-[540px] sm:rounded-3xl"
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
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                <p className="text-sm text-gray-400">Loading...</p>
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
            />
          )}
        </div>

        {/* Footer */}
        {hasMore && users.length > 0 && (
          <div className="relative border-t border-white/5 bg-bg-dark px-4 py-3 sm:px-5">
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full rounded-full bg-white/5 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersModal;
