import React, { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { useModal } from '../../context/ModalContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { updateProfile, getCurrentProfile } from '../../services/userService.js'
import { uploadImage } from '../../services/uploadService.js'
import { useModalAnimation } from '../../animations/useModalAnimation.js'
import { editProfileSchema } from '../../schemas/user.schema.js'
import type { EditProfileInput } from '../../schemas/user.schema.js'
import ProfileImageUpload from './ProfileImageUpload.jsx'
import Spinner from '../loading/Spinner'
import ProfileForm from './ProfileForm.jsx'

interface ProcessedFile {
  id: string
  file: File
  type: 'image' | 'video'
  preview: string
}

const EditProfileModal = () => {
  const { isEditProfileOpen, closeEditProfileModal } = useModal()
  const { user: currentUser, setUser } = useAuth()
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const { isRendered } = useModalAnimation(isEditProfileOpen, {
    overlayRef,
    modalRef,
    onCloseComplete: () => {
      resetForm()
    },
  })

  const [avatarPreview, setAvatarPreview] = useState(currentUser?.profilePicture || '')
  const [coverPreview, setCoverPreview] = useState(currentUser?.coverPicture || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: currentUser?.fullName || '',
      bio: currentUser?.bio || '',
      username: currentUser?.username || '',
      location: '',
    },
  })

  const hasChanges = isDirty || avatarFile !== null || coverFile !== null

  useEffect(() => {
    if (!isEditProfileOpen) return undefined

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeEditProfileModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditProfileOpen, closeEditProfileModal])

  // When the modal opens, prefill form with the current user's latest data
  useEffect(() => {
    if (!isEditProfileOpen) return
    reset({
      fullName: currentUser?.fullName || '',
      bio: currentUser?.bio || '',
      username: currentUser?.username || '',
      location: '',
    })
    setTimeout(() => setAvatarPreview(currentUser?.profilePicture || ''), 0)
    setTimeout(() => setCoverPreview(currentUser?.coverPicture || ''), 0)
    setTimeout(() => setAvatarFile(null), 0)
    setTimeout(() => setCoverFile(null), 0)
  }, [isEditProfileOpen, currentUser, reset])

  const resetForm = () => {
    reset({
      fullName: currentUser?.fullName || '',
      bio: currentUser?.bio || '',
      username: currentUser?.username || '',
      location: '',
    })
    setAvatarPreview(currentUser?.profilePicture || '')
    setCoverPreview(currentUser?.coverPicture || '')
    setAvatarFile(null)
    setCoverFile(null)
  }

  const handleAvatarChange = (files: ProcessedFile[]) => {
    if (files.length > 0) {
      setAvatarFile(files[0].file)
      setAvatarPreview(files[0].preview)
    }
  }

  const handleCoverChange = (files: ProcessedFile[]) => {
    if (files.length > 0) {
      setCoverFile(files[0].file)
      setCoverPreview(files[0].preview)
    }
  }

  const onFormSubmit = async (data: EditProfileInput) => {
    try {
      setIsSaving(true)

      let profilePicture = currentUser?.profilePicture
      let coverPicture = currentUser?.coverPicture

      if (avatarFile) {
        profilePicture = await uploadImage(avatarFile)
      }

      if (coverFile) {
        coverPicture = await uploadImage(coverFile)
      }

      await updateProfile({
        fullName: data.fullName,
        username: data.username,
        bio: data.bio,
        profilePicture,
        coverPicture,
      })

      // re-fetch the authoritative profile so any server-side normalization (timestamps, urls)
      // is reflected immediately in the app state and image cache-busting works reliably
      const fresh = await getCurrentProfile()
      // Append cache-busting query param to image URLs so browser reloads them immediately
      const appendCacheBuster = (url: string | undefined) => {
        if (!url) return url
        try {
          const u = new URL(url)
          u.searchParams.set('v', Date.now().toString())
          return u.toString()
        } catch (err) {
          void err
          // If URL constructor fails (relative URL), fallback to simple append
          return url.includes('?') ? `${url}&v=${Date.now()}` : `${url}?v=${Date.now()}`
        }
      }

      const freshWithBust = {
        ...fresh,
        profilePicture: appendCacheBuster(fresh.profilePicture) || '',
        coverPicture: appendCacheBuster(fresh.coverPicture) || '',
      }

      setUser(freshWithBust)
      // Notify pages that rely on fetched profile data to update (e.g., Profile page)
      try {
        window.dispatchEvent(new CustomEvent('profile-updated', { detail: freshWithBust }))
      } catch (err) {
        void err
      }
      toast.success('Profile updated successfully')
      closeEditProfileModal()
      resetForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isRendered) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
      <div ref={overlayRef} className="absolute inset-0 bg-black/40 backdrop-blur-xl" onClick={closeEditProfileModal} />

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
        <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex-1 overflow-y-auto no-scrollbar">
          <div className="px-4 py-4 sm:px-5">
            <ProfileImageUpload
              avatarSrc={avatarPreview}
              coverSrc={coverPreview}
              userName={currentUser?.fullName || ''}
              onAvatarChange={handleAvatarChange}
              onCoverChange={handleCoverChange}
            />

            <ProfileForm register={register} errors={errors} />
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
                type="submit"
                disabled={!hasChanges || isSaving}
                className={`inline-flex min-w-[92px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  hasChanges && !isSaving ? 'bg-white text-black hover:bg-white/92' : 'bg-white/8 text-white/28'
                }`}
              >
                {isSaving ? (
                  <>
                    <Spinner size="sm" inline />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
