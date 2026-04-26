# Sonus - A Structured Portfolio Website

Sonus is a full-stack web application where users can share stories, connect with friends, manage profiles, and build a social network. The platform features authenticated user accounts, profile management, friend connections, and story sharing capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Project Structure Details](#project-structure-details)

## ✨ Features

- **Authentication**: User registration and login with JWT tokens and bcrypt password hashing
- **User Profiles**: Create and manage user profiles with personal information (name, location, bio, resume, etc.)
- **Friend System**: Connect with other users, manage friend requests and relationships
- **Story Sharing**: Post and share stories with the community
- **Image Upload**: Upload images using Cloudinary integration
- **Responsive Design**: Mobile-friendly UI built with React and Tailwind CSS
- **Protected Routes**: Secure pages that require authentication

## 🏗️ Project Structure

```
sonus/
├── backend/                    # Node.js + Express server
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   ├── server.js          # Server entry point
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route handlers (auth, user, friend, story)
│   │   ├── middleware/        # Auth middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Database utilities
│   │   └── tests/             # Test files
│   └── package.json
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── api/               # API client setup
│   │   ├── components/        # Reusable React components
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components (auth, app)
│   │   ├── routes/            # React Router setup
│   │   ├── services/          # API services
│   │   
│   └── package.json
├── database/                   # Database schema and setup
│   ├── schema.sql            # Main database schema
│   ├── auto_sequentialise_safe_tables.sql
│   ├── createindex.sql       # Database indexes
│   └── Prevent_duplicate_friendship.sql
└── README.md                  # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image hosting and management
- **Multer** - File upload handling
- **CORS** - Cross-origin request handling

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library

### DevTools
- **Nodemon** - Auto-restart Node.js during development
- **ESLint** - Code linting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_NAME=sonus_db
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

3. Set up the database:
   ```bash
   psql -U your_postgres_user -d postgres -f ../database/schema.sql
   psql -U your_postgres_user -d sonus_db -f ../database/createindex.sql
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or the next available port)

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🗄️ Database

The database uses PostgreSQL with the following main tables:

- **users** - User accounts with profile information
- **stories** - User-generated stories and posts
- **friendships** - Friend connections between users
- **movies, foods, schools, projects** - User interest/activity tracking tables

See `database/schema.sql` for the complete schema.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - Get list of users

### Friends
- `POST /api/friends/add` - Send friend request
- `GET /api/friends/:id` - Get user's friends
- `DELETE /api/friends/:id` - Remove friend

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create a new story
- `GET /api/stories/:id` - Get story details
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

## 🔒 Authentication

The application uses JWT-based authentication:

1. User provides credentials (email/username and password)
2. Backend validates and returns a JWT token
3. Token is stored in browser and sent with each subsequent request
4. Protected routes require valid JWT token

Passwords are hashed using bcrypt before storing in the database.

## 📝 Development Notes

- The `ProtectedRoute` component ensures only authenticated users can access certain pages
- The `AuthContext` manages global authentication state
- Environment variables must be set correctly for Cloudinary and database connections
- CORS is configured to allow requests from the frontend

## 📄 License

ISC
