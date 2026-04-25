import express from "express"
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getUserPosts,
    getBookmarkedPosts,
    getFollowingPosts,
    getFriendsPosts
} from "../controllers/postController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/", authenticate, createPost)
router.get("/", authenticate, getAllPosts)
router.get("/following", authenticate, getFollowingPosts)
router.get("/friends", authenticate, getFriendsPosts)
router.get("/user/:userId", authenticate, getUserPosts)
router.get("/bookmarked/:userId", authenticate, getBookmarkedPosts)

router.get("/:postId", authenticate, getPostById)
router.put("/:postId", authenticate, updatePost)
router.delete("/:postId", authenticate, deletePost)

export default router

