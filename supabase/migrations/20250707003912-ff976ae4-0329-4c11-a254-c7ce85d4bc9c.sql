-- Update user profile with demo data
UPDATE public.profiles 
SET 
  display_name = 'DemoUser',
  gold_balance = 1250,
  user_level = 4,
  xp_balance = 2350,
  level_progress = 40.00,
  party_rank = 'Champion'
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113';

-- Insert demo quests with various statuses and types
INSERT INTO public.quests (user_id, quest_name, description, quest_type, status, priority, xp_reward, gold_reward, due_date, completed_at, tags) VALUES 
-- Daily Habits
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Drink 8 glasses of water', 'Stay hydrated throughout the day', 'Daily', 'Completed', 'High', 50, 25, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours', ARRAY['health', 'hydration']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Morning meditation', '10 minutes of mindfulness', 'Daily', 'Completed', 'Medium', 40, 20, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '5 hours', ARRAY['wellness', 'mindfulness']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Exercise for 30 minutes', 'Any form of physical activity', 'Daily', 'In Progress', 'High', 60, 30, CURRENT_DATE, NULL, ARRAY['fitness', 'health']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Read before bed', 'Read for 20 minutes before sleep', 'Daily', 'Not started', 'Low', 35, 15, CURRENT_DATE, NULL, ARRAY['learning', 'habit']),

-- Main Quests
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Read 30 pages of Atomic Habits', 'Continue reading productivity book', 'Main', 'In Progress', 'High', 150, 75, CURRENT_DATE + INTERVAL '3 days', NULL, ARRAY['learning', 'productivity']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Complete online course', 'Finish JavaScript fundamentals course', 'Main', 'In Progress', 'High', 300, 150, CURRENT_DATE + INTERVAL '7 days', NULL, ARRAY['learning', 'programming']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Plan vacation itinerary', 'Research and plan summer vacation', 'Main', 'Completed', 'Medium', 200, 100, CURRENT_DATE - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day', ARRAY['travel', 'planning']),

-- Side Quests
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Finish quarterly report', 'Complete Q4 performance review', 'Side', 'Not started', 'High', 250, 125, CURRENT_DATE - INTERVAL '1 day', NULL, ARRAY['work', 'report']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Organize home office', 'Declutter and reorganize workspace', 'Side', 'In Progress', 'Medium', 100, 50, CURRENT_DATE + INTERVAL '5 days', NULL, ARRAY['organization', 'home']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Call old friend', 'Catch up with college roommate', 'Side', 'Completed', 'Low', 75, 35, CURRENT_DATE - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days', ARRAY['social', 'friendship']),

-- Legendary Quests
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Run a marathon', 'Complete 26.2 mile race', 'Legendary', 'In Progress', 'High', 500, 200, CURRENT_DATE + INTERVAL '90 days', NULL, ARRAY['fitness', 'challenge', 'endurance']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Learn a new language', 'Achieve conversational fluency in Spanish', 'Legendary', 'In Progress', 'Medium', 400, 180, CURRENT_DATE + INTERVAL '180 days', NULL, ARRAY['learning', 'language', 'skill']),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Write a novel', 'Complete first draft of fiction book', 'Legendary', 'Not started', 'Low', 600, 250, CURRENT_DATE + INTERVAL '365 days', NULL, ARRAY['creative', 'writing', 'achievement']);

-- Insert demo achievements
INSERT INTO public.achievements (user_id, achievement_name, description, achievement_progress_current, achievement_progress_goal, is_completed, earned_at, xp_reward, gold_reward, quest_value) VALUES 
-- Completed achievement
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Quest Initiate', 'Complete your first quest', 1, 1, true, CURRENT_TIMESTAMP - INTERVAL '5 days', 100, 50, 'Bronze'),

-- In progress achievements
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Focus Master', 'Complete 5 daily habit quests', 3, 5, false, NULL, 200, 100, 'Silver'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Quest Collector', 'Complete 10 quests of any type', 7, 10, false, NULL, 150, 75, 'Bronze'),

-- Locked achievements
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Legendary Hero', 'Complete your first Legendary quest', 0, 1, false, NULL, 500, 250, 'Legendary'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Streak Champion', 'Maintain a 30-day daily habit streak', 0, 30, false, NULL, 300, 150, 'Gold'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Social Butterfly', 'Complete 5 social-related quests', 1, 5, false, NULL, 150, 80, 'Silver');

-- Insert demo streaks
INSERT INTO public.streaks (user_id, streak_name, description, current_streak, best_streak, status, last_activity_date) VALUES 
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Daily Habit Streak', 'Consecutive days completing at least one daily habit', 7, 15, 'Active', CURRENT_DATE),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Reading Streak', 'Consecutive days of reading', 4, 12, 'Active', CURRENT_DATE),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Exercise Streak', 'Consecutive days of physical activity', 0, 8, 'Inactive', CURRENT_DATE - INTERVAL '3 days');