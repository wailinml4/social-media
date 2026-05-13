import type { Request, Response, NextFunction } from 'express'
import {
  createStoryService,
  getStoriesForUserService,
  getUserStoriesService,
  markStoryViewedService,
  deleteStorySlideService,
} from '../services/storyService.js'
import type { IStorySlide } from '../models/Story.js'
import mongoose from 'mongoose'

interface StoryAuthor {
  _id: mongoose.Types.ObjectId | string
  fullName?: string
  profilePicture?: string
}

interface StoryFormatInput {
  _id: mongoose.Types.ObjectId | string
  author: StoryAuthor
  slides: IStorySlide[]
  viewedBy?: Array<mongoose.Types.ObjectId | string>
  hasUnviewed?: boolean
  createdAt?: Date
}

interface SlideInput {
  mediaUrl?: string
  type?: string
  caption?: string
  duration?: number
  timestamp?: string
}

const formatStory = (story: StoryFormatInput, currentUserId: string) => {
  const seen = story.hasUnviewed !== undefined ? !story.hasUnviewed : story.viewedBy?.some(viewerId => String(viewerId) === currentUserId)
  return {
    id: String(story._id),
    user: {
      id: String(story.author._id),
      name: story.author.fullName,
      avatar: story.author.profilePicture || '',
    },
    slides: story.slides.map(slide => ({
      id: String(slide._id),
      mediaUrl: slide.mediaUrl,
      type: slide.type,
      caption: slide.caption,
      duration: slide.duration,
      timestamp: slide.timestamp,
    })),
    seen,
    createdAt: story.createdAt,
  }
}

export const createStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slides } = req.body
    const author = req.user!.userId

    if (!Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one story slide is required',
      })
    }

    const rawSlides: SlideInput[] = Array.isArray(slides) ? slides : []
    const validatedSlides = rawSlides.map(slide => {
      const type: 'image' | 'video' = slide.type === 'video' ? 'video' : 'image'
      return {
        mediaUrl: slide.mediaUrl || '',
        type,
        caption: slide.caption?.trim() || '',
        duration: Number(slide.duration) || 5000,
        timestamp: slide.timestamp?.trim() || '',
      }
    })

    const story = await createStoryService({ author, slides: validatedSlides })
    const result = await story.populate<{ author: StoryAuthor }>('author', 'fullName profilePicture')

    return res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: formatStory(result, author),
    })
  } catch (error) {
    next(error)
  }
}

export const getStories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const stories = await getStoriesForUserService({ userId })

    return res.status(200).json({
      success: true,
      message: 'Stories retrieved successfully',
      data: stories.map(story => formatStory(story, userId)),
    })
  } catch (error) {
    next(error)
  }
}

export const getUserStories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const targetUserId = String(req.params.userId)
    const stories = await getUserStoriesService({ viewerId: userId, authorId: targetUserId })

    return res.status(200).json({
      success: true,
      message: 'User stories retrieved successfully',
      data: stories.map(story => formatStory(story, userId)),
    })
  } catch (error) {
    next(error)
  }
}

export const markStoryViewed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storyId = String(req.params.storyId)
    const userId = req.user!.userId

    const story = await markStoryViewedService({ storyId, userId })
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Story marked as viewed',
      data: { storyId },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteStorySlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slideId = String(req.params.slideId)
    const userId = req.user!.userId

    const result = await deleteStorySlideService({ slideId, userId })
    if (result === null) {
      return res.status(404).json({
        success: false,
        message: 'Story slide not found or not authorized',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Story slide deleted successfully',
      data: { slideId, storyRemoved: result.storyRemoved },
    })
  } catch (error) {
    next(error)
  }
}
