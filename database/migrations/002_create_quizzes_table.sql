-- Migration: Create quizzes table
-- Created: 2024-01-01
-- Description: Quizzes table with subject/type classification

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL, -- 'math', 'history', 'science', etc.
    description TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
    
    -- Quiz metadata
    total_questions INTEGER DEFAULT 0, -- Count of questions in this quiz
    time_limit_minutes INTEGER, -- Optional time limit (NULL = no limit)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_quizzes_subject ON quizzes(subject);
CREATE INDEX idx_quizzes_difficulty ON quizzes(difficulty_level); 