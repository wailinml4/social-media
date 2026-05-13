import mongoose from 'mongoose'
import env from './env.js'

const MONGO_URI = env.MONGO_URI
if (!MONGO_URI) throw new Error('MONGO_URI is not configured')
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected sucessfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
