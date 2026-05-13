import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCommentSchema } from '../../../schemas/post.schema.js'
import type { CreateCommentInput } from '../../../schemas/post.schema.js'
import ValidatedInput from '../../ui/ValidatedInput.jsx'

interface CommentFormProps {
  postId: string
  onSubmit: (data: CreateCommentInput) => Promise<void>
  placeholder?: string
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSubmit, placeholder = 'Add a comment...' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      postId,
      content: '',
    },
  })

  const onFormSubmit = async (data: CreateCommentInput) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-2">
      <ValidatedInput
        label=""
        type="textarea"
        placeholder={placeholder}
        registration={register('content')}
        error={errors.content?.message}
        rows={2}
        className="border-gray-300"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}

export default CommentForm
