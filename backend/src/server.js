import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"

import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import errorHandler from "./utils/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(morgan("dev"))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use(cookieParser())

app.use("/api/auth", authRoutes)

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
