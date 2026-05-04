import {
  createStoryService,
  getStoriesForUserService,
  getUserStoriesService,
  markStoryViewedService,
  deleteStorySlideService,
} from '../services/storyService.js'

const formatStory = (story, currentUserId) => {
  const seen =
    story.hasUnviewed !== undefined
      ? !story.hasUnviewed
      : story.viewedBy?.some(viewerId => viewerId.toString() === currentUserId)
  return {
    id: story._id.toString(),
    user: {
      id: story.author._id.toString(),
      name: story.author.fullName,
      avatar: story.author.profilePicture || '',
    },
    slides: story.slides.map(slide => ({
      id: slide._id.toString(),
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

export const createStory = async (req, res, next) => {
  try {
    const { slides } = req.body
    const author = req.user.userId

    if (!Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one story slide is required',
      })
    }

    const validatedSlides = slides.map(slide => ({
      mediaUrl: slide.mediaUrl,
      type: slide.type || 'image',
      caption: slide.caption?.trim() || '',
      duration: Number(slide.duration) || 5000,
      timestamp: slide.timestamp?.trim() || '',
    }))

    const story = await createStoryService({ author, slides: validatedSlides })
    const result = await story.populate('author', 'fullName profilePicture')

    return res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: formatStory(result, author),
    })
  } catch (error) {
    next(error)
  }
}

export const getStories = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const stories = await getStoriesForUserService(userId)

    return res.status(200).json({
      success: true,
      message: 'Stories retrieved successfully',
      data: stories.map(story => formatStory(story, userId)),
    })
  } catch (error) {
    next(error)
  }
}

export const getUserStories = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { userId: targetUserId } = req.params
    const stories = await getUserStoriesService(userId, targetUserId)

    return res.status(200).json({
      success: true,
      message: 'User stories retrieved successfully',
      data: stories.map(story => formatStory(story, userId)),
    })
  } catch (error) {
    next(error)
  }
}

export const markStoryViewed = async (req, res, next) => {
  try {
    const { storyId } = req.params
    const userId = req.user.userId

    const story = await markStoryViewedService(storyId, userId)
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

export const deleteStorySlide = async (req, res, next) => {
  try {
    const { slideId } = req.params
    const userId = req.user.userId

    const result = await deleteStorySlideService(slideId, userId)
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
