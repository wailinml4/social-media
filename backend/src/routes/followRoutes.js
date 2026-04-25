import express from "express"
import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowees,
    checkFollowStatus,
    getFriends
} from "../controllers/followController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/:userId/follow", authenticate, followUser)
router.delete("/:userId/follow", authenticate, unfollowUser)
router.get("/:userId/followers", authenticate, getFollowers)
router.get("/:userId/following", authenticate, getFollowees)
router.get("/:userId/follow-status", authenticate, checkFollowStatus)
router.get("/:userId/friends", authenticate, getFriends)

export default router
