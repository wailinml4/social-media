# Architecture

High-level components:

- Frontend (React + Vite): UI, form validation (Zod + react-hook-form), Socket.IO client for real-time updates.
- Backend (Express): REST API, Zod request validation, Mongoose models, Socket.IO server for chat and live notifications.
- Database (MongoDB): stores users, posts, comments, notifications, conversations, messages.
- Cloudinary (or similar): media storage; frontend uploads then sends returned URL to API.

Flow examples:

- Signup/Login: frontend → `POST /api/auth/signup` → backend validates and creates user → sets auth cookie
- Sending message: frontend emits Socket.IO event → backend broadcasts to recipient and persists message in DB → recipient receives via Socket.IO
