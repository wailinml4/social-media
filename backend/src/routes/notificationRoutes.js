import express from "express"
import {
    createNotification,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controllers/notificationController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/", authenticate, createNotification)
router.get("/", authenticate, getAllNotifications)
router.put("/:notificationId/read", authenticate, markAsRead)
router.put("/read-all", authenticate, markAllAsRead)
router.delete("/:notificationId", authenticate, deleteNotification)

export default router
