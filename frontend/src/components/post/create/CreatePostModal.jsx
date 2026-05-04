import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import CreatePostHeader from './CreatePostHeader'
import EmojiPicker from './EmojiPicker'
import LocationInput from './LocationInput'
import MediaUploader from './MediaUploader'
import TagInput from './TagInput'
import PostAuthorInfo from './PostAuthorInfo'
import PostContentTextarea from './PostContentTextarea'
import PostTagsDisplay from './PostTagsDisplay'
import PostActionButtons from './PostActionButtons'
import PostFooterActions from './PostFooterActions'

import { useModal } from '../../../context/ModalContext'
import { useAuth } from '../../../context/AuthContext'
import { usePosts } from '../../../context/PostContext'
import defaultAvatar from '../../../assets/default-avatar.svg'
import { uploadImage } from '../../../services/uploadService'
import { useModalAnimation } from '../../../animations/useModalAnimation'

const CreatePostModal = () => {
  const { isCreatePostOpen, closeCreatePostModal } = useModal()
  const { user } = useAuth()
  const { createNewPost, isCreatingPost } = usePosts()
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaItemsRef = useRef([])
  const [isUploading, setIsUploading] = useState(false)

  const { isRendered } = useModalAnimation(isCreatePostOpen, {
    overlayRef,
    modalRef,
    onCloseComplete: () => {
      resetComposer()
    },
  })

  const [isDragActive, setIsDragActive] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [description, setDescription] = useState('')
  const [taggedUsers, setTaggedUsers] = useState('')
  const [location, setLocation] = useState('')
  const [mediaItems, setMediaItems] = useState([])

  const hasPostContent = Boolean(description.trim() || mediaItems.length)

  const locationLabel = useMemo(() => {
    if (!location.trim()) return 'Add location'
    return location.trim()
  }, [location])

  useEffect(() => {
    mediaItemsRef.current = mediaItems
  }, [mediaItems])

  useEffect(() => {
    if (!isCreatePostOpen) return undefined

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        closeCreatePostModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCreatePostOpen, closeCreatePostModal])

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach(item => URL.revokeObjectURL(item.preview))
    }
  }, [])

  const resetComposer = () => {
    mediaItems.forEach(item => URL.revokeObjectURL(item.preview))
    setDescription('')
    setTaggedUsers('')
    setLocation('')
    setMediaItems([])
    setShowEmojiPicker(false)
    setShowTagInput(false)
    setShowLocationInput(false)
    setIsDragActive(false)
  }

  const addFiles = files => {
    const nextItems = Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .map(file => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        preview: URL.createObjectURL(file),
      }))

    if (!nextItems.length) return

    setMediaItems(currentItems => [...currentItems, ...nextItems])
  }

  const handleDrop = event => {
    event.preventDefault()
    setIsDragActive(false)
    addFiles(event.dataTransfer.files || [])
  }

  const removeMediaItem = id => {
    setMediaItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id)
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.preview)
      }
      return currentItems.filter(item => item.id !== id)
    })
  }

  const handleSubmit = async () => {
    if (!hasPostContent) return

    try {
      setIsUploading(true)

      // Upload all media files
      const uploadedUrls = []
      for (const item of mediaItems) {
        const url = await uploadImage(item.file)
        uploadedUrls.push(url)
      }

      // Create the post
      await createNewPost({
        description,
        media: uploadedUrls.map((url, index) => ({
          url,
          type: mediaItems[index].type,
        })),
      })

      toast.success('Post created successfully')
      closeCreatePostModal()
      resetComposer()
    } catch (error) {
      toast.error(error.message || 'Failed to create post')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isRendered) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={closeCreatePostModal}
      />

      <div
        ref={modalRef}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:h-auto sm:max-h-[78vh] sm:max-w-[520px] sm:rounded-3xl"
      >
        <CreatePostHeader onClose={closeCreatePostModal} />

        <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 py-4 sm:px-5">
          <PostAuthorInfo
            avatar={user?.profilePicture || defaultAvatar}
            name={user?.fullName || 'User'}
            handle={user?.username || user?.email?.split('@')[0] || 'user'}
          />

          <div className="min-w-0 flex-1">
            <PostContentTextarea
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Write a caption..."
            />
            <PostTagsDisplay taggedUsers={taggedUsers} location={location} />
          </div>

          <PostActionButtons
            onMediaClick={() => fileInputRef.current?.click()}
            onEmojiClick={() => setShowEmojiPicker(current => !current)}
            onTagClick={() => setShowTagInput(current => !current)}
            onLocationClick={() => setShowLocationInput(current => !current)}
            locationLabel={locationLabel}
          />

          {showEmojiPicker && (
            <EmojiPicker onEmojiSelect={emoji => setDescription(current => `${current}${emoji}`)} />
          )}

          {showTagInput && (
            <TagInput
              value={taggedUsers}
              onChange={value => setTaggedUsers(value)}
              placeholder="@alex, @sam"
            />
          )}

          {showLocationInput && (
            <LocationInput
              value={location}
              onChange={value => setLocation(value)}
              placeholder="San Francisco, CA"
            />
          )}

          <MediaUploader
            mediaItems={mediaItems}
            onAddFiles={addFiles}
            onRemoveMedia={removeMediaItem}
            isDragActive={isDragActive}
            onDragOver={event => {
              event.preventDefault()
              setIsDragActive(true)
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            fileInputRef={fileInputRef}
          />
        </div>

        <PostFooterActions
          onMediaClick={() => fileInputRef.current?.click()}
          onEmojiClick={() => setShowEmojiPicker(current => !current)}
          onLocationClick={() => setShowLocationInput(current => !current)}
          onPostClick={handleSubmit}
          hasPostContent={hasPostContent}
          isPosting={isCreatingPost || isUploading}
        />
      </div>
    </div>
  )
}

export default CreatePostModal
