-- Update badge XP rewards to prevent fast leveling
-- Bronze: 10 XP, Silver: 25 XP, Gold: 50 XP, Legendary: 75 XP

-- First, create a function to recalculate user XP based on new badge rewards
CREATE OR REPLACE FUNCTION public.recalculate_user_xp_from_badges()
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    badge_record RECORD;
    old_xp_from_badges INTEGER;
    new_xp_from_badges INTEGER;
    xp_difference INTEGER;
    new_level INTEGER;
    new_progress DECIMAL(5,2);
BEGIN
    -- For each user, recalculate their XP based on completed badges
    FOR user_record IN SELECT DISTINCT user_id FROM public.achievements WHERE is_completed = true LOOP
        old_xp_from_badges := 0;
        new_xp_from_badges := 0;
        
        -- Calculate old XP from completed badges
        SELECT COALESCE(SUM(xp_reward), 0) INTO old_xp_from_badges
        FROM public.achievements 
        WHERE user_id = user_record.user_id AND is_completed = true;
        
        -- Calculate new XP from completed badges with updated rewards
        FOR badge_record IN 
            SELECT quest_value FROM public.achievements 
            WHERE user_id = user_record.user_id AND is_completed = true 
        LOOP
            CASE badge_record.quest_value
                WHEN 'Bronze' THEN new_xp_from_badges := new_xp_from_badges + 10;
                WHEN 'Silver' THEN new_xp_from_badges := new_xp_from_badges + 25;
                WHEN 'Gold' THEN new_xp_from_badges := new_xp_from_badges + 50;
                WHEN 'Legendary' THEN new_xp_from_badges := new_xp_from_badges + 75;
            END CASE;
        END LOOP;
        
        -- Calculate the difference and update user XP balance
        xp_difference := new_xp_from_badges - old_xp_from_badges;
        
        -- Update user XP balance (ensure it doesn't go negative)
        UPDATE public.profiles 
        SET xp_balance = GREATEST(0, xp_balance + xp_difference)
        WHERE user_id = user_record.user_id;
        
        -- Recalculate level and progress based on new XP balance
        SELECT xp_balance INTO xp_difference FROM public.profiles WHERE user_id = user_record.user_id;
        new_level := public.calculate_level_from_xp(xp_difference);
        new_progress := public.calculate_level_progress(xp_difference, new_level);
        
        UPDATE public.profiles 
        SET 
            user_level = new_level,
            level_progress = new_progress
        WHERE user_id = user_record.user_id;
        
        RAISE NOTICE 'Updated user % - Old badge XP: %, New badge XP: %, Difference: %', 
            user_record.user_id, old_xp_from_badges, new_xp_from_badges, xp_difference;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update XP rewards for all badges based on their tier
UPDATE public.achievements 
SET xp_reward = CASE quest_value
    WHEN 'Bronze' THEN 10
    WHEN 'Silver' THEN 25
    WHEN 'Gold' THEN 50
    WHEN 'Legendary' THEN 75
    ELSE xp_reward
END;

-- Recalculate user XP balances based on new badge rewards
SELECT public.recalculate_user_xp_from_badges();

-- Drop the temporary function
DROP FUNCTION public.recalculate_user_xp_from_badges();

-- Update the seed function to use new XP values for future users
CREATE OR REPLACE FUNCTION public.seed_comprehensive_badges(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Progress & Consistency Badges
    INSERT INTO public.achievements (user_id, achievement_name, description, achievement_progress_current, achievement_progress_goal, is_completed, xp_reward, gold_reward, quest_value, tags) VALUES
    (p_user_id, 'Early Explorer', 'Welcome to the beta! You''re one of the first adventurers', 0, 1, false, 50, 100, 'Gold', ARRAY['beta', 'special']),
    (p_user_id, 'First Steps', 'Complete your very first quest', 0, 1, false, 10, 50, 'Bronze', ARRAY['progress', 'milestone']),
    (p_user_id, 'Level Up!', 'Reach level 5', 0, 5, false, 25, 100, 'Silver', ARRAY['progress', 'leveling']),
    (p_user_id, 'Consistency King', 'Maintain a 7-day daily habit streak', 0, 7, false, 50, 150, 'Gold', ARRAY['consistency', 'habits']),
    (p_user_id, 'Streak Master', 'Achieve a 30-day streak', 0, 30, false, 75, 250, 'Legendary', ARRAY['consistency', 'dedication']),
    (p_user_id, 'Hundred Club', 'Reach level 10', 0, 10, false, 50, 200, 'Gold', ARRAY['progress', 'milestone']),
    
    -- Quest & Learning Milestones
    (p_user_id, 'Quest Collector', 'Complete 10 quests of any type', 0, 10, false, 10, 75, 'Bronze', ARRAY['quests', 'completion']),
    (p_user_id, 'Daily Devotee', 'Complete 25 daily habit quests', 0, 25, false, 25, 125, 'Silver', ARRAY['habits', 'dedication']),
    (p_user_id, 'Side Quest Specialist', 'Complete 15 side quests', 0, 15, false, 25, 100, 'Silver', ARRAY['quests', 'exploration']),
    (p_user_id, 'Main Quest Master', 'Complete 10 main quests', 0, 10, false, 50, 150, 'Gold', ARRAY['quests', 'focus']),
    (p_user_id, 'Legendary Hero', 'Complete your first Legendary quest', 0, 1, false, 75, 250, 'Legendary', ARRAY['quests', 'epic']),
    (p_user_id, 'Habit Builder', 'Create 5 different daily habits', 0, 5, false, 10, 75, 'Bronze', ARRAY['habits', 'variety']),
    (p_user_id, 'Quest Crusader', 'Complete 50 quests total', 0, 50, false, 50, 200, 'Gold', ARRAY['quests', 'dedication']),
    
    -- Social & Party Play
    (p_user_id, 'Team Player', 'Join your first party', 0, 1, false, 25, 100, 'Silver', ARRAY['social', 'collaboration']),
    (p_user_id, 'Party Leader', 'Create and lead a party', 0, 1, false, 50, 150, 'Gold', ARRAY['social', 'leadership']),
    (p_user_id, 'Supportive Friend', 'Help complete 5 party quests', 0, 5, false, 25, 125, 'Silver', ARRAY['social', 'support']),
    (p_user_id, 'Social Butterfly', 'Complete 10 social-related quests', 0, 10, false, 25, 100, 'Silver', ARRAY['social', 'interaction']),
    
    -- Focus & Planning
    (p_user_id, 'Focus Finder', 'Use Today''s Focus for the first time', 0, 1, false, 10, 50, 'Bronze', ARRAY['focus', 'planning']),
    (p_user_id, 'Priority Pro', 'Set priorities on 10 quests', 0, 10, false, 10, 75, 'Bronze', ARRAY['planning', 'organization']),
    (p_user_id, 'Tag Master', 'Use tags on 15 different quests', 0, 15, false, 10, 75, 'Bronze', ARRAY['organization', 'tagging']),
    (p_user_id, 'Pomodoro Pioneer', 'Complete 5 focused work sessions', 0, 5, false, 25, 100, 'Silver', ARRAY['focus', 'productivity']),
    (p_user_id, 'Planning Perfectionist', 'Complete 7 days of Today''s Focus', 0, 7, false, 50, 150, 'Gold', ARRAY['focus', 'consistency']),
    
    -- Fun & Surprise
    (p_user_id, 'Style Icon', 'Upload a custom avatar', 0, 1, false, 10, 50, 'Bronze', ARRAY['customization', 'fun']),
    (p_user_id, 'Shopaholic', 'Make your first gold purchase', 0, 1, false, 10, 75, 'Bronze', ARRAY['shopping', 'rewards']),
    (p_user_id, 'Collector', 'Earn 10 different badges', 0, 10, false, 50, 150, 'Gold', ARRAY['collection', 'achievement']),
    (p_user_id, 'Gold Rush', 'Accumulate 1000 gold', 0, 1000, false, 25, 100, 'Silver', ARRAY['wealth', 'progress']),
    (p_user_id, 'XP Hunter', 'Earn 2000 total XP', 0, 2000, false, 25, 125, 'Silver', ARRAY['experience', 'growth']),
    (p_user_id, 'Night Owl', 'Complete a quest after 10 PM', 0, 1, false, 10, 50, 'Bronze', ARRAY['fun', 'timing']),
    (p_user_id, 'Early Bird', 'Complete a quest before 7 AM', 0, 1, false, 10, 50, 'Bronze', ARRAY['fun', 'timing']);
END;
$function$;