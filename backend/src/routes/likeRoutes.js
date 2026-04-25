import express from "express"
import {
    likePost,
    unlikePost,
    getPostLikeCount,
    checkLikeStatus
} from "../controllers/likeController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/posts/:postId/like", authenticate, likePost)
router.delete("/posts/:postId/like", authenticate, unlikePost)
router.get("/posts/:postId/likes/count", authenticate, getPostLikeCount)
router.get("/posts/:postId/likes/status", authenticate, checkLikeStatus)

export default router
