import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStorySchema } from '../../schemas/chat.schema.js'
import type { z } from 'zod'
import ValidatedInput from '../ui/ValidatedInput.jsx'

type StoryFormValues = Omit<z.input<typeof createStorySchema>, 'media'>

interface CreateStoryFormProps {
  onSubmit: (data: StoryFormValues & { media: File }) => Promise<void>
}

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({ onSubmit }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(createStorySchema.omit({ media: true })) as never,
    defaultValues: {
      caption: '',
      duration: 10,
      isPrivate: false,
      allowComments: true,
      allowReactions: true,
    },
  })

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      const preview = URL.createObjectURL(file)
      setMediaPreview(preview)
    }
  }

  const onFormSubmit = async (data: StoryFormValues) => {
    if (!mediaFile) {
      alert('Please select a media file')
      return
    }

    await onSubmit({
      ...data,
      media: mediaFile,
    })

    // Reset form
    setMediaFile(null)
    setMediaPreview('')
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Media (Image or Video)</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {!mediaFile && <p className="text-sm text-red-500 mt-1">Please select a media file</p>}
      </div>

      {mediaPreview && (
        <div className="mt-2">
          {mediaFile?.type.startsWith('image/') ? (
            <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          ) : (
            <video src={mediaPreview} className="w-full h-48 object-cover rounded-lg" controls />
          )}
        </div>
      )}

      <ValidatedInput
        label="Caption"
        type="text"
        placeholder="Add a caption to your story..."
        registration={register('caption')}
        error={errors.caption?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
          <input
            type="number"
            {...register('duration', { valueAsNumber: true })}
            min="1"
            max="60"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration.message?.toString()}</p>}
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" {...register('isPrivate')} className="mr-2" />
            <span className="text-sm text-gray-700">Private Story</span>
          </label>

          <label className="flex items-center">
            <input type="checkbox" {...register('allowComments')} className="mr-2" />
            <span className="text-sm text-gray-700">Allow Comments</span>
          </label>

          <label className="flex items-center">
            <input type="checkbox" {...register('allowReactions')} className="mr-2" />
            <span className="text-sm text-gray-700">Allow Reactions</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !mediaFile}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating Story...' : 'Create Story'}
      </button>
    </form>
  )
}

export default CreateStoryForm
