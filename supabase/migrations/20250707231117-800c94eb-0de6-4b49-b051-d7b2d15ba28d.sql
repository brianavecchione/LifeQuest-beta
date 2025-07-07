-- Fix the type casting error by dropping all dependent triggers first
DROP TRIGGER IF EXISTS update_badge_progress_trigger ON public.quests;
DROP TRIGGER IF EXISTS update_badge_progress_on_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS quest_badge_progress_trigger ON public.quests;

-- Now drop the function
DROP FUNCTION IF EXISTS public.update_badge_progress() CASCADE;

-- Recreate the function with proper time handling
CREATE OR REPLACE FUNCTION public.update_badge_progress()
RETURNS TRIGGER AS $$
DECLARE
    user_profile RECORD;
    quest_count INTEGER;
    daily_count INTEGER;
    side_count INTEGER;
    main_count INTEGER;
    legendary_count INTEGER;
    tagged_quest_count INTEGER;
    priority_quest_count INTEGER;
    completed_hour INTEGER;
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
        
        -- Count quests with tags
        SELECT COUNT(*) INTO tagged_quest_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND tags IS NOT NULL AND array_length(tags, 1) > 0;
        
        -- Count quests with priorities set
        SELECT COUNT(*) INTO priority_quest_count
        FROM public.quests 
        WHERE user_id = NEW.user_id AND priority != 'Medium';
        
        -- Check completion time for time-based badges - FIX THE CASTING ERROR HERE
        IF NEW.completed_at IS NOT NULL THEN
            completed_hour := EXTRACT(HOUR FROM NEW.completed_at);
        ELSE
            completed_hour := NULL;
        END IF;
        
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
        
        -- Tag Master (15 different quests with tags)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(15, tagged_quest_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Tag Master';
        
        -- Priority Pro (10 quests with priorities set)
        UPDATE public.achievements 
        SET achievement_progress_current = LEAST(10, priority_quest_count)
        WHERE user_id = NEW.user_id AND achievement_name = 'Priority Pro';
        
        -- Time-based badges - properly handle the hour extraction
        IF completed_hour IS NOT NULL THEN
            IF completed_hour >= 22 THEN
                UPDATE public.achievements 
                SET achievement_progress_current = 1
                WHERE user_id = NEW.user_id AND achievement_name = 'Night Owl';
            END IF;
            
            IF completed_hour <= 7 THEN
                UPDATE public.achievements 
                SET achievement_progress_current = 1
                WHERE user_id = NEW.user_id AND achievement_name = 'Early Bird';
            END IF;
        END IF;
        
        -- Level-based badges (update based on current profile)
        IF user_profile IS NOT NULL THEN
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
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_badge_progress_trigger
AFTER UPDATE ON public.quests
FOR EACH ROW
EXECUTE FUNCTION public.update_badge_progress();