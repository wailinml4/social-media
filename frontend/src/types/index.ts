// ===== API PAYLOAD TYPES =====

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PostListOptions extends PaginationOptions {
  filter?: string
}

export interface UserPostOptions extends PaginationOptions {
  userId?: string
}

export interface PostPayload {
  description?: string
  media?: Array<{ url: string; type: string; altText?: string }>
  images?: string[]
}

export interface MessageAttachment {
  id?: string | number
  url?: string
  type?: string
  name?: string
  size?: number
  mimeType?: string
  file?: File
  preview?: string
}

export interface SharedPostPayload {
  postId?: string
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
  excerpt?: string
  mediaUrl?: string
}

export interface StorySlidePayload {
  mediaUrl?: string
  type?: 'image' | 'video'
  caption?: string
  duration?: number
  timestamp?: string
}

export type StoryResumeMap = Record<string, number>

export interface ProfileUpdatePayload {
  fullName?: string
  username?: string
  bio?: string
  profilePicture?: string
  coverPicture?: string
}

export interface SearchUsersOptions {
  query?: string
  limit?: number
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  message: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  users?: T[]
  comments?: T[]
  replies?: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

// Specific response types for different endpoints
export interface NotificationsResponse<T> {
  notifications: T[]
  pagination: PaginationMeta & { unreadCount?: number }
}

export interface PostsResponse<T> {
  posts: T[]
  pagination: PaginationMeta
}

export interface ConversationsResponse<T> {
  conversations: T[]
  pagination: PaginationMeta
}

// User-related response types
export interface UsersResponse<T> {
  users: T[]
  pagination: PaginationMeta
}

export interface FollowersResponse<T> {
  followers: T[]
  pagination: PaginationMeta
}

export interface FolloweesResponse<T> {
  followees: T[]
  pagination: PaginationMeta
}

export interface FriendsResponse<T> {
  friends: T[]
  pagination: PaginationMeta
}

export interface SearchUsersResponse<T> {
  users: T[]
}

export interface MessagesResponse<T> {
  messages: T[]
  pagination: PaginationMeta
}

export interface CommentsResponse<T> {
  comments: T[]
  pagination: PaginationMeta
}

export interface RepliesResponse<T> {
  replies: T[]
  pagination: PaginationMeta
}

// ===== DOMAIN TYPES =====

export interface User {
  _id: string
  id?: string
  fullName: string
  name?: string
  username?: string
  email: string
  profilePicture?: string
  coverPicture?: string
  bio?: string
  handle?: string
  avatar?: string
  followerCount: number
  followingCount: number
  friendsCount: number
  postCount: number
  isOnline: boolean
  lastSeen?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Media {
  url: string
  type: 'image' | 'video'
  id?: string
  postId?: string
  altText?: string
}

export interface Post {
  _id: string
  id?: string
  postId?: string
  author: User
  description?: string
  content?: string
  media: Media[]
  images?: string[]
  likeCount: number
  bookmarkCount: number
  commentCount: number
  shareCount: number
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  id?: string
  user: User
  post: string | Post
  content: string
  text?: string
  parent?: string | Comment
  parentId?: string
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  id?: string
  sender: User
  conversation: string | Conversation
  content?: string
  sharedPost?: SharedPost
  attachments: MessageAttachment[]
  readBy: string[]
  deliveredAt?: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'reply' | 'message'

export interface Notification {
  id?: string
  _id: string
  recipient: User
  sender: User
  type: NotificationType
  post?: string | Post
  comment?: string | Comment
  conversation?: string | Conversation
  message?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface StorySlide {
  _id?: string
  mediaUrl: string
  url?: string
  type: 'image' | 'video'
  caption?: string
  duration: number
  id?: string
  timestamp?: string
}

export interface Story {
  _id: string
  id?: string
  author: User
  user?: User
  slides: StorySlide[]
  viewedBy: string[]
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  _id: string
  id?: string
  participants: User[]
  lastMessage?: string | Message
  unreadCount: Record<string, number>
  createdAt: string
  updatedAt: string
}

export interface Follow {
  _id: string
  follower: User
  following: User
  createdAt: string
}

export interface Like {
  _id: string
  user: User
  post: string | Post
  createdAt: string
}

export interface Bookmark {
  _id: string
  user: User
  post: string | Post
  createdAt: string
}

// ===== SHARED TYPES =====

export interface SharedPost {
  postId?: string
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
  excerpt?: string
  mediaUrl?: string
}

// ===== UI TYPES =====

export interface ConfirmModalProps {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
}

export interface ConfirmModalData {
  title?: string
  message?: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
}

// ===== SOCKET EVENT TYPES =====

// Socket event payload types
export interface MessageReceivedPayload {
  message: Message
}

export interface MessageUpdatedPayload {
  message: Message
}

export interface MessageDeletedPayload {
  messageId: string
}

export interface MessageReadReceiptPayload {
  messageId: string
  userId: string
}

export interface TypingPayload {
  userId: string
  conversationId: string
}

export interface SendMessagePayload {
  conversationId: string
  content: string
  attachments?: MessageAttachment[]
  sharedPost?: SharedPost | null
}

export interface NotificationPayload {
  notification: Notification
}

export interface ConversationUpdatedPayload {
  conversation: Conversation
}

// Socket event callback types
export type MessageReceivedCallback = (data: MessageReceivedPayload) => void
export type MessageUpdatedCallback = (data: MessageUpdatedPayload) => void
export type MessageDeletedCallback = (data: MessageDeletedPayload) => void
export type MessageReadReceiptCallback = (data: MessageReadReceiptPayload) => void
export type TypingCallback = (data: TypingPayload) => void
export type NotificationCallback = (data: NotificationPayload) => void
export type ConversationUpdatedCallback = (data: ConversationUpdatedPayload) => void
