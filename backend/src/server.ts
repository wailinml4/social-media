import app from './app.js'
import connectDB from './config/db.js'
import { createServer } from 'http'
import { initializeSocket } from './socket/index.js'
import env from './config/env.js'

const PORT = env.PORT || 3000

const startServer = async (): Promise<void> => {
  await connectDB()

  const server = createServer(app)
  initializeSocket(server)

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
