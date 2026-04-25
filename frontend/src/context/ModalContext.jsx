import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalType, setFollowersModalType] = useState('followers');
  const [followersModalUserId, setFollowersModalUserId] = useState(null);

  const openPostModal = (post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
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
        openPostModal,
        closePostModal,
        openCreatePostModal,
        closeCreatePostModal,
        openEditProfileModal,
        closeEditProfileModal,
        openFollowersModal,
        closeFollowersModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
