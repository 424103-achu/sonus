# Sonus

Sonus is a full-stack social web application where users can build profiles, manage friendships, share story-based content, maintain comfort-zone lists (movies and foods), upload resumes, and chat in real time.

## Features

- JWT-based authentication (register/login/logout)
- Protected client routes and protected API endpoints
- Profile management with visibility logic based on owner/close-friend access
- Friend and close-friend management
- Story modules: school, graduation, creative works, friends, close friends
- Comfort-zone modules: movies and foods
- Resume upload, preview, stream, and deletion using Cloudinary
- One-to-one chat for mutual accepted friends only
- Real-time chat events with Socket.IO

## Tech Stack

### Frontend

- React 19
- Vite (Rolldown Vite)
- React Router 7
- Axios
- Tailwind CSS 4
- Framer Motion
- React Spring
- Lucide React
- React Icons
- Socket.IO Client

### Backend

- Node.js (ES Modules)
- Express 5
- PostgreSQL driver (`pg`)
- JWT (`jsonwebtoken`)
- `bcrypt`
- `multer` (memory storage)
- Cloudinary SDK
- Socket.IO
- `cors`
- `dotenv`

### Database

- PostgreSQL
- SQL schema and index scripts in [database/schema.sql](database/schema.sql), [database/createindex.sql](database/createindex.sql), [database/Prevent_duplicate_friendship.sql](database/Prevent_duplicate_friendship.sql)

## Architecture Overview

### Runtime

- Frontend dev server: `http://localhost:5173`
- Backend API + realtime server: `http://localhost:5000`
- API base URL from frontend: `VITE_API_URL` (defaults to `http://localhost:5000/api`)

### Backend layering

- `routes` -> endpoint wiring
- `middleware` -> JWT verification
- `controllers` -> request validation and orchestration
- `models` -> SQL data access via PostgreSQL pool
- `utils/realtime.js` -> user socket registry and event emission helpers

### Realtime chat flow

- Frontend connects with `socket.io-client` and sends `userId` in handshake query
- Backend stores `userId -> socketId[]`
- On send/delete message, backend emits:
  - `chat:message`
  - `chat:message:deleted`
- Active chat UI updates from REST + socket events

## Repository Structure

```text
sonus/
|- backend/
|  |- scripts/
|  |  |- applyChatDb.mjs
|  |  |- verifyChatDb.mjs
|  |- src/
|  |  |- app.js
|  |  |- server.js
|  |  |- config/
|  |  |- controllers/
|  |  |- middleware/
|  |  |- models/
|  |  |- routes/
|  |  |- tests/
|  |  |- utils/
|  |- package.json
|- frontend/
|  |- src/
|  |  |- api/
|  |  |- components/
|  |  |- context/
|  |  |- hooks/
|  |  |- pages/
|  |  |- realtime/
|  |  |- routes/
|  |  |- services/
|  |- package.json
|- database/
|  |- schema.sql
|  |- createindex.sql
|  |- Prevent_duplicate_friendship.sql
|  |- auto_sequentialise_safe_tables.sql
|- README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm

## Environment Variables

### Backend (`backend/.env`)

```env
DB_HOST=localhost
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=sonus_db
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
HOST=0.0.0.0
PORT=5000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
# Optional; if omitted, socket URL is inferred from VITE_API_URL
VITE_SOCKET_URL=http://localhost:5000
```

## Setup

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Create database and apply schema

```bash
# from project root
psql -U your_postgres_user -d postgres -f database/schema.sql
psql -U your_postgres_user -d sonus_db -f database/createindex.sql
psql -U your_postgres_user -d sonus_db -f database/Prevent_duplicate_friendship.sql
```

Optional maintenance trigger script:

```bash
psql -U your_postgres_user -d sonus_db -f database/auto_sequentialise_safe_tables.sql
```

### 3) Apply/verify chat DB objects (optional helper scripts)

```bash
cd backend
node scripts/applyChatDb.mjs
node scripts/verifyChatDb.mjs
```

## Run

### Development

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### Production-like local run

```bash
cd backend
npm start

cd ../frontend
npm run build
npm run preview
```

## API Summary

Base URL: `/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` (token required)

### User

- `GET /user/me`
- `PUT /user/profile`
- `POST /user/resume` (multipart, PDF only)
- `DELETE /user/resume`
- `GET /user/search?q=<prefix>`
- `GET /user/:id/home-visibility`
- `GET /user/:id/resume`
- `GET /user/:id/resume/preview-url`
- `GET /user/:id/resume/file`
- `GET /user/:id`

### Friends

- `GET /friends/close`
- `POST /friends/close`
- `DELETE /friends/close/:friendId`
- `DELETE /friends/:friendId`

### Stories

- `GET /stories/friends/search`
- `GET /stories/view/:targetUserId/:storyId`
- `GET /stories/view/:targetUserId/comfort-zone/:itemType`
- `GET /stories/comfort-zone/:itemType`
- `POST /stories/comfort-zone/:itemType`
- `PUT /stories/comfort-zone/:itemType/:itemId`
- `DELETE /stories/comfort-zone/:itemType/:itemId`
- `GET /stories/:storyId`
- `POST /stories/:storyId`
- `PUT /stories/:storyId/:itemId`
- `DELETE /stories/:storyId/:itemId`

### Chats

- `GET /chats`
- `GET /chats/:friendId/messages`
- `POST /chats/:friendId/messages`
- `DELETE /chats/:friendId/messages/:messageId`

## Database Highlights

Main tables:

- `users`
- `friendships`
- `direct_chats`
- `direct_chat_messages`
- `movies`
- `foods`
- `schools`
- `projects`
- `favorite_movies`
- `favorite_foods`
- `education`
- `user_projects`

Notable constraints and indexes:

- Unique friendship pair: `(user_id, friend_id)`
- No self-friendship check on `friendships`
- Ordered and unique direct chat pair: `(user_low_id, user_high_id)` with `user_low_id < user_high_id`
- `idx_users_username_search`
- `idx_direct_chat_messages_chat_created`
- `idx_friendships_pair_status`

## Notes

- JWT is stateless; logout is client-side token removal plus protected endpoint call.
- Axios request interceptor attaches `Authorization: Bearer <token>` when available.
- Axios response interceptor clears token and redirects on `401` for protected screens.
- CORS origins are controlled by backend `FRONTEND_URL` (comma-separated values supported).

## License

ISC
