import type { Request, Response, NextFunction } from 'express'
import { parsePaginationParams } from '../types/index.js'
import {
  createConversationService,
  getConversationByIdService,
  getUserConversationsService,
  markConversationAsReadService,
} from '../services/conversationService.js'

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const participants = req.body.participants || req.body.participantIds
    const userId = req.user!.userId

    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        message: 'Participants array is required',
      })
    }

    // Add current user to participants if not already included
    if (!participants.includes(userId)) {
      participants.push(userId)
    }

    const conversation = await createConversationService({ participants })

    return res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = String(req.params.conversationId)
    const userId = req.user!.userId

    const conversation = await getConversationByIdService({ conversationId })

    // Verify user is a participant using ObjectId comparison
    const isParticipant = conversation.participants.some(p => String(p._id) === userId)

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation retrieved successfully',
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const { page, limit } = parsePaginationParams(req.query)

    const result = await getUserConversationsService({ userId, page: page, limit: limit })

    return res.status(200).json({
      success: true,
      message: 'User conversations retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversationId = String(req.params.conversationId)
    const userId = req.user!.userId

    const conversation = await getConversationByIdService({ conversationId })

    // Verify user is a participant using ObjectId comparison
    const isParticipant = conversation.participants.some(p => String(p._id) === userId)

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const result = await markConversationAsReadService({ conversationId, userId })

    return res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    next(error)
  }
}
