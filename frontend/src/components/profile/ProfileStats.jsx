import React from 'react';
import { useModal } from '../../context/ModalContext';

const ProfileStats = ({ stats }) => {
  const { openFollowersModal } = useModal();

  const handleClick = (key) => {
    if (key === 'followers') {
      openFollowersModal('followers', stats._id);
    } else if (key === 'following') {
      openFollowersModal('following', stats._id);
    } else if (key === 'friends') {
      openFollowersModal('friends', stats._id);
    }
  };

  const statItems = [
    { key: 'posts', label: 'Posts', value: Math.max(0, stats.postCount ?? 0) },
    { key: 'followers', label: 'Followers', value: Math.max(0, stats.followerCount ?? 0) },
    { key: 'following', label: 'Following', value: Math.max(0, stats.followingCount ?? 0) },
    { key: 'friends', label: 'Friends', value: Math.max(0, stats.friendsCount ?? 0) },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6 px-4 md:px-6">
      {statItems.map((item) => (
        <div
          key={item.key}
          onClick={() => item.key !== 'posts' && handleClick(item.key)}
          className={`stat-card-anim flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm ${
            item.key !== 'posts' ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <span className="text-2xl md:text-3xl font-semibold text-white group-hover:scale-110 transition-transform duration-300">
            {item.value.toLocaleString()}
          </span>
          <span className="text-xs md:text-sm text-gray-400 font-medium tracking-wide mt-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
