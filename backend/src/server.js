import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"

import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import errorHandler from "./utils/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import followRoutes from "./routes/followRoutes.js"
import likeRoutes from "./routes/likeRoutes.js"
import bookmarkRoutes from "./routes/bookmarkRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(morgan("dev"))
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	}),
)

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/users", userRoutes)
app.use("/api/follow", followRoutes)
app.use("/api", likeRoutes)
app.use("/api", bookmarkRoutes)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use(errorHandler)

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The server is running on port ${PORT}`)
    })
}

startServer()
