/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Post } from '../types'
import type { PaginatedResponse, PostPayload, PaginationOptions, PostListOptions, UserPostOptions, PostsResponse } from '../types'
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

interface PostContextValue {
  posts: Post[]
  currentPost: Post | null
  userPosts: Post[]
  bookmarkedPosts: Post[]
  likedPosts: Post[]
  followingPosts: Post[]
  explorePosts: Post[]
  friendsPosts: Post[]
  isLoadingPosts: boolean
  isLoadingPost: boolean
  isCreatingPost: boolean
  isUpdatingPost: boolean
  isDeletingPost: boolean
  isLoadingUserPosts: boolean
  isLoadingBookmarkedPosts: boolean
  isLoadingLikedPosts: boolean
  isLoadingFollowingPosts: boolean
  isLoadingExplorePosts: boolean
  isLoadingFriendsPosts: boolean
  error: string | null
  fetchAllPosts: (options?: PostListOptions) => Promise<PostsResponse<Post>>
  fetchPostById: (postId: string) => Promise<void>
  createNewPost: (data: PostPayload) => Promise<Post>
  updateExistingPost: (postId: string, data: PostPayload) => Promise<Post>
  deleteExistingPost: (postId: string) => Promise<void>
  patchPostState: (postId: string, patch: Partial<Post>) => void
  fetchUserPosts: (options?: UserPostOptions) => Promise<PostsResponse<Post>>
  fetchBookmarkedPosts: (options?: UserPostOptions) => Promise<PostsResponse<Post>>
  fetchLikedPosts: (options?: PaginationOptions) => Promise<PostsResponse<Post>>
  fetchFollowingPosts: (options?: PaginationOptions) => Promise<PostsResponse<Post>>
  fetchExplorePosts: (options?: PaginationOptions) => Promise<PostsResponse<Post>>
  fetchFriendsPosts: (options?: PaginationOptions) => Promise<PostsResponse<Post>>
}

export const PostContext = createContext<PostContextValue | null>(null)

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPost, setCurrentPost] = useState<Post | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([])
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [followingPosts, setFollowingPosts] = useState<Post[]>([])
  const [explorePosts, setExplorePosts] = useState<Post[]>([])
  const [friendsPosts, setFriendsPosts] = useState<Post[]>([])

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

  const [error, setError] = useState<string | null>(null)

  const fetchAllPosts = useCallback(
    async ({ page = 1, limit = 10, filter = 'for_you' }: PostListOptions = {}): Promise<PostsResponse<Post>> => {
      try {
        setIsLoadingPosts(true)
        const response = await getAllPosts({ page, limit, filter })
        if (page === 1) {
          setPosts(response.posts || [])
        } else {
          setPosts(prev => [...prev, ...(response.posts || [])])
        }
        setError(null)
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Operation failed')
        throw err
      } finally {
        setIsLoadingPosts(false)
      }
    },
    [],
  )

  const fetchPostById = useCallback(async (postId: string) => {
    try {
      setIsLoadingPost(true)
      const response = await getPostById(postId)
      setCurrentPost(response)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
    } finally {
      setIsLoadingPost(false)
    }
  }, [])

  const createNewPost = useCallback(
    async (data: PostPayload) => {
      try {
        setIsCreatingPost(true)
        const response = await createPost(data)
        setPosts([response, ...posts])
        setError(null)
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Operation failed')
        throw err
      } finally {
        setIsCreatingPost(false)
      }
    },
    [posts],
  )

  const updateExistingPost = useCallback(
    async (postId: string, data: PostPayload) => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Operation failed')
        throw err
      } finally {
        setIsUpdatingPost(false)
      }
    },
    [posts, userPosts, bookmarkedPosts, likedPosts, currentPost],
  )

  const patchPostState = useCallback((postId: string, patch: Partial<Post>) => {
    setPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setUserPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setBookmarkedPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setLikedPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setFollowingPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setExplorePosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setFriendsPosts(prev => prev.map(post => (post._id === postId ? { ...post, ...patch } : post)))
    setCurrentPost(prev => (prev?._id === postId ? { ...prev, ...patch } : prev))
  }, [])

  const deleteExistingPost = useCallback(
    async (postId: string) => {
      try {
        setIsDeletingPost(true)
        await deletePost(postId)
        setPosts(posts.filter(post => post._id !== postId))
        setUserPosts(userPosts.filter(post => post._id !== postId))
        setBookmarkedPosts(bookmarkedPosts.filter(post => post._id !== postId))
        setLikedPosts(likedPosts.filter(post => post._id !== postId))
        setCurrentPost(currentPost?._id === postId ? null : currentPost)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Operation failed')
        throw err
      } finally {
        setIsDeletingPost(false)
      }
    },
    [posts, userPosts, bookmarkedPosts, likedPosts, currentPost],
  )

  const fetchUserPosts = useCallback(async ({ userId, page = 1, limit = 10 }: UserPostOptions = {}): Promise<PostsResponse<Post>> => {
    try {
      setIsLoadingUserPosts(true)
      const response = await getUserPosts({ userId, page, limit })
      setUserPosts(response.posts || [])
      setError(null)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
    } finally {
      setIsLoadingUserPosts(false)
    }
  }, [])

  const fetchBookmarkedPosts = useCallback(async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
    try {
      setIsLoadingBookmarkedPosts(true)
      const response = await getBookmarkedPosts({ page, limit })
      setBookmarkedPosts(response.posts || [])
      setError(null)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
    } finally {
      setIsLoadingBookmarkedPosts(false)
    }
  }, [])

  const fetchLikedPosts = useCallback(async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
    try {
      setIsLoadingLikedPosts(true)
      const response = await getLikedPosts({ page, limit })
      setLikedPosts(response.posts || [])
      setError(null)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
    } finally {
      setIsLoadingLikedPosts(false)
    }
  }, [])

  const fetchFollowingPosts = useCallback(async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
    try {
      setIsLoadingFollowingPosts(true)
      const response = await getFollowingPosts({ page, limit })
      if (page === 1) {
        setFollowingPosts(response.posts || [])
      } else {
        setFollowingPosts(prev => [...prev, ...(response.posts || [])])
      }
      setError(null)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
    } finally {
      setIsLoadingFollowingPosts(false)
    }
  }, [])

  const fetchExplorePosts = useCallback(async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
    try {
      setIsLoadingExplorePosts(true)
      const response = await getExplorePosts({ page, limit })
      if (page === 1) {
        setExplorePosts(response.posts || [])
      } else {
        setExplorePosts(prev => [...prev, ...(response.posts || [])])
      }
      setError(null)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
    } finally {
      setIsLoadingExplorePosts(false)
    }
  }, [])

  const fetchFriendsPosts = useCallback(async ({ page = 1, limit = 10 }: PaginationOptions = {}): Promise<PostsResponse<Post>> => {
    try {
      setIsLoadingFriendsPosts(true)
      const response = await getFriendsPosts({ page, limit })
      if (page === 1) {
        setFriendsPosts(response.posts || [])
      } else {
        setFriendsPosts(prev => [...prev, ...(response.posts || [])])
      }
      setError(null)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
      throw err
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

export const usePosts = (): PostContextValue => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider')
  }
  return context
}
