import { createContext, useContext, useState, useCallback } from "react"
import {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
	getUserPosts,
	getBookmarkedPosts,
	getFollowingPosts,
	getFriendsPosts,
} from "../services/postsService.js"

export const PostContext = createContext()

export const PostProvider = ({ children }) => {
	const [posts, setPosts] = useState([])
	const [currentPost, setCurrentPost] = useState(null)
	const [userPosts, setUserPosts] = useState([])
	const [bookmarkedPosts, setBookmarkedPosts] = useState([])
	const [followingPosts, setFollowingPosts] = useState([])
	const [friendsPosts, setFriendsPosts] = useState([])
	
	const [isLoadingPosts, setIsLoadingPosts] = useState(false)
	const [isLoadingPost, setIsLoadingPost] = useState(false)
	const [isCreatingPost, setIsCreatingPost] = useState(false)
	const [isUpdatingPost, setIsUpdatingPost] = useState(false)
	const [isDeletingPost, setIsDeletingPost] = useState(false)
	const [isLoadingUserPosts, setIsLoadingUserPosts] = useState(false)
	const [isLoadingBookmarkedPosts, setIsLoadingBookmarkedPosts] = useState(false)
	const [isLoadingFollowingPosts, setIsLoadingFollowingPosts] = useState(false)
	const [isLoadingFriendsPosts, setIsLoadingFriendsPosts] = useState(false)
	
	const [error, setError] = useState(null)

	const fetchAllPosts = useCallback(async ({ offset = 0, limit = 10, filter = 'for_you' } = {}) => {
		try {
			setIsLoadingPosts(true)
			const response = await getAllPosts({ offset, limit, filter })
			if (offset === 0) {
				setPosts(response)
			} else {
				setPosts(prev => [...prev, ...response])
			}
			setError(null)
		} catch (error) {
			setError(error.message)
			throw error
		} finally {
			setIsLoadingPosts(false)
		}
	}, [])

	const fetchPostById = useCallback(async (postId) => {
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

	const createNewPost = useCallback(async (data) => {
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
	}, [posts])

	const updateExistingPost = useCallback(async (postId, data) => {
		try {
			setIsUpdatingPost(true)
			const response = await updatePost(postId, data)
			setPosts(posts.map(post => post._id === postId ? response : post))
			setUserPosts(userPosts.map(post => post._id === postId ? response : post))
			setBookmarkedPosts(bookmarkedPosts.map(post => post._id === postId ? response : post))
			setCurrentPost(currentPost?._id === postId ? response : currentPost)
			setError(null)
			return response
		} catch (error) {
			setError(error.message)
			throw error
		} finally {
			setIsUpdatingPost(false)
		}
	}, [posts, userPosts, bookmarkedPosts, currentPost])

	const deleteExistingPost = useCallback(async (postId) => {
		try {
			setIsDeletingPost(true)
			await deletePost(postId)
			setPosts(posts.filter(post => post._id !== postId))
			setUserPosts(userPosts.filter(post => post._id !== postId))
			setBookmarkedPosts(bookmarkedPosts.filter(post => post._id !== postId))
			setCurrentPost(currentPost?._id === postId ? null : currentPost)
			setError(null)
		} catch (error) {
			setError(error.message)
			throw error
		} finally {
			setIsDeletingPost(false)
		}
	}, [posts, userPosts, bookmarkedPosts, currentPost])

	const fetchUserPosts = useCallback(async ({ userId, offset = 0, limit = 10 } = {}) => {
		try {
			setIsLoadingUserPosts(true)
			const response = await getUserPosts({ userId, offset, limit })
			setUserPosts(response)
			setError(null)
		} catch (error) {
			setError(error.message)
			throw error
		} finally {
			setIsLoadingUserPosts(false)
		}
	}, [])

	const fetchBookmarkedPosts = useCallback(async ({ userId, offset = 0, limit = 10 } = {}) => {
		try {
			setIsLoadingBookmarkedPosts(true)
			const response = await getBookmarkedPosts({ userId, offset, limit })
			setBookmarkedPosts(response)
			setError(null)
		} catch (error) {
			setError(error.message)
			throw error
		} finally {
			setIsLoadingBookmarkedPosts(false)
		}
	}, [])

	const fetchFollowingPosts = useCallback(async ({ offset = 0, limit = 10 } = {}) => {
		try {
			setIsLoadingFollowingPosts(true)
			const response = await getFollowingPosts({ offset, limit })
			if (offset === 0) {
				setFollowingPosts(response)
			} else {
				setFollowingPosts(prev => [...prev, ...response])
			}
			setError(null)
		} catch (error) {
			setError(error.message)
			throw error
		} finally {
			setIsLoadingFollowingPosts(false)
		}
	}, [])

	const fetchFriendsPosts = useCallback(async ({ offset = 0, limit = 10 } = {}) => {
		try {
			setIsLoadingFriendsPosts(true)
			const response = await getFriendsPosts({ offset, limit })
			if (offset === 0) {
				setFriendsPosts(response)
			} else {
				setFriendsPosts(prev => [...prev, ...response])
			}
			setError(null)
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
				followingPosts,
				friendsPosts,
				isLoadingPosts,
				isLoadingPost,
				isCreatingPost,
				isUpdatingPost,
				isDeletingPost,
				isLoadingUserPosts,
				isLoadingBookmarkedPosts,
				isLoadingFollowingPosts,
				isLoadingFriendsPosts,
				error,
				fetchAllPosts,
				fetchPostById,
				createNewPost,
				updateExistingPost,
				deleteExistingPost,
				fetchUserPosts,
				fetchBookmarkedPosts,
				fetchFollowingPosts,
				fetchFriendsPosts,
			}}
		>
			{children}
		</PostContext.Provider>
	)
}

export const usePosts = () => useContext(PostContext)
