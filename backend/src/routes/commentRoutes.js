import express from "express"
import {
    createComment,
    getPostComments,
    getCommentReplies,
    updateComment,
    deleteComment,
} from "../controllers/commentController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/posts/:postId/comments", authenticate, createComment)
router.get("/posts/:postId/comments", authenticate, getPostComments)
router.get("/comments/:commentId/replies", authenticate, getCommentReplies)
router.put("/comments/:commentId", authenticate, updateComment)
router.delete("/comments/:commentId", authenticate, deleteComment)

export default router
