/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Post } from '../types'
import type { ConfirmModalData } from '../types'

interface ModalContextValue {
  selectedPost: Post | null
  isPostModalOpen: boolean
  isCreatePostOpen: boolean
  isCreateStoryOpen: boolean
  isEditProfileOpen: boolean
  isFollowersModalOpen: boolean
  followersModalType: string
  followersModalUserId: string | null
  isShareModalOpen: boolean
  sharedPost: Post | null
  isConfirmModalOpen: boolean
  confirmModalData: ConfirmModalData | null
  openPostModal: (post: Post) => void
  closePostModal: () => void
  openCreatePostModal: () => void
  closeCreatePostModal: () => void
  openCreateStoryModal: () => void
  closeCreateStoryModal: () => void
  openEditProfileModal: () => void
  closeEditProfileModal: () => void
  openFollowersModal: (type: string, userId: string) => void
  closeFollowersModal: () => void
  openShareModal: (post: Post) => void
  closeShareModal: () => void
  openConfirmModal: (data: ConfirmModalData) => void
  closeConfirmModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
  const [followersModalType, setFollowersModalType] = useState('followers')
  const [followersModalUserId, setFollowersModalUserId] = useState<string | null>(null)
  // search modal removed — no longer used
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [sharedPost, setSharedPost] = useState<Post | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData | null>(null)

  const openPostModal = (post: Post) => {
    setSelectedPost(post)
    setIsPostModalOpen(true)
  }

  const openShareModal = (post: Post) => {
    setSharedPost(post)
    setIsShareModalOpen(true)
  }

  const closeShareModal = () => {
    setIsShareModalOpen(false)
    setTimeout(() => setSharedPost(null), 300)
  }

  const closePostModal = () => {
    setIsPostModalOpen(false)
    setTimeout(() => setSelectedPost(null), 300) // Wait for animation
  }

  const openCreatePostModal = () => {
    setIsCreatePostOpen(true)
  }

  const closeCreatePostModal = () => {
    setIsCreatePostOpen(false)
  }

  const openCreateStoryModal = () => {
    setIsCreateStoryOpen(true)
  }

  const closeCreateStoryModal = () => {
    setIsCreateStoryOpen(false)
  }

  const openEditProfileModal = () => {
    setIsEditProfileOpen(true)
  }

  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false)
  }

  const openFollowersModal = (type: string, userId: string) => {
    setFollowersModalType(type)
    setFollowersModalUserId(userId)
    setIsFollowersModalOpen(true)
  }

  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false)
  }

  const openConfirmModal = (data: ConfirmModalData) => {
    setConfirmModalData(data)
    setIsConfirmModalOpen(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
    setTimeout(() => setConfirmModalData(null), 300)
  }

  // search modal removed — functions deleted

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
  )
}

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
