import {
  createPostService,
  getAllPostsService,
  getFollowingPostsService,
  getExplorePostsService,
  getUserPostsService,
  getBookmarkedPostsService,
  getLikedPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  getFriendsPostsService,
} from '../services/postService.js'

export const createPost = async (req, res, next) => {
  try {
    const { description, media, images } = req.body
    const author = req.user.userId

    // Validate that at least description or media/images is provided
    if (
      !description?.trim() &&
      (!media || media.length === 0) &&
      (!images || images.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Post must have a caption or media',
      })
    }

    const post = await createPostService({ description, media, author, images })

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, filter = 'for_you' } = req.query
    const result = await getAllPostsService({
      page: parseInt(page),
      limit: parseInt(limit),
      filter,
    })

    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getFollowingPosts = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 10 } = req.query
    const result = await getFollowingPostsService({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    })

    return res.status(200).json({
      success: true,
      message: 'Following posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getExplorePosts = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 10 } = req.query
    const result = await getExplorePostsService({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    })

    return res.status(200).json({
      success: true,
      message: 'Explore posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query
    const result = await getUserPostsService({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    })

    return res.status(200).json({
      success: true,
      message: 'User posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getBookmarkedPosts = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query
    const result = await getBookmarkedPostsService({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    })

    return res.status(200).json({
      success: true,
      message: 'Bookmarked posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getLikedPosts = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 10 } = req.query
    const result = await getLikedPostsService({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    })

    return res.status(200).json({
      success: true,
      message: 'Liked posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params
    const post = await getPostByIdService(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const { description, media, images } = req.body
    const userId = req.user.userId

    const existingPost = await getPostByIdService(postId)
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    if (existingPost.author._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own posts',
      })
    }

    const post = await updatePostService(postId, { description, media, images })

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const userId = req.user.userId

    const post = await getPostByIdService(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    if (post.author._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      })
    }

    await deletePostService(postId)

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const getFriendsPosts = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { page = 1, limit = 10 } = req.query
    const result = await getFriendsPostsService({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    })

    return res.status(200).json({
      success: true,
      message: 'Friends posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
