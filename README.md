# Social Media App

A full-stack social media application demonstrating posts, real-time messaging, likes, bookmarks, and user connections. The repository contains a TypeScript/Node backend and a TypeScript/React frontend.

## Features

- User accounts, signup/login, JWT authentication
- Create, edit, like, comment and bookmark posts
- Real-time messaging with Socket.IO
- Notifications for likes/comments/follows
- Ephemeral stories
- Image uploads via Cloudinary

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Mongoose (MongoDB), Socket.IO
- Deployment: Vercel (frontend), any Node host for backend / Docker-ready

---

## Quickstart

Prerequisites: Node.js 18+, npm, and a running MongoDB instance (local or hosted).

Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env, then start the dev server
npm run dev
```

Important `.env` variables (see `backend/.env.example`):

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend expects the backend at `http://localhost:3000` — update the frontend config if your backend is on a different host.

---

## Project Structure

Top-level layout (simplified):

```
social-media/
├── backend/        # Express + TypeScript backend
│   ├── src/
│   └── package.json
├── frontend/       # React + TypeScript frontend (Vite)
│   └── package.json
├── docs/           # Documentation (API, data model, guides)
└── README.md
```

For details on routes and request/response shapes, see `docs/api.md` and `docs/data-model.md`.

---

## Development & Scripts

Backend

```bash
npm run dev       # start backend in dev mode (from backend/)
npm run build     # build TypeScript
npm start         # run built server
```

Frontend

```bash
npm run dev       # start Vite dev server (from frontend/)
npm run build     # build production assets
npm run preview   # preview production build
```

Run TypeScript checks for each package:

```bash
# from repo root
npx -w tsc --noEmit   # (workspace-aware) or run per-package
```

---

## Testing

Tests are not included by default. When tests are added, run:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Documentation

- API reference: `docs/api.md`
- Data model: `docs/data-model.md`
- Developer notes and environment examples: `backend/.env.example`

---

## License

MIT

---
