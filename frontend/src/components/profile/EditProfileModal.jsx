import React, { useEffect, useRef, useState } from 'react';

import { Camera, X } from 'lucide-react';

import { useModal } from '../../context/ModalContext';
import { profileData } from '../../data/profile';
import { useModalAnimation } from '../../animations/useModalAnimation';

const EditProfileModal = () => {
  const { isEditProfileOpen, closeEditProfileModal } = useModal();
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const { isRendered } = useModalAnimation(isEditProfileOpen, {
    overlayRef,
    modalRef,
    onCloseComplete: () => {
      resetForm();
    },
  });

  const [name, setName] = useState(profileData.user.name);
  const [handle, setHandle] = useState(profileData.user.handle);
  const [bio, setBio] = useState(profileData.user.bio || '');
  const [location, setLocation] = useState(profileData.user.location || '');
  const [website, setWebsite] = useState(profileData.user.website || '');
  const [avatarPreview, setAvatarPreview] = useState(profileData.user.avatar);
  const [coverPreview, setCoverPreview] = useState(profileData.user.cover || '');

  const hasChanges = 
    name !== profileData.user.name ||
    handle !== profileData.user.handle ||
    bio !== (profileData.user.bio || '') ||
    location !== (profileData.user.location || '') ||
    website !== (profileData.user.website || '');

  useEffect(() => {
    if (!isEditProfileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeEditProfileModal();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditProfileOpen, closeEditProfileModal]);

  const resetForm = () => {
    setName(profileData.user.name);
    setHandle(profileData.user.handle);
    setBio(profileData.user.bio || '');
    setLocation(profileData.user.location || '');
    setWebsite(profileData.user.website || '');
    setAvatarPreview(profileData.user.avatar);
    setCoverPreview(profileData.user.cover || '');
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    console.log('Update profile payload:', {
      name,
      handle,
      bio,
      location,
      website,
    });

    closeEditProfileModal();
    resetForm();
  };

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={closeEditProfileModal}
      />

      <div
        ref={modalRef}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:h-auto sm:max-h-[85vh] sm:max-w-[540px] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">Edit Profile</h2>
            <p className="mt-1 text-xs text-text-dim">Update your profile information.</p>
          </div>
          <button
            type="button"
            onClick={closeEditProfileModal}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Close edit profile modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 py-4 sm:px-5">
          {/* Cover Image */}
          <div className="relative mb-16 h-32 overflow-hidden rounded-xl bg-white/5 sm:h-40">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/20">
                <span className="text-sm">Add cover photo</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-200 hover:bg-black/70"
              aria-label="Change cover photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          {/* Avatar */}
          <div className="absolute left-4 top-24 sm:left-5 sm:top-28">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#050505] bg-white/5 sm:h-28 sm:w-28">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/20">
                  <span className="text-xs">Add photo</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-200 hover:bg-black/70"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={3}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/5 bg-bg-dark px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={closeEditProfileModal}
              className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasChanges}
              className={`inline-flex min-w-[92px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                hasChanges
                  ? 'bg-white text-black hover:bg-white/92'
                  : 'bg-white/8 text-white/28'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
