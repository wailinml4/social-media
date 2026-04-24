import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import helmet from "helmet"
import morgan from "morgan"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(morgan("dev"))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World!")
});

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`The server is running on port ${PORT}`)
    })
}

startServer()
