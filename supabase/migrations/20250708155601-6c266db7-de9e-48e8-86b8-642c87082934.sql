-- Clear all current "Ready to Claim" badge flags for the current user
UPDATE public.achievements 
SET is_unlockable = false, 
    updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND is_unlockable = true;

-- Create a function to accurately recalculate badge eligibility
CREATE OR REPLACE FUNCTION public.recalculate_badge_eligibility(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    user_profile RECORD;
    early_bird_count INTEGER;
    current_date_local DATE := CURRENT_DATE;
BEGIN
    -- Get user profile data
    SELECT user_level, xp_balance, gold_balance INTO user_profile
    FROM public.profiles WHERE user_id = p_user_id;
    
    IF user_profile IS NULL THEN
        RAISE NOTICE 'No profile found for user %', p_user_id;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Recalculating badge eligibility for user % - Level: %, XP: %, Gold: %', 
        p_user_id, user_profile.user_level, user_profile.xp_balance, user_profile.gold_balance;
    
    -- Clear all unlockable flags first
    UPDATE public.achievements 
    SET is_unlockable = false 
    WHERE user_id = p_user_id AND is_unlockable = true;
    
    -- Check Early Bird Badge: Must have completed at least one quest before 7:00 AM TODAY
    SELECT COUNT(*) INTO early_bird_count
    FROM public.quests 
    WHERE user_id = p_user_id 
      AND status = 'Completed' 
      AND completed_at IS NOT NULL
      AND DATE(completed_at) = current_date_local  -- Must be today
      AND EXTRACT(HOUR FROM completed_at) < 7;     -- Before 7:00 AM
    
    -- Update Early Bird badge eligibility
    IF early_bird_count > 0 THEN
        UPDATE public.achievements 
        SET is_unlockable = true, 
            achievement_progress_current = 1
        WHERE user_id = p_user_id 
          AND achievement_name = 'Early Bird'
          AND is_completed = false;
        
        RAISE NOTICE 'Early Bird badge marked as unlockable (completed % quests before 7 AM today)', early_bird_count;
    ELSE
        UPDATE public.achievements 
        SET achievement_progress_current = 0
        WHERE user_id = p_user_id 
          AND achievement_name = 'Early Bird';
        
        RAISE NOTICE 'Early Bird badge remains locked (no quests completed before 7 AM today)';
    END IF;
    
    -- Check Level Up Badge: Must be level 5 or higher
    IF user_profile.user_level >= 5 THEN
        UPDATE public.achievements 
        SET is_unlockable = true,
            achievement_progress_current = user_profile.user_level
        WHERE user_id = p_user_id 
          AND achievement_name = 'Level Up!'
          AND is_completed = false;
        
        RAISE NOTICE 'Level Up badge marked as unlockable (user level: %)', user_profile.user_level;
    ELSE
        UPDATE public.achievements 
        SET achievement_progress_current = user_profile.user_level
        WHERE user_id = p_user_id 
          AND achievement_name = 'Level Up!';
        
        RAISE NOTICE 'Level Up badge remains locked (user level: % < 5)', user_profile.user_level;
    END IF;
    
    -- Log the recalculation completion
    RAISE NOTICE 'Badge eligibility recalculation completed for user %', p_user_id;
END;
$$;

-- Execute the recalculation for the current user
SELECT public.recalculate_badge_eligibility('e85290c2-1a57-4ff8-bb87-642307a5e627');