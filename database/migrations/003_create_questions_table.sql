-- Migration: Create questions table
-- Created: 2024-01-01  
-- Description: Questions table as child of quizzes, with multiple choice options

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    
    -- Multiple choice options (JSON format for flexibility)
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    
    -- Question metadata
    question_order INTEGER NOT NULL, -- Order within the quiz (1, 2, 3...)
    points_value FLOAT DEFAULT 1.0, -- Base points for getting this question right
    explanation TEXT, -- Explanation for the correct answer
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(quiz_id, question_order);

-- Ensure unique ordering within each quiz
CREATE UNIQUE INDEX idx_questions_quiz_order ON questions(quiz_id, question_order); 