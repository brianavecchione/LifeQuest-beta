-- Drop and recreate the function with proper validation
DROP FUNCTION IF EXISTS public.recalculate_badge_progress(UUID);

-- Recreate with improved validation and logging
CREATE OR REPLACE FUNCTION public.recalculate_badge_progress(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    user_profile RECORD;
    quest_count INTEGER;
    daily_count INTEGER;
    side_count INTEGER;
    main_count INTEGER;
    legendary_count INTEGER;
    tagged_quest_count INTEGER;
    priority_quest_count INTEGER;
    habit_count INTEGER;
    night_owl_count INTEGER;
    early_bird_count INTEGER;
    user_signup_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get user profile data first with validation
    SELECT user_level, xp_balance, gold_balance INTO user_profile
    FROM public.profiles WHERE user_id = p_user_id;
    
    IF user_profile IS NULL THEN
        RAISE NOTICE 'No profile found for user %', p_user_id;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Recalculating badges for user % - Level: %, XP: %, Gold: %', 
        p_user_id, user_profile.user_level, user_profile.xp_balance, user_profile.gold_balance;
    
    -- Count all user activities with detailed logging
    SELECT COUNT(*) INTO quest_count
    FROM public.quests 
    WHERE user_id = p_user_id AND status = 'Completed';
    
    SELECT COUNT(*) INTO daily_count
    FROM public.quests 
    WHERE user_id = p_user_id AND status = 'Completed' AND quest_type = 'Daily';
    
    SELECT COUNT(*) INTO side_count
    FROM public.quests 
    WHERE user_id = p_user_id AND status = 'Completed' AND quest_type = 'Side';
    
    SELECT COUNT(*) INTO main_count
    FROM public.quests 
    WHERE user_id = p_user_id AND status = 'Completed' AND quest_type = 'Main';
    
    SELECT COUNT(*) INTO legendary_count
    FROM public.quests 
    WHERE user_id = p_user_id AND status = 'Completed' AND quest_type = 'Legendary';
    
    -- Count quests with tags
    SELECT COUNT(*) INTO tagged_quest_count
    FROM public.quests 
    WHERE user_id = p_user_id AND tags IS NOT NULL AND array_length(tags, 1) > 0;
    
    -- Count quests with non-default priorities
    SELECT COUNT(*) INTO priority_quest_count
    FROM public.quests 
    WHERE user_id = p_user_id AND priority != 'Medium';
    
    -- Count unique daily habits
    SELECT COUNT(DISTINCT quest_name) INTO habit_count
    FROM public.quests 
    WHERE user_id = p_user_id AND quest_type = 'Daily';
    
    -- Time-based completions
    SELECT COUNT(*) INTO night_owl_count
    FROM public.quests 
    WHERE user_id = p_user_id 
      AND status = 'Completed' 
      AND completed_at IS NOT NULL
      AND EXTRACT(HOUR FROM completed_at) >= 22;
    
    SELECT COUNT(*) INTO early_bird_count
    FROM public.quests 
    WHERE user_id = p_user_id 
      AND status = 'Completed' 
      AND completed_at IS NOT NULL
      AND EXTRACT(HOUR FROM completed_at) <= 7;
    
    RAISE NOTICE 'Activity counts - Total quests: %, Daily: %, Priority set: %, Tagged: %, Habits: %', 
        quest_count, daily_count, priority_quest_count, tagged_quest_count, habit_count;
    
    -- Update badge progress ONLY when user meets criteria
    
    -- Early Explorer (everyone gets this as beta user)
    UPDATE public.achievements 
    SET achievement_progress_current = 1
    WHERE user_id = p_user_id AND achievement_name = 'Early Explorer';
    
    -- First Steps - only if user has completed quests
    UPDATE public.achievements 
    SET achievement_progress_current = CASE WHEN quest_count >= 1 THEN 1 ELSE 0 END
    WHERE user_id = p_user_id AND achievement_name = 'First Steps';
    
    -- Quest Collector - track progress but only unlock when requirement met
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(10, quest_count)
    WHERE user_id = p_user_id AND achievement_name = 'Quest Collector';
    
    -- Quest Crusader 
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(50, quest_count)
    WHERE user_id = p_user_id AND achievement_name = 'Quest Crusader';
    
    -- Daily Devotee
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(25, daily_count)
    WHERE user_id = p_user_id AND achievement_name = 'Daily Devotee';
    
    -- Side Quest Specialist
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(15, side_count)
    WHERE user_id = p_user_id AND achievement_name = 'Side Quest Specialist';
    
    -- Main Quest Master
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(10, main_count)
    WHERE user_id = p_user_id AND achievement_name = 'Main Quest Master';
    
    -- Legendary Hero
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(1, legendary_count)
    WHERE user_id = p_user_id AND achievement_name = 'Legendary Hero';
    
    -- Tag Master
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(15, tagged_quest_count)
    WHERE user_id = p_user_id AND achievement_name = 'Tag Master';
    
    -- Priority Pro - only count if user has set priorities
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(10, priority_quest_count)
    WHERE user_id = p_user_id AND achievement_name = 'Priority Pro';
    
    -- Habit Builder - count unique daily quest names
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(5, habit_count)
    WHERE user_id = p_user_id AND achievement_name = 'Habit Builder';
    
    -- Time-based badges
    UPDATE public.achievements 
    SET achievement_progress_current = CASE WHEN night_owl_count >= 1 THEN 1 ELSE 0 END
    WHERE user_id = p_user_id AND achievement_name = 'Night Owl';
    
    UPDATE public.achievements 
    SET achievement_progress_current = CASE WHEN early_bird_count >= 1 THEN 1 ELSE 0 END
    WHERE user_id = p_user_id AND achievement_name = 'Early Bird';
    
    -- Level-based badges - use actual user level
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(5, user_profile.user_level)
    WHERE user_id = p_user_id AND achievement_name = 'Level Up!';
    
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(10, user_profile.user_level)
    WHERE user_id = p_user_id AND achievement_name = 'Hundred Club';
    
    -- Gold and XP based badges - use actual balances
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(1000, user_profile.gold_balance)
    WHERE user_id = p_user_id AND achievement_name = 'Gold Rush';
    
    UPDATE public.achievements 
    SET achievement_progress_current = LEAST(2000, user_profile.xp_balance)
    WHERE user_id = p_user_id AND achievement_name = 'XP Hunter';
    
    RAISE NOTICE 'Badge progress recalculation completed for user %', p_user_id;
    
END;
$$ LANGUAGE plpgsql;