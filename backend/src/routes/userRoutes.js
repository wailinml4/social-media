import express from "express"
import {
    getCurrentProfile,
    getProfileById,
    updateProfile,
    getSuggestedUsers
} from "../controllers/userController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.get("/me/profile", authenticate, getCurrentProfile)
router.get("/:userId/profile", authenticate, getProfileById)
router.put("/me/profile", authenticate, updateProfile)
router.get("/suggested", authenticate, getSuggestedUsers)

export default router
