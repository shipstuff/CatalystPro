-- Sample data for Catalyst Pro
-- Run this after migrations to populate database with test data

-- Insert sample users
INSERT INTO users (username, email, password_hash, experience) VALUES
('demo_user', 'demo@example.com', '$2b$10$sample_hash_here', 0.0),
('math_wizard', 'wizard@example.com', '$2b$10$sample_hash_here', 150.5),
('history_buff', 'history@example.com', '$2b$10$sample_hash_here', 89.25);

-- Insert sample quizzes
INSERT INTO quizzes (title, subject, description, difficulty_level, total_questions) VALUES
('Basic Math', 'math', 'Simple arithmetic and algebra questions', 'easy', 3),
('World War II', 'history', 'Questions about the Second World War', 'medium', 3),
('Basic Science', 'science', 'Elementary science concepts', 'easy', 3);

-- Insert sample questions for Basic Math quiz (quiz_id = 1)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, points_value, explanation) VALUES
(1, 'What is 5 + 3?', '6', '7', '8', '9', 'C', 1, 1.0, 'Simple addition: 5 + 3 = 8'),
(1, 'What is 12 ÷ 4?', '2', '3', '4', '5', 'B', 2, 1.0, 'Division: 12 divided by 4 equals 3'),
(1, 'What is 2 × 6?', '10', '11', '12', '13', 'C', 3, 1.0, 'Multiplication: 2 times 6 equals 12');

-- Insert sample questions for World War II quiz (quiz_id = 2)  
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, points_value, explanation) VALUES
(2, 'When did World War II begin?', '1938', '1939', '1940', '1941', 'B', 1, 1.0, 'WWII began on September 1, 1939 when Germany invaded Poland'),
(2, 'Which country was NOT part of the Axis powers?', 'Germany', 'Italy', 'Japan', 'Soviet Union', 'D', 2, 1.0, 'The Soviet Union fought against the Axis powers as part of the Allies'),
(2, 'What was D-Day?', 'End of the war', 'Pearl Harbor attack', 'Normandy invasion', 'Atomic bomb', 'C', 3, 1.0, 'D-Day was the Allied invasion of Normandy, France on June 6, 1944');

-- Insert sample questions for Basic Science quiz (quiz_id = 3)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, points_value, explanation) VALUES
(3, 'What is the chemical symbol for water?', 'H2O', 'HO2', 'H3O', 'OH2', 'A', 1, 1.0, 'Water is H2O - two hydrogen atoms and one oxygen atom'),
(3, 'How many planets are in our solar system?', '7', '8', '9', '10', 'B', 2, 1.0, 'There are 8 planets in our solar system (Pluto is now classified as a dwarf planet)'),
(3, 'What gas do plants absorb from the atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 'C', 3, 1.0, 'Plants absorb carbon dioxide during photosynthesis and release oxygen'); 