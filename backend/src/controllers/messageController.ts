import type { Request, Response, NextFunction } from 'express'
import { parsePaginationParams } from '../types/index.js'
import {
  createMessageService,
  getMessageByIdService,
  getConversationMessagesService,
  updateMessageService,
  deleteMessageService,
  markMessageAsReadService,
  markConversationMessagesAsReadService,
} from '../services/messageService.js'
import { getConversationByIdService } from '../services/conversationService.js'

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId, content, attachments, sharedPost } = req.body
    const userId = req.user!.userId

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required',
      })
    }

    if (!content && (!attachments || attachments.length === 0) && !sharedPost) {
      return res.status(400).json({
        success: false,
        message: 'Content, attachments, or shared post data is required',
      })
    }

    // Verify user is a participant using ObjectId comparison
    const conversation = await getConversationByIdService({ conversationId })
    const isParticipant = conversation.participants.some(p => String(p._id) === userId)
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const result = await createMessageService({ senderId: userId, conversationId, content, attachments, sharedPost })

    return res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getConversationMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = String(req.params.conversationId)
    const userId = req.user!.userId
    const { page, limit } = parsePaginationParams(req.query)

    // Verify user is a participant using ObjectId comparison
    const conversation = await getConversationByIdService({ conversationId })
    const isParticipant = conversation.participants.some(p => String(p._id) === userId)
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const result = await getConversationMessagesService({ conversationId, page: page, limit: limit })

    return res.status(200).json({
      success: true,
      message: 'Conversation messages retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = String(req.params.messageId)
    const userId = req.user!.userId

    const message = await getMessageByIdService({ messageId })

    // Verify user is a participant in the conversation using ObjectId comparison
    const conversation = await getConversationByIdService({ conversationId: String(message.conversation) })
    const isParticipant = conversation.participants.some(p => String(p._id) === userId)
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const updatedMessage = await markMessageAsReadService({ messageId, userId })

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: updatedMessage,
    })
  } catch (error) {
    next(error)
  }
}

export const markConversationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = String(req.params.conversationId)
    const userId = req.user!.userId

    // Verify user is a participant using ObjectId comparison
    const conversation = await getConversationByIdService({ conversationId })
    const isParticipant = conversation.participants.some(p => String(p._id) === userId)
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const result = await markConversationMessagesAsReadService({ conversationId, userId })

    return res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = String(req.params.messageId)
    const userId = req.user!.userId
    const { content } = req.body

    const updatedMessage = await updateMessageService({ messageId, userId, data: { content } })

    return res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: updatedMessage,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageId = String(req.params.messageId)
    const userId = req.user!.userId

    await deleteMessageService({ messageId, userId })

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}
