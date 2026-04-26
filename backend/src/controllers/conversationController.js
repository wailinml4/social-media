import {
  createConversationService,
  getConversationByIdService,
  getUserConversationsService,
  markConversationAsReadService,
} from '../services/conversationService.js';
import mongoose from 'mongoose';

export const createConversation = async (req, res, next) => {
  try {
    const { participants } = req.body;
    const userId = req.user.userId;

    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        message: 'Participants array is required',
      });
    }

    // Add current user to participants if not already included
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const conversation = await createConversationService(participants);

    return res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const conversation = await getConversationByIdService(id);

    // Verify user is a participant using ObjectId comparison
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

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { offset = 0, limit = 20 } = req.query;

    const result = await getUserConversationsService(
      userId,
      parseInt(offset),
      parseInt(limit)
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const conversation = await getConversationByIdService(id);

    // Verify user is a participant using ObjectId comparison
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

    const result = await markConversationAsReadService(id, userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
