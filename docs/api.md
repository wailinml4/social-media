# API - Full Endpoint Reference

This file lists all HTTP endpoints exposed by the backend, grouped by area. Paths include the `/api` prefix where applicable.

## Authentication (`/api/auth`)

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/check-auth`
- POST `/api/auth/logout`
- POST `/api/auth/verify-email`
- POST `/api/auth/resend-verification-email`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password/:id`

## Posts (`/api/posts`)

- POST `/api/posts/` - create post
- GET `/api/posts/` - list posts (query params)
- GET `/api/posts/following` - feed from followed users
- GET `/api/posts/explore` - explore posts
- GET `/api/posts/friends` - friends' posts
- GET `/api/posts/user/:userId` - posts by user
- GET `/api/posts/bookmarked` - bookmarked posts for current user
- GET `/api/posts/liked` - posts liked by current user
- GET `/api/posts/:postId` - get single post
- PUT `/api/posts/:postId` - edit post
- DELETE `/api/posts/:postId` - delete post

## Comments (mounted under `/api`)

- POST `/api/posts/:postId/comments` - create comment on a post
- GET `/api/posts/:postId/comments` - list comments for a post
- GET `/api/comments/:commentId/replies` - get replies to a comment
- PUT `/api/comments/:commentId` - edit comment
- DELETE `/api/comments/:commentId` - delete comment

## Likes (mounted under `/api`)

- POST `/api/posts/:postId/likes` - like a post
- DELETE `/api/posts/:postId/likes` - unlike a post
- GET `/api/posts/:postId/likes/count` - get like count
- GET `/api/posts/:postId/likes/status` - check if current user liked

## Bookmarks (mounted under `/api`)

- POST `/api/posts/:postId/bookmarks` - bookmark a post
- DELETE `/api/posts/:postId/bookmarks` - remove bookmark
- GET `/api/posts/bookmarked` - current user's bookmarked posts
- GET `/api/posts/:postId/bookmarks/count` - bookmark count
- GET `/api/posts/:postId/bookmarks/status` - bookmark status for current user

## Users (`/api/users`)

- GET `/api/users/me/profile` - current user profile
- GET `/api/users/:userId/profile` - profile by id
- PUT `/api/users/me/profile` - update current profile
- GET `/api/users/suggested` - suggested users
- GET `/api/users/search` - search users (query params)

## Follow (`/api/follow`)

- POST `/api/follow/:userId/follow` - follow a user
- DELETE `/api/follow/:userId/follow` - unfollow a user
- GET `/api/follow/:userId/followers` - list followers
- GET `/api/follow/:userId/following` - list followees
- GET `/api/follow/:userId/follow-status` - check follow status
- GET `/api/follow/:userId/friends` - mutual follows / friends

## Notifications (`/api/notifications`)

- POST `/api/notifications/` - create notification
- GET `/api/notifications/` - list notifications (pagination)
- PUT `/api/notifications/:notificationId/read` - mark single notification read
- PUT `/api/notifications/read-all` - mark all read
- DELETE `/api/notifications/:notificationId` - delete notification
- DELETE `/api/notifications/` - clear all notifications

## Conversations (`/api/conversations`)

- POST `/api/conversations/` - create conversation
- GET `/api/conversations/` - list user conversations (pagination)
- GET `/api/conversations/:conversationId` - get conversation details
- PUT `/api/conversations/:conversationId/read` - mark conversation as read

## Messages (`/api/messages`)

- POST `/api/messages/` - send a message
- GET `/api/messages/conversation/:conversationId` - get messages for conversation (pagination)
- PUT `/api/messages/:messageId/read` - mark message as read
- PUT `/api/messages/conversation/:conversationId/read` - mark conversation messages as read
- PUT `/api/messages/:messageId` - edit message
- DELETE `/api/messages/:messageId` - delete message

## Stories (`/api/stories`)

- POST `/api/stories/` - create a story
- GET `/api/stories/` - list stories (query)
- GET `/api/stories/user/:userId` - get stories for a user
- PATCH `/api/stories/:storyId/view` - mark story view
- DELETE `/api/stories/:storyId` - delete story slide

## Upload (`/api/upload`)

- POST `/api/upload/media` - upload media (returns URL)

---

Notes:

- Many routes use Zod validation middleware; schema names are in `backend/src/schemas`.
- Auth-protected routes require the auth cookie; middleware is `authenticate`.
- For request payload and response shapes, see the corresponding controller and schema files under `backend/src/controllers` and `backend/src/schemas`.

