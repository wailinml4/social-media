import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import toast from 'react-hot-toast'
import { X, Plus } from 'lucide-react'
import Spinner from '../loading/Spinner'
import { useModal } from '../../context/ModalContext.jsx'
import { uploadImage } from '../../services/uploadService.js'
import { createStory } from '../../services/storyService.js'

interface StoryMediaItem {
  id: string
  file: File
  type: 'image' | 'video'
  preview: string
  caption: string
}

const CreateStoryModal = () => {
  const { isCreateStoryOpen, closeCreateStoryModal } = useModal()
  const [mediaItems, setMediaItems] = useState<StoryMediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasMedia = mediaItems.length > 0

  useEffect(() => {
    if (!isCreateStoryOpen) return undefined

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCreateStoryModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCreateStoryOpen, closeCreateStoryModal])

  useEffect(() => {
    return () => {
      mediaItems.forEach(item => URL.revokeObjectURL(item.preview))
    }
  }, [mediaItems])

  const resetComposer = () => {
    mediaItems.forEach(item => URL.revokeObjectURL(item.preview))
    setMediaItems([])
  }

  const addFiles = (files: FileList) => {
    const nextItems = Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .map(file => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        preview: URL.createObjectURL(file),
        caption: '',
      }))

    if (!nextItems.length) return
    setMediaItems(current => [...current, ...(nextItems as StoryMediaItem[])])
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return
    addFiles(event.target.files)
  }

  const removeMediaItem = (id: string) => {
    setMediaItems(current => {
      const item = current.find(entry => entry.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return current.filter(entry => entry.id !== id)
    })
  }

  const updateCaption = (id: string, caption: string) => {
    setMediaItems(current => current.map(item => (item.id === id ? { ...item, caption } : item)))
  }

  const handleSubmit = async () => {
    if (!hasMedia) {
      toast.error('Add at least one image or video to create a story')
      return
    }

    try {
      setIsUploading(true)
      const slides = []

      for (const item of mediaItems) {
        const mediaUrl = await uploadImage(item.file)
        slides.push({
          mediaUrl,
          type: item.type,
          caption: item.caption,
          duration: 6000,
          timestamp: new Date().toISOString(),
        })
      }

      await createStory(slides)
      toast.success('Story uploaded successfully')
      resetComposer()
      closeCreateStoryModal()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload story')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isCreateStoryOpen) return null

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={closeCreateStoryModal} />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#070707] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Create Story</h2>
            <p className="text-sm text-white/50">Add one or more images or videos to your story.</p>
          </div>

          <button
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            onClick={closeCreateStoryModal}
            aria-label="Close story composer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <div className="rounded-3xl border border-white/10 bg-neutral-950 p-4 text-sm text-white/70">
              <p className="mb-3 text-white">Upload story media</p>
              <p className="mb-4">Stories expire after 24 hours and are visible to people you follow.</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4" />
                Add media
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="grid gap-4">
            {mediaItems.length ? (
              mediaItems.map(item => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-neutral-950 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3 overflow-hidden rounded-2xl bg-black">
                        {item.type === 'video' ? (
                          <video src={item.preview} controls className="h-48 w-full object-cover" />
                        ) : (
                          <img src={item.preview} alt="Story preview" className="h-48 w-full object-cover" />
                        )}
                      </div>

                      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/50 mb-2">Slide caption</label>
                      <textarea
                        rows={2}
                        value={item.caption}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateCaption(item.id, event.target.value)}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
                        placeholder="Add a caption (optional)"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMediaItem(item.id)}
                      className="mt-1 rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                      aria-label="Remove media"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-neutral-950 p-6 text-center text-white/60">
                Select image or video files to create your story.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={closeCreateStoryModal}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasMedia || isUploading}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? <Spinner size="sm" /> : 'Post story'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateStoryModal
