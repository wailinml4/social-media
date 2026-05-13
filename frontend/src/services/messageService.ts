import type { MessageAttachment, PaginatedResponse, SharedPostPayload, MessagesResponse } from '../types'
import type { Message } from '../types'
import axiosInstance from '../config/api.js'

export const createMessage = async (
  conversationId: string,
  content: string,
  attachments: MessageAttachment[] = [],
  sharedPost: SharedPostPayload | null = null,
): Promise<Message> => {
  const response = await axiosInstance.post('/messages', {
    conversationId,
    content,
    attachments,
    sharedPost,
  })
  return response.data.data
}

export const getMessages = async (conversationId: string, page: number = 1, limit: number = 50): Promise<MessagesResponse<Message>> => {
  const response = await axiosInstance.get(`/messages/conversation/${conversationId}`, {
    params: { page, limit },
  })
  return response.data.data
}

export const markMessageAsRead = async (messageId: string): Promise<Message> => {
  const response = await axiosInstance.put(`/messages/${messageId}/read`)
  return response.data.data
}

export const updateMessage = async (messageId: string, content: string): Promise<Message> => {
  const response = await axiosInstance.put(`/messages/${messageId}`, { content })
  return response.data.data
}

export const deleteMessage = async (messageId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/messages/${messageId}`)
  return response.data.data
}
