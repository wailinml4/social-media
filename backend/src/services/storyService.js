import Story from "../models/Story.js"
import Follow from "../models/Follow.js"
import { checkFollowStatusService } from "./followService.js"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const createStoryService = async ({ author, slides }) => {
    const expiresAt = new Date(Date.now() + ONE_DAY_MS)
    const normalizedSlides = slides.map((slide, index) => ({
        mediaUrl: slide.mediaUrl,
        type: slide.type || "image",
        caption: slide.caption || "",
        duration: slide.duration ?? 5000,
        timestamp: slide.timestamp || "",
    }))

    const story = await Story.create({
        author,
        slides: normalizedSlides,
        expiresAt,
    })

    return story
}

export const getStoriesForUserService = async (userId) => {
    const following = await Follow.find({ follower: userId }).select("following").lean()
    const followingIds = following.map((item) => item.following)

    if (!followingIds.length) {
        return []
    }

    const stories = await Story.find({
        author: { $in: followingIds },
        expiresAt: { $gt: new Date() },
    })
        .sort({ author: 1, createdAt: 1 })
        .populate("author", "fullName profilePicture")
        .lean()

    const grouped = new Map()

    for (const story of stories) {
        const authorId = story.author._id.toString()
        const hasViewed = story.viewedBy.some((viewerId) => viewerId.toString() === userId)
        const existing = grouped.get(authorId)

        if (!existing) {
            grouped.set(authorId, {
                _id: authorId,
                author: story.author,
                slides: [...story.slides],
                viewedBy: [...story.viewedBy],
                hasUnviewed: !hasViewed,
                latestCreatedAt: story.createdAt?.getTime() || Date.now(),
            })
            continue
        }

        existing.slides.push(...story.slides)
        existing.latestCreatedAt = Math.max(existing.latestCreatedAt, story.createdAt?.getTime() || 0)
        existing.hasUnviewed = existing.hasUnviewed || !hasViewed

        story.viewedBy.forEach((viewerId) => {
            if (!existing.viewedBy.some((id) => id.toString() === viewerId.toString())) {
                existing.viewedBy.push(viewerId)
            }
        })
    }

    return Array.from(grouped.values()).sort((a, b) => b.latestCreatedAt - a.latestCreatedAt)
}

export const getUserStoriesService = async (viewerId, authorId) => {
    const isOwner = viewerId === authorId
    if (!isOwner) {
        const isFollowing = await checkFollowStatusService(viewerId, authorId)
        if (!isFollowing) {
            return []
        }
    }

    const stories = await Story.find({
        author: authorId,
        expiresAt: { $gt: new Date() },
    })
        .sort({ createdAt: 1 })
        .populate("author", "fullName profilePicture")
        .lean()

    if (!stories.length) {
        return []
    }

    const grouped = {
        _id: authorId,
        author: stories[0].author,
        slides: [],
        viewedBy: [],
        hasUnviewed: false,
        latestCreatedAt: stories[stories.length - 1].createdAt?.getTime() || Date.now(),
    }

    for (const story of stories) {
        grouped.slides.push(...story.slides)
        grouped.hasUnviewed = grouped.hasUnviewed || !story.viewedBy.some((viewer) => viewer.toString() === viewerId)
        story.viewedBy.forEach((viewer) => {
            if (!grouped.viewedBy.some((id) => id.toString() === viewer.toString())) {
                grouped.viewedBy.push(viewer)
            }
        })
    }

    return [grouped]
}

export const markStoryViewedService = async (storyId, userId) => {
    let authorId = storyId
    const story = await Story.findById(storyId)
    if (story) {
        authorId = story.author
    }

    const updateResult = await Story.updateMany(
        {
            author: authorId,
            expiresAt: { $gt: new Date() },
        },
        {
            $addToSet: { viewedBy: userId },
        }
    )

    if (updateResult.matchedCount === 0) {
        return null
    }

    return await Story.findOne({ author: authorId, expiresAt: { $gt: new Date() } })
}

export const deleteStorySlideService = async (slideId, userId) => {
    const updatedStory = await Story.findOneAndUpdate(
        { author: userId, 'slides._id': slideId },
        { $pull: { slides: { _id: slideId } } },
        { returnDocument: 'after' }
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
