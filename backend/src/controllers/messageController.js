import {
  createMessageService,
  getMessageByIdService,
  getConversationMessagesService,
  markMessageAsReadService,
  markConversationMessagesAsReadService,
} from "../services/messageService.js"
import { getConversationByIdService } from "../services/conversationService.js"
import mongoose from "mongoose"

export const createMessage = async (req, res, next) => {
  try {
    const { conversationId, content, attachments, sharedPost } = req.body
    const userId = req.user.userId

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
    const conversation = await getConversationByIdService(conversationId)
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const isParticipant = conversation.participants.some(
      (p) => p._id && p._id.equals(userObjectId)
    )
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const result = await createMessageService(userId, conversationId, content, attachments, sharedPost)

    return res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is a participant using ObjectId comparison
    const conversation = await getConversationByIdService(conversationId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isParticipant = conversation.participants.some(
      (p) => p._id && p._id.equals(userObjectId)
    );
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      });
    }

    const result = await getConversationMessagesService(
      conversationId,
      parseInt(page),
      parseInt(limit)
    );

    return res.status(200).json({
      success: true,
      message: 'Conversation messages retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params
    const userId = req.user.userId

    const message = await getMessageByIdService(messageId)

    // Verify user is a participant in the conversation using ObjectId comparison
    const conversation = await getConversationByIdService(message.conversation)
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const isParticipant = conversation.participants.some(
      (p) => p._id && p._id.equals(userObjectId)
    )
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const updatedMessage = await markMessageAsReadService(messageId, userId)

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: updatedMessage,
    })
  } catch (error) {
    next(error)
  }
}

export const markConversationAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params
    const userId = req.user.userId

    // Verify user is a participant using ObjectId comparison
    const conversation = await getConversationByIdService(conversationId)
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const isParticipant = conversation.participants.some(
      (p) => p._id && p._id.equals(userObjectId)
    )
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      })
    }

    const result = await markConversationMessagesAsReadService(conversationId, userId)

    return res.status(200).json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    next(error)
  }
}
