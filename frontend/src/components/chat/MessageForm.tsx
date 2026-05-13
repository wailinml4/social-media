import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendMessageSchema } from '../../schemas/chat.schema.js'
import type { SendMessageInput } from '../../schemas/chat.schema.js'
import ValidatedInput from '../ui/ValidatedInput.jsx'
import Spinner from '../loading/Spinner'

interface MessageFormProps {
  conversationId: string
  onSubmit: (data: SendMessageInput) => Promise<void>
  placeholder?: string
}

const MessageForm: React.FC<MessageFormProps> = ({ conversationId, onSubmit, placeholder = 'Type a message...' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      conversationId,
      content: '',
    },
  })

  const onFormSubmit = async (data: SendMessageInput) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex gap-2">
      <div className="flex-1">
        <ValidatedInput
          label=""
          type="text"
          placeholder={placeholder}
          registration={register('content')}
          error={errors.content?.message}
          className="border-gray-300"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <Spinner size="sm" /> : 'Send'}
      </button>
    </form>
  )
}

export default MessageForm
