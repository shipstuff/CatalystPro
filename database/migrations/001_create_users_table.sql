-- Migration: Create users table
-- Created: 2024-01-01
-- Description: Initial users table with OAuth support and experience points

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for OAuth-only users
    experience FLOAT DEFAULT 0.0, -- Points earned from quizzes
    
    -- OAuth support columns
    google_id VARCHAR(255) UNIQUE, -- Google OAuth ID
    github_id VARCHAR(255) UNIQUE, -- GitHub OAuth ID (optional)
    avatar_url VARCHAR(500), -- Profile picture from OAuth provider
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id); 