import express from "express"
import { uploadMedia } from "../controllers/uploadController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.post("/media", authenticate, uploadMedia)

export default router
