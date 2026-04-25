import express from "express"
import {
    bookmarkPost,
    unbookmarkPost,
    getUserBookmarkedPosts,
    getPostBookmarkCount,
    checkBookmarkStatus
} from "../controllers/bookmarkController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/posts/:postId/bookmark", authenticate, bookmarkPost)
router.delete("/posts/:postId/bookmark", authenticate, unbookmarkPost)
router.get("/posts/bookmarked", authenticate, getUserBookmarkedPosts)
router.get("/posts/:postId/bookmarks/count", authenticate, getPostBookmarkCount)
router.get("/posts/:postId/bookmarks/status", authenticate, checkBookmarkStatus)

export default router
