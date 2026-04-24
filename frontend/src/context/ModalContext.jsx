import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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

  return (
    <ModalContext.Provider
      value={{
        selectedPost,
        isPostModalOpen,
        isCreatePostOpen,
        isEditProfileOpen,
        openPostModal,
        closePostModal,
        openCreatePostModal,
        closeCreatePostModal,
        openEditProfileModal,
        closeEditProfileModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
