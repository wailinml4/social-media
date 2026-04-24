import React from 'react';

import { Calendar, Edit3, MapPin } from 'lucide-react';

import Button from '../ui/Button';
import { useModal } from '../../context/ModalContext';

const ProfileHeader = ({ user }) => {
  const { openEditProfileModal } = useModal();

  return (
    <>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-6 -mt-16 md:-mt-20 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="profile-header-anim w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#050505] overflow-hidden bg-white/10 shadow-2xl">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <Button 
            variant="outline" 
            className="profile-header-anim mb-2"
            onClick={openEditProfileModal}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="profile-header-anim text-2xl md:text-3xl font-extrabold text-white">{user.name}</h1>
          <p className="profile-header-anim text-gray-400 font-medium mb-4">{user.handle}</p>
          <p className="profile-header-anim text-[15px] leading-relaxed text-gray-200 max-w-lg mb-4">
            {user.bio}
          </p>
          <div className="profile-header-anim flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Joined April 2024</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
