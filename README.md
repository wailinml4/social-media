# Social Media App

A full-stack social media application with real-time messaging, post interactions, and user connections.

## Features

- **Authentication**: JWT-based auth with httpOnly cookies
- **Posts**: Create, edit, delete posts with image/video support
- **Interactions**: Like, bookmark, comment on posts
- **Social**: Follow users, view followers/followees/friends
- **Real-time Messaging**: Socket.IO-powered chat with online status
- **Notifications**: Real-time notifications for likes, comments, follows
- **Stories**: Create and view user stories
- **Profile**: User profiles with posts and bookmarks
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Animations**: GSAP-powered smooth animations

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Socket.IO Client
- Axios
- React Hot Toast
- Lucide Icons
- GSAP (Animations)

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Bcrypt
- Cloudinary (Image upload)
- Cookie Parser

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configure `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```text
social-media/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Cloudinary, Socket config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   ├── socket/         # Socket.IO handlers
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── animations/     # GSAP animation hooks
│   │   ├── components/     # React components
│   │   ├── context/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── config/         # API config
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check-auth` - Check authentication status
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/resend-verification-email` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:resetPasswordToken` - Reset password with token

### Posts

- `GET /api/posts?page=1&limit=10&filter=for_you` - Get all posts
- `GET /api/posts/following?page=1&limit=10` - Get following posts
- `GET /api/posts/friends?page=1&limit=10` - Get friends posts
- `GET /api/posts/user/:userId?page=1&limit=10` - Get user posts
- `GET /api/posts/bookmarked/:userId?page=1&limit=10` - Get user bookmarked posts
- `GET /api/posts/:postId` - Get post by ID
- `POST /api/posts` - Create post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post

### Comments

- `POST /api/posts/:postId/comments` - Create comment
- `GET /api/posts/:postId/comments?page=1&limit=10` - Get comments
- `GET /api/comments/:commentId/replies?page=1&limit=10` - Get comment replies
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### Likes

- `POST /api/posts/:postId/likes` - Like post
- `DELETE /api/posts/:postId/likes` - Unlike post
- `GET /api/posts/:postId/likes/count` - Get post like count
- `GET /api/posts/:postId/likes/status` - Check like status

### Bookmarks

- `POST /api/posts/:postId/bookmarks` - Bookmark post
- `DELETE /api/posts/:postId/bookmarks` - Unbookmark post
- `GET /api/posts/bookmarked?page=1&limit=10` - Get bookmarked posts
- `GET /api/posts/:postId/bookmarks/count` - Get post bookmark count
- `GET /api/posts/:postId/bookmarks/status` - Check bookmark status

### Follow

- `POST /api/follow/:userId/follow` - Follow user
- `DELETE /api/follow/:userId/follow` - Unfollow user
- `GET /api/follow/:userId/followers?page=1&limit=10` - Get followers
- `GET /api/follow/:userId/following?page=1&limit=10` - Get following
- `GET /api/follow/:userId/follow-status` - Check follow status
- `GET /api/follow/:userId/friends?page=1&limit=10` - Get friends

### Notifications

- `POST /api/notifications` - Create notification
- `GET /api/notifications?page=1&limit=20` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Messages

- `GET /api/conversations?page=1&limit=20` - Get conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:conversationId` - Get conversation by ID
- `PUT /api/conversations/:conversationId/read` - Mark conversation as read
- `GET /api/messages/conversation/:conversationId?page=1&limit=50` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark message as read

### Users

- `GET /api/users/me/profile` - Get current user profile
- `GET /api/users/:userId/profile` - Get user profile by ID
- `PUT /api/users/me/profile` - Update current user profile
- `GET /api/users/suggested?page=1&limit=5` - Get suggested users

### Upload

- `POST /api/upload/media` - Upload media (image/video)

## Development

### Running Tests

```bash
# Backend (when tests are added)
cd backend
npm test

# Frontend (when tests are added)
cd frontend
npm test
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## License

MIT
