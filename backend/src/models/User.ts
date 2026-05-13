import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, lowercase: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: '', trim: true },
    coverPicture: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true, maxLength: 280 },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    friendsCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
    verificationCode: { type: String },
    verificationCodeExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiresAt: { type: Date },
  },
  { timestamps: true },
)

export interface IUser extends mongoose.Document {
  fullName: string
  username: string
  email: string
  password: string
  profilePicture?: string
  coverPicture?: string
  bio?: string
  followerCount: number
  followingCount: number
  friendsCount: number
  postCount: number
  isOnline: boolean
  lastSeen?: Date
  isVerified?: boolean
  verificationCode?: string
  verificationCodeExpiresAt?: Date | number
  resetPasswordToken?: string
  resetPasswordTokenExpiresAt?: Date | number
  createdAt?: Date
  updatedAt?: Date
}

const User = mongoose.model<IUser>('User', userSchema)
export default User
