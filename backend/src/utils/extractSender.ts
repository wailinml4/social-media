import mongoose from 'mongoose'

export interface SenderPreview {
  _id: mongoose.Types.ObjectId | string
  fullName?: string
  email?: string
  profilePicture?: string | null
  isOnline?: boolean
  lastSeen?: string | Date | null
}

const extractSender = (sender?: SenderPreview | null) => {
  if (!sender) {
    return {
      _id: null,
      name: 'Unknown User',
      handle: 'unknown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown+User',
    }
  }

  return {
    _id: sender._id,
    id: sender._id,
    name: sender.fullName,
    handle: sender.email?.split('@')[0] || 'user',
    avatar: sender.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(sender.fullName || 'user'),
  }
}

export default extractSender
