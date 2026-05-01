import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalType, setFollowersModalType] = useState('followers');
  const [followersModalUserId, setFollowersModalUserId] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedPost, setSharedPost] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState(null);

  const openPostModal = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const openShareModal = (post) => {
    setSharedPost(post);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setTimeout(() => setSharedPost(null), 300);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300); // Wait for animation
  };

  const openCreatePostModal = () => {
    setIsCreatePostOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostOpen(false);
  };

  const openCreateStoryModal = () => {
    setIsCreateStoryOpen(true);
  };

  const closeCreateStoryModal = () => {
    setIsCreateStoryOpen(false);
  };

  const openEditProfileModal = () => {
    setIsEditProfileOpen(true);
  };

  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false);
  };

  const openFollowersModal = (type, userId) => {
    setFollowersModalType(type);
    setFollowersModalUserId(userId);
    setIsFollowersModalOpen(true);
  };

  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };

  const openConfirmModal = (data) => {
    setConfirmModalData(data);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setConfirmModalData(null), 300);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        selectedPost,
        isPostModalOpen,
        isCreatePostOpen,
        isEditProfileOpen,
        isFollowersModalOpen,
        followersModalType,
        followersModalUserId,
        isSearchModalOpen,
        isShareModalOpen,
        sharedPost,
        openPostModal,
        closePostModal,
        openCreatePostModal,
        closeCreatePostModal,
        openCreateStoryModal,
        closeCreateStoryModal,
        isCreateStoryOpen,
        openEditProfileModal,
        closeEditProfileModal,
        openFollowersModal,
        closeFollowersModal,
        openSearchModal,
        closeSearchModal,
        openShareModal,
        closeShareModal,
        isConfirmModalOpen,
        confirmModalData,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
