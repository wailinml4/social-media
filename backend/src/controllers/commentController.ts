import type { Request, Response, NextFunction } from 'express'
import { parsePaginationParams } from '../types/index.js'
import {
  createCommentService,
  getPostCommentsService,
  getCommentRepliesService,
  updateCommentService,
  deleteCommentService,
} from '../services/commentService.js'

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const { content, parentId } = req.body
    const userId = req.user!.userId

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      })
    }

    const comment = await createCommentService({ postId, userId, content, parentId })

    return res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment,
    })
  } catch (error) {
    next(error)
  }
}

export const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const { page, limit } = parsePaginationParams(req.query)

    const result = await getPostCommentsService({ postId, page, limit })

    return res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getCommentReplies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = String(req.params.commentId)
    const { page, limit } = parsePaginationParams(req.query)

    const result = await getCommentRepliesService({ commentId, page, limit })

    return res.status(200).json({
      success: true,
      message: 'Replies retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = String(req.params.commentId)
    const { content } = req.body
    const userId = req.user!.userId

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      })
    }

    const comment = await updateCommentService({ commentId, userId, content })

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = String(req.params.commentId)
    const userId = req.user!.userId

    const result = await deleteCommentService({ commentId, userId })

    return res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    })
  } catch (error) {
    next(error)
  }
}
