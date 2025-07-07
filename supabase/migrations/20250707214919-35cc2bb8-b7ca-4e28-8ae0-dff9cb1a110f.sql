-- Create function to seed comprehensive badge system for new users
CREATE OR REPLACE FUNCTION public.seed_comprehensive_badges(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Progress & Consistency Badges
    INSERT INTO public.achievements (user_id, achievement_name, description, achievement_progress_current, achievement_progress_goal, is_completed, xp_reward, gold_reward, quest_value, tags) VALUES
    (p_user_id, 'Early Explorer', 'Welcome to the beta! You''re one of the first adventurers', 0, 1, false, 150, 100, 'Gold', ARRAY['beta', 'special']),
    (p_user_id, 'First Steps', 'Complete your very first quest', 0, 1, false, 100, 50, 'Bronze', ARRAY['progress', 'milestone']),
    (p_user_id, 'Level Up!', 'Reach level 5', 0, 5, false, 200, 100, 'Silver', ARRAY['progress', 'leveling']),
    (p_user_id, 'Consistency King', 'Maintain a 7-day daily habit streak', 0, 7, false, 300, 150, 'Gold', ARRAY['consistency', 'habits']),
    (p_user_id, 'Streak Master', 'Achieve a 30-day streak', 0, 30, false, 500, 250, 'Legendary', ARRAY['consistency', 'dedication']),
    (p_user_id, 'Hundred Club', 'Reach level 10', 0, 10, false, 400, 200, 'Gold', ARRAY['progress', 'milestone']),
    
    -- Quest & Learning Milestones
    (p_user_id, 'Quest Collector', 'Complete 10 quests of any type', 0, 10, false, 150, 75, 'Bronze', ARRAY['quests', 'completion']),
    (p_user_id, 'Daily Devotee', 'Complete 25 daily habit quests', 0, 25, false, 250, 125, 'Silver', ARRAY['habits', 'dedication']),
    (p_user_id, 'Side Quest Specialist', 'Complete 15 side quests', 0, 15, false, 200, 100, 'Silver', ARRAY['quests', 'exploration']),
    (p_user_id, 'Main Quest Master', 'Complete 10 main quests', 0, 10, false, 300, 150, 'Gold', ARRAY['quests', 'focus']),
    (p_user_id, 'Legendary Hero', 'Complete your first Legendary quest', 0, 1, false, 500, 250, 'Legendary', ARRAY['quests', 'epic']),
    (p_user_id, 'Habit Builder', 'Create 5 different daily habits', 0, 5, false, 150, 75, 'Bronze', ARRAY['habits', 'variety']),
    (p_user_id, 'Quest Crusader', 'Complete 50 quests total', 0, 50, false, 400, 200, 'Gold', ARRAY['quests', 'dedication']),
    
    -- Social & Party Play
    (p_user_id, 'Team Player', 'Join your first party', 0, 1, false, 200, 100, 'Silver', ARRAY['social', 'collaboration']),
    (p_user_id, 'Party Leader', 'Create and lead a party', 0, 1, false, 300, 150, 'Gold', ARRAY['social', 'leadership']),
    (p_user_id, 'Supportive Friend', 'Help complete 5 party quests', 0, 5, false, 250, 125, 'Silver', ARRAY['social', 'support']),
    (p_user_id, 'Social Butterfly', 'Complete 10 social-related quests', 0, 10, false, 200, 100, 'Silver', ARRAY['social', 'interaction']),
    
    -- Focus & Planning
    (p_user_id, 'Focus Finder', 'Use Today''s Focus for the first time', 0, 1, false, 100, 50, 'Bronze', ARRAY['focus', 'planning']),
    (p_user_id, 'Priority Pro', 'Set priorities on 10 quests', 0, 10, false, 150, 75, 'Bronze', ARRAY['planning', 'organization']),
    (p_user_id, 'Tag Master', 'Use tags on 15 different quests', 0, 15, false, 150, 75, 'Bronze', ARRAY['organization', 'tagging']),
    (p_user_id, 'Pomodoro Pioneer', 'Complete 5 focused work sessions', 0, 5, false, 200, 100, 'Silver', ARRAY['focus', 'productivity']),
    (p_user_id, 'Planning Perfectionist', 'Complete 7 days of Today''s Focus', 0, 7, false, 300, 150, 'Gold', ARRAY['focus', 'consistency']),
    
    -- Fun & Surprise
    (p_user_id, 'Style Icon', 'Upload a custom avatar', 0, 1, false, 100, 50, 'Bronze', ARRAY['customization', 'fun']),
    (p_user_id, 'Shopaholic', 'Make your first gold purchase', 0, 1, false, 150, 75, 'Bronze', ARRAY['shopping', 'rewards']),
    (p_user_id, 'Collector', 'Earn 10 different badges', 0, 10, false, 300, 150, 'Gold', ARRAY['collection', 'achievement']),
    (p_user_id, 'Gold Rush', 'Accumulate 1000 gold', 0, 1000, false, 200, 100, 'Silver', ARRAY['wealth', 'progress']),
    (p_user_id, 'XP Hunter', 'Earn 2000 total XP', 0, 2000, false, 250, 125, 'Silver', ARRAY['experience', 'growth']),
    (p_user_id, 'Night Owl', 'Complete a quest after 10 PM', 0, 1, false, 100, 50, 'Bronze', ARRAY['fun', 'timing']),
    (p_user_id, 'Early Bird', 'Complete a quest before 7 AM', 0, 1, false, 100, 50, 'Bronze', ARRAY['fun', 'timing']);
END;
$function$;

-- Update the seed_locked_achievements function to use the new comprehensive system
CREATE OR REPLACE FUNCTION public.seed_locked_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Use the comprehensive badge system
    PERFORM public.seed_comprehensive_badges(p_user_id);
END;
$function$;

-- Create function to automatically award Early Explorer badge to new users
CREATE OR REPLACE FUNCTION public.award_early_explorer_badge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Award Early Explorer badge immediately upon profile creation
    UPDATE public.achievements 
    SET 
        achievement_progress_current = 1,
        is_completed = true,
        earned_at = now()
    WHERE user_id = NEW.user_id 
      AND achievement_name = 'Early Explorer';
    
    -- Award XP and Gold for the Early Explorer badge
    PERFORM public.update_user_stats(NEW.user_id, 150, 100);
    
    RETURN NEW;
END;
$function$;

-- Create trigger to award Early Explorer badge when profile is created
CREATE TRIGGER award_early_explorer_on_profile_creation
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.award_early_explorer_badge();

-- Create function to track badge progress based on quest completion
CREATE OR REPLACE FUNCTION public.update_badge_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    user_profile RECORD;
    quest_count INTEGER;
    daily_count INTEGER;
    side_count INTEGER;
    main_count INTEGER;
    legendary_count INTEGER;
BEGIN
    -- Only process when quest status changes to 'Completed'
    IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
        
        -- Get user profile data
        SELECT user_level, xp_balance, gold_balance INTO user_profile
        FROM public.profiles WHERE user_id = NEW.user_id;
        
        -- Count completed quests by type
        SELECT COUNT(*) INTO quest_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND status = 'Completed';
        
        SELECT COUNT(*) INTO daily_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND status = 'Completed' AND quest_type = 'Daily';
        
        SELECT COUNT(*) INTO side_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND status = 'Completed' AND quest_type = 'Side';
        
        SELECT COUNT(*) INTO main_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND status = 'Completed' AND quest_type = 'Main';
        
        SELECT COUNT(*) INTO legendary_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND status = 'Completed' AND quest_type = 'Legendary';
        
        -- Update relevant badge progress
        
        -- First Steps (complete first quest)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(1, quest_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'First Steps';
        
        -- Quest Collector (10 quests)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(10, quest_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Quest Collector';
        
        -- Quest Crusader (50 quests)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(50, quest_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Quest Crusader';
        
        -- Daily Devotee (25 daily quests)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(25, daily_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Daily Devotee';
        
        -- Side Quest Specialist (15 side quests)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(15, side_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Side Quest Specialist';
        
        -- Main Quest Master (10 main quests)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(10, main_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Main Quest Master';
        
        -- Legendary Hero (1 legendary quest)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(1, legendary_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Legendary Hero';
        
        -- Level-based badges
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(5, user_profile.user_level)
        WHERE user_id = NEW.user_id AND achievement_name = 'Level Up!';
        
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(10, user_profile.user_level)
        WHERE user_id = NEW.user_id AND achievement_name = 'Hundred Club';
        
        -- Gold and XP based badges
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(1000, user_profile.gold_balance)
        WHERE user_id = NEW.user_id AND achievement_name = 'Gold Rush';
        
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(2000, user_profile.xp_balance)
        WHERE user_id = NEW.user_id AND achievement_name = 'XP Hunter';
        
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger to update badge progress on quest completion
CREATE TRIGGER update_badge_progress_on_quest_completion
    AFTER UPDATE ON public.quests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_badge_progress();