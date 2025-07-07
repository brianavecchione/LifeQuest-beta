-- Update existing achievements to use standardized gold rewards by tier
UPDATE public.achievements 
SET gold_reward = CASE 
    WHEN quest_value = 'Bronze' THEN 10
    WHEN quest_value = 'Silver' THEN 25
    WHEN quest_value = 'Gold' THEN 50
    WHEN quest_value = 'Legendary' THEN 50  -- Keep Legendary at Gold tier level
    ELSE gold_reward  -- Fallback to existing value
END;

-- Update the comprehensive badge seeding function to use standardized values
CREATE OR REPLACE FUNCTION public.seed_comprehensive_badges(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Progress & Consistency Badges
    INSERT INTO public.achievements (user_id, achievement_name, description, achievement_progress_current, achievement_progress_goal, is_completed, xp_reward, gold_reward, quest_value, tags) VALUES
    (p_user_id, 'Early Explorer', 'Welcome to the beta! You''re one of the first adventurers', 0, 1, false, 50, 50, 'Gold', ARRAY['beta', 'special']),
    (p_user_id, 'First Steps', 'Complete your very first quest', 0, 1, false, 10, 10, 'Bronze', ARRAY['progress', 'milestone']),
    (p_user_id, 'Level Up!', 'Reach level 5', 0, 5, false, 25, 25, 'Silver', ARRAY['progress', 'leveling']),
    (p_user_id, 'Consistency King', 'Maintain a 7-day daily habit streak', 0, 7, false, 50, 50, 'Gold', ARRAY['consistency', 'habits']),
    (p_user_id, 'Streak Master', 'Achieve a 30-day streak', 0, 30, false, 75, 50, 'Legendary', ARRAY['consistency', 'dedication']),
    (p_user_id, 'Hundred Club', 'Reach level 10', 0, 10, false, 50, 50, 'Gold', ARRAY['progress', 'milestone']),
    
    -- Quest & Learning Milestones
    (p_user_id, 'Quest Collector', 'Complete 10 quests of any type', 0, 10, false, 10, 10, 'Bronze', ARRAY['quests', 'completion']),
    (p_user_id, 'Daily Devotee', 'Complete 25 daily habit quests', 0, 25, false, 25, 25, 'Silver', ARRAY['habits', 'dedication']),
    (p_user_id, 'Side Quest Specialist', 'Complete 15 side quests', 0, 15, false, 25, 25, 'Silver', ARRAY['quests', 'exploration']),
    (p_user_id, 'Main Quest Master', 'Complete 10 main quests', 0, 10, false, 50, 50, 'Gold', ARRAY['quests', 'focus']),
    (p_user_id, 'Legendary Hero', 'Complete your first Legendary quest', 0, 1, false, 75, 50, 'Legendary', ARRAY['quests', 'epic']),
    (p_user_id, 'Habit Builder', 'Create 5 different daily habits', 0, 5, false, 10, 10, 'Bronze', ARRAY['habits', 'variety']),
    (p_user_id, 'Quest Crusader', 'Complete 50 quests total', 0, 50, false, 50, 50, 'Gold', ARRAY['quests', 'dedication']),
    
    -- Social & Party Play
    (p_user_id, 'Team Player', 'Join your first party', 0, 1, false, 25, 25, 'Silver', ARRAY['social', 'collaboration']),
    (p_user_id, 'Party Leader', 'Create and lead a party', 0, 1, false, 50, 50, 'Gold', ARRAY['social', 'leadership']),
    (p_user_id, 'Supportive Friend', 'Help complete 5 party quests', 0, 5, false, 25, 25, 'Silver', ARRAY['social', 'support']),
    (p_user_id, 'Social Butterfly', 'Complete 10 social-related quests', 0, 10, false, 25, 25, 'Silver', ARRAY['social', 'interaction']),
    
    -- Focus & Planning
    (p_user_id, 'Focus Finder', 'Use Today''s Focus for the first time', 0, 1, false, 10, 10, 'Bronze', ARRAY['focus', 'planning']),
    (p_user_id, 'Priority Pro', 'Set priorities on 10 quests', 0, 10, false, 10, 10, 'Bronze', ARRAY['planning', 'organization']),
    (p_user_id, 'Tag Master', 'Use tags on 15 different quests', 0, 15, false, 10, 10, 'Bronze', ARRAY['organization', 'tagging']),
    (p_user_id, 'Pomodoro Pioneer', 'Complete 5 focused work sessions', 0, 5, false, 25, 25, 'Silver', ARRAY['focus', 'productivity']),
    (p_user_id, 'Planning Perfectionist', 'Complete 7 days of Today''s Focus', 0, 7, false, 50, 50, 'Gold', ARRAY['focus', 'consistency']),
    
    -- Fun & Surprise
    (p_user_id, 'Style Icon', 'Upload a custom avatar', 0, 1, false, 10, 10, 'Bronze', ARRAY['customization', 'fun']),
    (p_user_id, 'Shopaholic', 'Make your first gold purchase', 0, 1, false, 10, 10, 'Bronze', ARRAY['shopping', 'rewards']),
    (p_user_id, 'Collector', 'Earn 10 different badges', 0, 10, false, 50, 50, 'Gold', ARRAY['collection', 'achievement']),
    (p_user_id, 'Gold Rush', 'Accumulate 1000 gold', 0, 1000, false, 25, 25, 'Silver', ARRAY['wealth', 'progress']),
    (p_user_id, 'XP Hunter', 'Earn 2000 total XP', 0, 2000, false, 25, 25, 'Silver', ARRAY['experience', 'growth']),
    (p_user_id, 'Night Owl', 'Complete a quest after 10 PM', 0, 1, false, 10, 10, 'Bronze', ARRAY['fun', 'timing']),
    (p_user_id, 'Early Bird', 'Complete a quest before 7 AM', 0, 1, false, 10, 10, 'Bronze', ARRAY['fun', 'timing']);
END;
$function$;