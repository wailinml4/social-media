import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import CreatePostHeader from './CreatePostHeader.jsx'
import EmojiPicker from './EmojiPicker.jsx'
import LocationInput from './LocationInput.jsx'
import MediaUploader from './MediaUploader.jsx'
import TagInput from './TagInput.jsx'
import PostAuthorInfo from './PostAuthorInfo.jsx'
import PostContentTextarea from './PostContentTextarea.jsx'
import PostTagsDisplay from './PostTagsDisplay.jsx'
import PostActionButtons from './PostActionButtons.jsx'
import PostFooterActions from './PostFooterActions.jsx'
import { useModal } from '../../../context/ModalContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { usePosts } from '../../../context/PostContext.jsx'
import defaultAvatar from '../../../assets/default-avatar.svg'
import { uploadImage } from '../../../services/uploadService.js'
import { useModalAnimation } from '../../../animations/useModalAnimation.js'
import { createPostSchema } from '../../../schemas/post.schema.js'
import type { z } from 'zod'

type CreatePostFormValues = z.input<typeof createPostSchema>

interface MediaItem {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

const CreatePostModal = () => {
  const { isCreatePostOpen, closeCreatePostModal } = useModal()
  const { user } = useAuth()
  const { createNewPost, isCreatingPost } = usePosts()
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const mediaItemsRef = useRef<MediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      tags: [],
      location: '',
      isPrivate: false,
    },
  })

  const watchedContent = watch('content')
  const watchedTags = watch('tags')
  const watchedLocation = watch('location')

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
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  const hasPostContent = Boolean(watchedContent.trim() || mediaItems.length)

  const locationLabel = useMemo(() => {
    if (!watchedLocation?.trim()) return 'Add location'
    return watchedLocation.trim()
  }, [watchedLocation])

  useEffect(() => {
    mediaItemsRef.current = mediaItems
  }, [mediaItems])

  useEffect(() => {
    if (!isCreatePostOpen) return undefined

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
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
      mediaItemsRef.current.forEach((item: MediaItem) => URL.revokeObjectURL(item.preview))
    }
  }, [])

  const resetComposer = () => {
    mediaItems.forEach((item: MediaItem) => URL.revokeObjectURL(item.preview))
    reset({
      content: '',
      tags: [],
      location: '',
      isPrivate: false,
    })
    setMediaItems([])
    setShowEmojiPicker(false)
    setShowTagInput(false)
    setShowLocationInput(false)
    setIsDragActive(false)
  }

  const addFiles = (files: FileList) => {
    const nextItems: MediaItem[] = Array.from(files)
      .filter((file: File) => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .map((file: File) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video',
        preview: URL.createObjectURL(file),
      }))

    if (!nextItems.length) return

    setMediaItems(currentItems => [...currentItems, ...nextItems])
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragActive(false)
    addFiles(event.dataTransfer.files || [])
  }

  const removeMediaItem = (id: string) => {
    setMediaItems(currentItems => {
      const itemToRemove = currentItems.find((item: MediaItem) => item.id === id)
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.preview)
      }
      return currentItems.filter((item: MediaItem) => item.id !== id)
    })
  }

  const onSubmit = async (data: CreatePostFormValues) => {
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
        description: data.content,
        media: uploadedUrls.map((url: string, index: number) => ({
          url,
          type: mediaItems[index].type,
        })),
      })

      toast.success('Post created successfully')
      closeCreatePostModal()
      resetComposer()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isRendered) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div ref={overlayRef} className="absolute inset-0 bg-black/40 backdrop-blur-xl" onClick={closeCreatePostModal} />

      <div
        ref={modalRef}
        className="relative flex h-[100dvh] w-full flex-col spatial-panel sm:h-auto sm:max-h-[78vh] sm:max-w-[520px]"
      >
        <CreatePostHeader onClose={closeCreatePostModal} />

        <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 py-4 sm:px-5">
          <PostAuthorInfo
            avatar={user?.profilePicture || defaultAvatar}
            name={user?.fullName || 'User'}
            handle={user?.username || user?.email?.split('@')[0] || 'user'}
          />

          <div className="min-w-0 flex-1">
            <textarea
              {...register('content')}
              placeholder="Write a caption..."
              className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-white/50 text-lg"
              rows={3}
            />
            {errors.content && <p className="text-sm text-red-400 mt-1">{errors.content.message?.toString()}</p>}
            <PostTagsDisplay taggedUsers={watchedTags?.join(', ') || ''} location={watchedLocation || ''} />
          </div>

          <PostActionButtons
            onMediaClick={() => fileInputRef.current?.click()}
            onEmojiClick={() => setShowEmojiPicker(current => !current)}
            onTagClick={() => setShowTagInput(current => !current)}
            onLocationClick={() => setShowLocationInput(current => !current)}
            locationLabel={locationLabel}
          />

          {showEmojiPicker && <EmojiPicker onEmojiSelect={(emoji: string) => setValue('content', watchedContent + emoji)} />}

          {showTagInput && (
            <TagInput
              value={watchedTags?.join(', ') || ''}
              onChange={(value: string) =>
                setValue(
                  'tags',
                  value.split(',').map(tag => tag.trim()),
                )
              }
              placeholder="@alex, @sam"
            />
          )}

          {showLocationInput && (
            <LocationInput
              value={watchedLocation || ''}
              onChange={(value: string) => setValue('location', value)}
              placeholder="San Francisco, CA"
            />
          )}

          <MediaUploader
            mediaItems={mediaItems}
            onAddFiles={addFiles}
            onRemoveMedia={removeMediaItem}
            isDragActive={isDragActive}
            onDragOver={(event: React.DragEvent) => {
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
          onPostClick={handleSubmit(onSubmit)}
          hasPostContent={hasPostContent}
          isPosting={isCreatingPost || isUploading}
        />
      </div>
    </div>
  )
}

export default CreatePostModal
