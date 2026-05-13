import type { PaginatedResponse, ConversationsResponse } from '../types'
import type { Conversation } from '../types'
import axiosInstance from '../config/api.js'

export const createConversation = async (participants: string[]): Promise<Conversation> => {
  const response = await axiosInstance.post('/conversations', { participants })
  return response.data.data
}

export const getConversations = async (page: number = 1, limit: number = 20): Promise<ConversationsResponse<Conversation>> => {
  const response = await axiosInstance.get('/conversations', {
    params: { page, limit },
  })
  return response.data.data
}

export const getConversation = async (conversationId: string): Promise<Conversation> => {
  const response = await axiosInstance.get(`/conversations/${conversationId}`)
  return response.data.data
}

export const markConversationAsRead = async (conversationId: string): Promise<Conversation> => {
  const response = await axiosInstance.put(`/conversations/${conversationId}/read`)
  return response.data.data
}
