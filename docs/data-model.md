# Data Model  

## User
- `_id: ObjectId`
- `fullName: string`
- `username: string`
- `email: string`
- `passwordHash: string`
- `bio: string | null`
- `profilePicture: string | null`
- `coverPicture: string | null`
- `role: string`
- `followerCount: number`
- `followingCount: number`
- `postCount: number`
- `createdAt: Date`
- `updatedAt: Date`

## Post
- `_id: ObjectId`
- `author: ObjectId` (User ref)
- `description: string`
- `media: string[]`
- `tags?: string[]`
- `privacy?: string`
- `likeCount: number`
- `commentCount: number`
- `createdAt: Date`
- `updatedAt: Date`

## Comment
- `_id: ObjectId`
- `post: ObjectId` (Post ref)
- `author: ObjectId` (User ref)
- `text: string`
- `parent?: ObjectId` (Comment ref)
- `createdAt: Date`
- `updatedAt: Date`

## Like
- `_id: ObjectId`
- `post: ObjectId` (Post ref)
- `user: ObjectId` (User ref)
- `createdAt: Date`

## Bookmark
- `_id: ObjectId`
- `post: ObjectId` (Post ref)
- `user: ObjectId` (User ref)
- `createdAt: Date`

## Notification
- `_id: ObjectId`
- `user: ObjectId` (recipient)
- `type: string`
- `actor: ObjectId`
- `targetId?: ObjectId`
- `data?: object`
- `isRead: boolean`
- `createdAt: Date`

## Conversation
- `_id: ObjectId`
- `participants: ObjectId[]`
- `lastMessage?: ObjectId`
- `unreadCounts?: object`
- `createdAt: Date`
- `updatedAt: Date`

## Message
- `_id: ObjectId`
- `conversation: ObjectId`
- `sender: ObjectId`
- `text?: string`
- `attachments?: string[]`
- `createdAt: Date`
- `editedAt?: Date`

## Story
- `_id: ObjectId`
- `author: ObjectId`
- `media: string`
- `expiresAt: Date`
- `views?: { viewer: ObjectId, viewedAt: Date }[]`
- `createdAt: Date`


