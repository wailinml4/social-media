import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { X } from 'lucide-react';

import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profileService';
import { uploadImage } from '../../services/uploadService';
import { useModalAnimation } from '../../animations/useModalAnimation';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileForm from './ProfileForm';

const EditProfileModal = () => {
  const { isEditProfileOpen, closeEditProfileModal } = useModal();
  const { user: currentUser, setUser } = useAuth();
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const { isRendered } = useModalAnimation(isEditProfileOpen, {
    overlayRef,
    modalRef,
    onCloseComplete: () => {
      resetForm();
    },
  });

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.profilePicture || '');
  const [coverPreview, setCoverPreview] = useState(currentUser?.coverPicture || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    fullName !== (currentUser?.fullName || '') ||
    bio !== (currentUser?.bio || '') ||
    avatarFile !== null ||
    coverFile !== null;

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
    setFullName(currentUser?.fullName || '');
    setBio(currentUser?.bio || '');
    setAvatarPreview(currentUser?.profilePicture || '');
    setCoverPreview(currentUser?.coverPicture || '');
    setAvatarFile(null);
    setCoverFile(null);
  };

  const handleAvatarChange = (files) => {
    if (files.length > 0) {
      setAvatarFile(files[0].file);
      setAvatarPreview(files[0].preview);
    }
  };

  const handleCoverChange = (files) => {
    if (files.length > 0) {
      setCoverFile(files[0].file);
      setCoverPreview(files[0].preview);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      let profilePicture = currentUser?.profilePicture;
      let coverPicture = currentUser?.coverPicture;

      if (avatarFile) {
        profilePicture = await uploadImage(avatarFile);
      }

      if (coverFile) {
        coverPicture = await uploadImage(coverFile);
      }

      const updatedUser = await updateProfile({
        fullName,
        bio,
        profilePicture,
        coverPicture,
      });

      setUser(updatedUser);
      toast.success('Profile updated successfully');
      closeEditProfileModal();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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
          <ProfileImageUpload
            avatarSrc={avatarPreview}
            coverSrc={coverPreview}
            userName={currentUser?.fullName}
            onAvatarChange={handleAvatarChange}
            onCoverChange={handleCoverChange}
          />

          <ProfileForm
            fullName={fullName}
            bio={bio}
            onFullNameChange={(value) => setFullName(value)}
            onBioChange={(value) => setBio(value)}
          />
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
              disabled={!hasChanges || isSaving}
              className={`inline-flex min-w-[92px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                hasChanges && !isSaving
                  ? 'bg-white text-black hover:bg-white/92'
                  : 'bg-white/8 text-white/28'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
