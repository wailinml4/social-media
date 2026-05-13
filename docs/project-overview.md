# Project Overview

Social Media is a full-stack application demonstrating real-time messaging, post interactions, notifications, and user profiles. It is implemented with a TypeScript React frontend (Vite + Tailwind) and a Node/Express backend (MongoDB, Mongoose, Zod).

Key features:

- User authentication (JWT, httpOnly cookie)
- Real-time chat with Socket.IO
- Posts with images/videos, likes, comments, bookmarks
- Notifications for social activity
- Profile editing (avatars, cover photos, bio, username)

## Loading UI Conventions

All loading states use a standardized set of components located in `frontend/src/components/loading/`.

### Components

| Component | Location | Use when |
|-----------|----------|----------|
| `Spinner` | `loading/Spinner.tsx` | Inline/button-level loading (form submits, auth buttons, delete/save actions) |
| `Skeleton` | `loading/Skeleton.tsx` | Generic placeholder rows for small sections |
| `PostSkeleton` | `loading/skeletons/PostSkeleton.tsx` | Feed post list placeholder |
| `ProfileSkeleton` | `loading/skeletons/ProfileSkeleton.tsx` | Full profile page placeholder |
| `NotificationSkeleton` | `loading/skeletons/NotificationSkeleton.tsx` | Notification list placeholder |
| `ChatListSkeleton` | `loading/skeletons/ChatListSkeleton.tsx` | Chat sidebar list placeholder |

### Usage

```tsx
// Page-level list loading: use a Skeleton component
import PostSkeleton from '../components/loading/skeletons/PostSkeleton'
{isLoading && <PostSkeleton />}

// Inline/button loading: use Spinner with size="sm"
import Spinner from '../components/loading/Spinner'
{isSubmitting ? <Spinner size="sm" /> : 'Save'}

// Full-page auth check: use Spinner with size="lg"
{isCheckingAuth && <Spinner size="lg" />}
```

### Props

**Spinner**
- `size?: 'sm' | 'md' | 'lg'` — icon size (14 / 20 / 28 px). Default `md`.
- `label?: string` — visible label text shown next to the icon.
- `inline?: boolean` — renders as `inline-flex` instead of centered `flex`. Default `false`.
- `className?: string` — additional Tailwind classes.

**Skeleton**
- `rows?: number` — number of placeholder rows. Default `3`.
- `className?: string` — additional Tailwind classes.
