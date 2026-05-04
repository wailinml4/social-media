/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getBookmarkedPosts,
  getLikedPosts,
  getFollowingPosts,
  getExplorePosts,
  getFriendsPosts,
} from '../services/postService.js'

export const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [bookmarkedPosts, setBookmarkedPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [followingPosts, setFollowingPosts] = useState([])
  const [explorePosts, setExplorePosts] = useState([])
  const [friendsPosts, setFriendsPosts] = useState([])

  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isUpdatingPost, setIsUpdatingPost] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [isLoadingUserPosts, setIsLoadingUserPosts] = useState(false)
  const [isLoadingBookmarkedPosts, setIsLoadingBookmarkedPosts] = useState(false)
  const [isLoadingLikedPosts, setIsLoadingLikedPosts] = useState(false)
  const [isLoadingFollowingPosts, setIsLoadingFollowingPosts] = useState(false)
  const [isLoadingExplorePosts, setIsLoadingExplorePosts] = useState(false)
  const [isLoadingFriendsPosts, setIsLoadingFriendsPosts] = useState(false)

  const [error, setError] = useState(null)

  const fetchAllPosts = useCallback(async ({ page = 1, limit = 10, filter = 'for_you' } = {}) => {
    try {
      setIsLoadingPosts(true)
      const response = await getAllPosts({ page, limit, filter })
      if (page === 1) {
        setPosts(response.posts)
      } else {
        setPosts(prev => [...prev, ...response.posts])
      }
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingPosts(false)
    }
  }, [])

  const fetchPostById = useCallback(async postId => {
    try {
      setIsLoadingPost(true)
      const response = await getPostById(postId)
      setCurrentPost(response)
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingPost(false)
    }
  }, [])

  const createNewPost = useCallback(
    async data => {
      try {
        setIsCreatingPost(true)
        const response = await createPost(data)
        setPosts([response, ...posts])
        setError(null)
        return response
      } catch (error) {
        setError(error.message)
        throw error
      } finally {
        setIsCreatingPost(false)
      }
    },
    [posts],
  )

  const updateExistingPost = useCallback(
    async (postId, data) => {
      try {
        setIsUpdatingPost(true)
        const response = await updatePost(postId, data)
        setPosts(posts.map(post => (post._id === postId ? response : post)))
        setUserPosts(userPosts.map(post => (post._id === postId ? response : post)))
        setBookmarkedPosts(bookmarkedPosts.map(post => (post._id === postId ? response : post)))
        setLikedPosts(likedPosts.map(post => (post._id === postId ? response : post)))
        setCurrentPost(currentPost?._id === postId ? response : currentPost)
        setError(null)
        return response
      } catch (error) {
        setError(error.message)
        throw error
      } finally {
        setIsUpdatingPost(false)
      }
    },
    [posts, userPosts, bookmarkedPosts, likedPosts, currentPost],
  )

  const patchPostState = useCallback((postId, patch) => {
    setPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setUserPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setBookmarkedPosts(prev =>
      prev.map(post => (post._id === postId ? { ...post, ...patch } : post)),
    )
    setLikedPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setFollowingPosts(prev =>
      prev.map(post => (post._id === postId ? { ...post, ...patch } : post)),
    )
    setExplorePosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setFriendsPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setCurrentPost(prev => (prev?._id === postId ? { ...prev, ...patch } : prev))
  }, [])

  const deleteExistingPost = useCallback(
    async postId => {
      try {
        setIsDeletingPost(true)
        await deletePost(postId)
        setPosts(posts.filter(post => post._id !== postId))
        setUserPosts(userPosts.filter(post => post._id !== postId))
        setBookmarkedPosts(bookmarkedPosts.filter(post => post._id !== postId))
        setLikedPosts(likedPosts.filter(post => post._id !== postId))
        setCurrentPost(currentPost?._id === postId ? null : currentPost)
        setError(null)
      } catch (error) {
        setError(error.message)
        throw error
      } finally {
        setIsDeletingPost(false)
      }
    },
    [posts, userPosts, bookmarkedPosts, likedPosts, currentPost],
  )

  const fetchUserPosts = useCallback(async ({ userId, page = 1, limit = 10 } = {}) => {
    try {
      setIsLoadingUserPosts(true)
      const response = await getUserPosts({ userId, page, limit })
      setUserPosts(response.posts)
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingUserPosts(false)
    }
  }, [])

  const fetchBookmarkedPosts = useCallback(async ({ userId, page = 1, limit = 10 } = {}) => {
    try {
      setIsLoadingBookmarkedPosts(true)
      const response = await getBookmarkedPosts({ userId, page, limit })
      setBookmarkedPosts(response.posts)
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingBookmarkedPosts(false)
    }
  }, [])

  const fetchLikedPosts = useCallback(async ({ page = 1, limit = 10 } = {}) => {
    try {
      setIsLoadingLikedPosts(true)
      const response = await getLikedPosts({ page, limit })
      setLikedPosts(response.posts)
      setError(null)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingLikedPosts(false)
    }
  }, [])

  const fetchFollowingPosts = useCallback(async ({ page = 1, limit = 10 } = {}) => {
    try {
      setIsLoadingFollowingPosts(true)
      const response = await getFollowingPosts({ page, limit })
      if (page === 1) {
        setFollowingPosts(response.posts)
      } else {
        setFollowingPosts(prev => [...prev, ...response.posts])
      }
      setError(null)
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingFollowingPosts(false)
    }
  }, [])

  const fetchExplorePosts = useCallback(async ({ page = 1, limit = 10 } = {}) => {
    try {
      setIsLoadingExplorePosts(true)
      const response = await getExplorePosts({ page, limit })
      if (page === 1) {
        setExplorePosts(response.posts)
      } else {
        setExplorePosts(prev => [...prev, ...response.posts])
      }
      setError(null)
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingExplorePosts(false)
    }
  }, [])

  const fetchFriendsPosts = useCallback(async ({ page = 1, limit = 10 } = {}) => {
    try {
      setIsLoadingFriendsPosts(true)
      const response = await getFriendsPosts({ page, limit })
      if (page === 1) {
        setFriendsPosts(response.posts)
      } else {
        setFriendsPosts(prev => [...prev, ...response.posts])
      }
      setError(null)
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoadingFriendsPosts(false)
    }
  }, [])

  return (
    <PostContext.Provider
      value={{
        posts,
        currentPost,
        userPosts,
        bookmarkedPosts,
        likedPosts,
        followingPosts,
        explorePosts,
        friendsPosts,
        isLoadingPosts,
        isLoadingPost,
        isCreatingPost,
        isUpdatingPost,
        isDeletingPost,
        isLoadingUserPosts,
        isLoadingBookmarkedPosts,
        isLoadingLikedPosts,
        isLoadingFollowingPosts,
        isLoadingExplorePosts,
        isLoadingFriendsPosts,
        error,
        fetchAllPosts,
        fetchPostById,
        createNewPost,
        updateExistingPost,
        deleteExistingPost,
        patchPostState,
        fetchUserPosts,
        fetchBookmarkedPosts,
        fetchLikedPosts,
        fetchFollowingPosts,
        fetchExplorePosts,
        fetchFriendsPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

export const usePosts = () => useContext(PostContext)
