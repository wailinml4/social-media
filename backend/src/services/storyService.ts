import Story, { IStory, IStorySlide } from '../models/Story.js'
import Follow, { IFollow } from '../models/Follow.js'
import { checkFollowStatusService } from './followService.js'
import mongoose from 'mongoose'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

interface SlideInput {
  mediaUrl: string
  type?: 'image' | 'video'
  caption?: string
  duration?: number
  timestamp?: string
}

interface CreateStoryInput {
  author: string
  slides: SlideInput[]
}

interface GetStoriesInput {
  userId: string
}

interface GetUserStoriesInput {
  viewerId: string
  authorId: string
}

interface MarkStoryViewedInput {
  storyId: string
  userId: string
}

interface DeleteStorySlideInput {
  slideId: string
  userId: string
}

type AuthorLean = { _id: mongoose.Types.ObjectId; fullName?: string; profilePicture?: string }
type StoryLean = {
  _id: mongoose.Types.ObjectId
  author: AuthorLean
  slides: IStorySlide[]
  viewedBy: Array<mongoose.Types.ObjectId | string>
  expiresAt: Date
  createdAt?: Date
}

interface GroupedStory {
  _id: string
  author: AuthorLean
  slides: IStorySlide[]
  viewedBy: Array<mongoose.Types.ObjectId | string>
  hasUnviewed: boolean
  latestCreatedAt: number
}

export const createStoryService = async ({ author, slides }: CreateStoryInput) => {
  const expiresAt = new Date(Date.now() + ONE_DAY_MS)
  const normalizedSlides: SlideInput[] = slides.map(slide => ({
    mediaUrl: slide.mediaUrl,
    type: slide.type || 'image',
    caption: slide.caption || '',
    duration: slide.duration ?? 5000,
    timestamp: slide.timestamp || '',
  }))

  const story = await Story.create({
    author,
    slides: normalizedSlides,
    expiresAt,
  })

  return story
}

export const getStoriesForUserService = async ({ userId }: GetStoriesInput) => {
  const following = await Follow.find({ follower: userId }).select('following').lean<Pick<IFollow, 'following'>[]>()
  const followingIds = following.map(item => item.following)

  if (!followingIds.length) {
    return []
  }

  const stories = await Story.find({
    author: { $in: followingIds },
    expiresAt: { $gt: new Date() },
  })
    .sort({ author: 1, createdAt: 1 })
    .populate('author', 'fullName profilePicture')
    .lean<StoryLean[]>()

  const grouped = new Map<string, GroupedStory>()

  for (const story of stories) {
    const authorId = String(story.author._id)
    const hasViewed = story.viewedBy.some(viewerId => String(viewerId) === userId)
    const existing = grouped.get(authorId)

    if (!existing) {
      grouped.set(authorId, {
        _id: authorId,
        author: story.author,
        slides: [...story.slides],
        viewedBy: [...story.viewedBy],
        hasUnviewed: !hasViewed,
        latestCreatedAt: story.createdAt?.getTime() ?? Date.now(),
      })
      continue
    }

    existing.slides.push(...story.slides)
    existing.latestCreatedAt = Math.max(existing.latestCreatedAt, story.createdAt?.getTime() ?? 0)
    existing.hasUnviewed = existing.hasUnviewed || !hasViewed

    for (const viewerId of story.viewedBy) {
      if (!existing.viewedBy.some(id => String(id) === String(viewerId))) {
        existing.viewedBy.push(viewerId)
      }
    }
  }

  return Array.from(grouped.values()).sort((a, b) => b.latestCreatedAt - a.latestCreatedAt)
}

export const getUserStoriesService = async ({ viewerId, authorId }: GetUserStoriesInput) => {
  const isOwner = viewerId === authorId
  if (!isOwner) {
    const isFollowing = await checkFollowStatusService({ currentUserId: viewerId, targetUserId: authorId })
    if (!isFollowing) {
      return []
    }
  }

  const stories = await Story.find({
    author: authorId,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: 1 })
    .populate('author', 'fullName profilePicture')
    .lean<StoryLean[]>()

  if (!stories.length) {
    return []
  }

  const grouped: GroupedStory = {
    _id: authorId,
    author: stories[0].author,
    slides: [],
    viewedBy: [],
    hasUnviewed: false,
    latestCreatedAt: stories[stories.length - 1].createdAt?.getTime() ?? Date.now(),
  }

  for (const story of stories) {
    grouped.slides.push(...story.slides)
    grouped.hasUnviewed = grouped.hasUnviewed || !story.viewedBy.some(viewer => String(viewer) === viewerId)
    for (const viewer of story.viewedBy) {
      if (!grouped.viewedBy.some(id => String(id) === String(viewer))) {
        grouped.viewedBy.push(viewer)
      }
    }
  }

  return [grouped]
}

export const markStoryViewedService = async ({ storyId, userId }: MarkStoryViewedInput) => {
  const story = await Story.findById(storyId)
  const authorId: mongoose.Types.ObjectId | string = story ? story.author : storyId

  const updateResult = await Story.updateMany(
    {
      author: authorId,
      expiresAt: { $gt: new Date() },
    },
    {
      $addToSet: { viewedBy: userId },
    },
  )

  if (updateResult.matchedCount === 0) {
    return null
  }

  return await Story.findOne({ author: authorId, expiresAt: { $gt: new Date() } })
}

export const deleteStorySlideService = async ({ slideId, userId }: DeleteStorySlideInput) => {
  const updatedStory = await Story.findOneAndUpdate(
    { author: userId, 'slides._id': slideId },
    { $pull: { slides: { _id: slideId } } },
    { returnDocument: 'after' },
  )

  if (!updatedStory) {
    return null
  }

  if (updatedStory.slides.length === 0) {
    await Story.deleteOne({ _id: updatedStory._id })
    return { deleted: true, storyRemoved: true }
  }

  return { deleted: true, storyRemoved: false }
}
