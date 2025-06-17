# Catalyst Pro - Educational Quiz Platform

A full-stack educational quiz application built with React, Node.js, and PostgreSQL. Features user authentication, quiz management, and AI-powered assistance through Google Gemini API.

## Project Purpose

This application is designed as a demo for interview presentations at online education companies. It showcases:
- Modern full-stack development practices
- User authentication and authorization
- Database design and management
- API development
- React frontend with TypeScript
- Real-time quiz functionality with scoring

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Webpack** for bundling and development server
- **CSS-in-JS** styling (inline styles for simplicity)
- **localStorage** for token management

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for primary database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Google Cloud Spanner** (planned for real-time features)
- **Google Gemini API** (planned for AI assistance)

### Development Tools
- **nodemon** for auto-restart during development
- **concurrently** to run client and server simultaneously
- **TypeScript** for type safety
- **Database migrations** for schema management

## Current Features

### Implemented
- **User Authentication**
  - User signup with email/password
  - Secure login with JWT tokens
  - Password hashing with bcrypt
  - Token persistence in localStorage
  - Logout functionality
  - Protected routes middleware

- **Database Structure**
  - Users table (with OAuth fields ready)
  - Quizzes table (with subjects/categories)
  - Questions table (multiple choice with explanations)
  - Database migrations system

- **Quiz Management**
  - API to fetch all quizzes
  - API to fetch questions for specific quiz
  - Sample seed data (Math, History, Science quizzes)

- **Frontend Interface**
  - Quiz browsing interface
  - Login/signup forms
  - Real-time login status
  - Quiz question display

### Planned Features
- **Quiz Taking Interface**
  - Interactive quiz sessions
  - Answer submission and validation
  - Experience points system (100% → 75% → 0% based on attempts)
  - Real-time scoring

- **AI Integration**
  - Google Gemini API for hints and explanations
  - Personalized feedback on wrong answers
  - Help system during quiz attempts

- **OAuth Integration**
  - Google OAuth login
  - GitHub OAuth login (optional)
  - Social login UI components

- **Advanced Features**
  - User leaderboards
  - Quiz history and analytics
  - Real-time multiplayer (using Google Spanner)

## Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd CatalystPro

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Database Setup

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE catalyst_pro;
CREATE USER catalyst_user WITH PASSWORD 'catalyst_password';
GRANT ALL PRIVILEGES ON DATABASE catalyst_pro TO catalyst_user;
ALTER DATABASE catalyst_pro OWNER TO catalyst_user;
\q
```

### 3. Environment Configuration

Create `server/.env` file:

```env
# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=catalyst_user
POSTGRES_PASSWORD=catalyst_password
POSTGRES_DATABASE=catalyst_pro

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Future: Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
SPANNER_INSTANCE=catalyst-instance
SPANNER_DATABASE=catalyst-db
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Database Migration and Seeding

```bash
# Run migrations to create tables
cd server && node migrate.js

# Seed database with sample data
node seed.js
```

### 5. Start Development Servers

```bash
# From root directory - runs both client and server
npm run dev

# Or run separately:
# Terminal 1: npm run server:dev
# Terminal 2: npm run client:dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000


## 🗄 Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR, nullable for OAuth users)
- experience (FLOAT, default 0.0) -- Points earned
- google_id (VARCHAR, nullable) -- Google OAuth ID
- github_id (VARCHAR, nullable) -- GitHub OAuth ID
- avatar_url (VARCHAR, nullable) -- Profile picture
- created_at, updated_at (TIMESTAMPS)
```

### Quizzes Table
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR) -- "Basic Math", "World War II"
- subject (VARCHAR) -- "math", "history", "science"
- description (TEXT)
- difficulty_level (VARCHAR) -- "easy", "medium", "hard"
- total_questions (INTEGER)
- time_limit_minutes (INTEGER, nullable)
- created_at, updated_at (TIMESTAMPS)
```

### Questions Table
```sql
- id (SERIAL PRIMARY KEY)
- quiz_id (INTEGER, FOREIGN KEY)
- question_text (TEXT)
- option_a, option_b, option_c, option_d (VARCHAR)
- correct_answer (CHAR) -- 'A', 'B', 'C', or 'D'
- question_order (INTEGER) -- Order within quiz
- points_value (FLOAT, default 1.0)
- explanation (TEXT) -- For AI assistance
- created_at, updated_at (TIMESTAMPS)
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /login` - Authenticate user, returns JWT token
- `POST /logout` - Clear authentication (client-side)
- `GET /profile` - Get current user profile (protected)

### Quizzes (`/api/quizzes`)
- `GET /` - Get all available quizzes
- `GET /:id/questions` - Get questions for specific quiz

### Health Check
- `GET /api/health` - Server status check
- `GET /api/db-test` - Database connection test

## Testing

### Manual Testing Endpoints

```bash
# Test user signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Test user login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test protected route (use token from login response)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test quiz endpoints
curl http://localhost:5000/api/quizzes
curl http://localhost:5000/api/quizzes/1/questions
```

## Next Development Steps

### Immediate Priorities
1. **Quiz Taking Interface**
   - Create quiz session management
   - Implement answer submission
   - Add experience points calculation API
   - Build quiz results display

2. **Experience Points System**
   - API endpoint to update user experience
   - Scoring logic (100% → 75% → 0% based on attempts)
   - User profile with points display

3. **Google Gemini Integration**
   - Set up Google Cloud credentials
   - Create hint/help API endpoints
   - Integrate AI explanations for wrong answers

### Future Enhancements
1. **OAuth Integration**
   - Google OAuth setup and UI
   - GitHub OAuth (optional)
   - Social login flow

2. **Advanced Features**
   - Real-time leaderboards with Google Spanner
   - Quiz history and analytics
   - User progress tracking
   - Admin interface for creating quizzes

3. **Production Readiness**
   - Input validation and sanitization
   - Rate limiting
   - Error logging
   - Docker containerization
   - Deployment configuration

## Known Issues

- No input validation on frontend forms
- Password requirements not enforced
- No rate limiting on API endpoints
- Console logging in production mode
- No automated tests


## Development Notes

- JWT tokens expire in 7 days (configurable in .env)
- Database migrations run in numerical order
- Frontend uses Webpack proxy to communicate with backend
- All passwords are hashed with bcrypt (10 rounds)
- OAuth fields are ready in database but not implemented
- Experience points stored as FLOAT for precise calculations

---

**Last Updated:** December 2024
**Status:** Authentication and basic quiz browsing complete
**Next Milestone:** Quiz taking functionality with scoring