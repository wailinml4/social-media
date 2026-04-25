import React from 'react';
import { Camera } from 'lucide-react';
import Avatar from '../ui/Avatar';
import FileUploader from '../ui/FileUploader';

const ProfileImageUpload = ({
  avatarSrc,
  coverSrc,
  userName,
  onAvatarChange,
  onCoverChange,
}) => {
  return (
    <>
      {/* Cover Image */}
      <div className="relative mb-16 h-32 overflow-hidden rounded-xl bg-white/5 sm:h-40">
        {coverSrc ? (
          <img src={coverSrc} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <span className="text-sm">Add cover photo</span>
          </div>
        )}
        <FileUploader
          accept="image/*"
          onFilesChange={onCoverChange}
          className="absolute right-3 top-3"
        >
          {({ handleClick }) => (
            <button
              type="button"
              onClick={handleClick}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-200 hover:bg-black/70"
              aria-label="Change cover photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}
        </FileUploader>
      </div>

      {/* Avatar */}
      <div className="absolute left-4 top-24 sm:left-5 sm:top-28">
        <div className="relative">
          <Avatar
            src={avatarSrc}
            alt="Avatar"
            name={userName}
            size="xl"
            className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-[#050505]"
          />
          <FileUploader
            accept="image/*"
            onFilesChange={onAvatarChange}
            className="absolute bottom-1 right-1"
          >
            {({ handleClick }) => (
              <button
                type="button"
                onClick={handleClick}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-200 hover:bg-black/70"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </FileUploader>
        </div>
      </div>
    </>
  );
};

export default ProfileImageUpload;
