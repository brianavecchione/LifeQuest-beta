-- Update existing streaks to match the requested streak types
UPDATE public.streaks 
SET streak_name = 'Daily Completion Streak',
    description = 'Consecutive days completing at least one quest (main or side)'
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND streak_name = 'Daily Habit Streak';

UPDATE public.streaks 
SET streak_name = 'Daily Focus Streak',
    description = 'Consecutive days completing your entire Today''s Focus list'
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND streak_name = 'Reading Streak';

UPDATE public.streaks 
SET streak_name = 'Daily Habits Streak',
    description = 'Consecutive days completing all daily habits'
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND streak_name = 'Exercise Streak';

-- Create function to calculate current streaks based on quest completion history
CREATE OR REPLACE FUNCTION public.calculate_current_streaks(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    completion_streak INTEGER := 0;
    focus_streak INTEGER := 0;
    habits_streak INTEGER := 0;
    check_date DATE;
    days_back INTEGER := 0;
    daily_completed BOOLEAN;
    focus_completed BOOLEAN;
    habits_completed BOOLEAN;
    total_focus_quests INTEGER;
    completed_focus_quests INTEGER;
    total_habits INTEGER;
    completed_habits INTEGER;
BEGIN
    -- Calculate Daily Completion Streak (consecutive days with at least one main/side quest completed)
    check_date := CURRENT_DATE;
    completion_streak := 0;
    
    LOOP
        SELECT COUNT(*) > 0 INTO daily_completed
        FROM public.quests 
        WHERE user_id = p_user_id 
          AND status = 'Completed' 
          AND DATE(completed_at) = check_date
          AND quest_type IN ('Main', 'Side');
        
        EXIT WHEN NOT daily_completed;
        completion_streak := completion_streak + 1;
        check_date := check_date - INTERVAL '1 day';
        days_back := days_back + 1;
        
        -- Prevent infinite loops
        EXIT WHEN days_back > 365;
    END LOOP;
    
    -- Calculate Daily Focus Streak (consecutive days completing all Today's Focus quests)
    -- Note: This is a simplified version - would need Today's Focus history to be fully accurate
    check_date := CURRENT_DATE;
    focus_streak := 0;
    days_back := 0;
    
    LOOP
        -- Check if user completed at least 3 main/side quests (typical focus amount)
        SELECT COUNT(*) INTO completed_focus_quests
        FROM public.quests 
        WHERE user_id = p_user_id 
          AND status = 'Completed' 
          AND DATE(completed_at) = check_date
          AND quest_type IN ('Main', 'Side');
        
        -- Assume focus is completed if 3+ main/side quests done
        focus_completed := completed_focus_quests >= 3;
        
        EXIT WHEN NOT focus_completed;
        focus_streak := focus_streak + 1;
        check_date := check_date - INTERVAL '1 day';
        days_back := days_back + 1;
        
        -- Prevent infinite loops
        EXIT WHEN days_back > 365;
    END LOOP;
    
    -- Calculate Daily Habits Streak (consecutive days completing all daily habits)
    check_date := CURRENT_DATE;
    habits_streak := 0;
    days_back := 0;
    
    LOOP
        -- Count total daily quests for this user
        SELECT COUNT(DISTINCT quest_name) INTO total_habits
        FROM public.quests 
        WHERE user_id = p_user_id 
          AND quest_type = 'Daily';
        
        -- Count completed daily quests for this date
        SELECT COUNT(*) INTO completed_habits
        FROM public.quests 
        WHERE user_id = p_user_id 
          AND status = 'Completed' 
          AND DATE(completed_at) = check_date
          AND quest_type = 'Daily';
        
        -- Check if all habits completed (or no habits exist)
        habits_completed := (total_habits = 0) OR (completed_habits >= total_habits);
        
        EXIT WHEN NOT habits_completed OR total_habits = 0;
        habits_streak := habits_streak + 1;
        check_date := check_date - INTERVAL '1 day';
        days_back := days_back + 1;
        
        -- Prevent infinite loops
        EXIT WHEN days_back > 365;
    END LOOP;
    
    -- Update streak records with proper enum casting
    UPDATE public.streaks 
    SET current_streak = completion_streak,
        best_streak = GREATEST(best_streak, completion_streak),
        status = CASE WHEN completion_streak > 0 THEN 'Active'::streak_status ELSE 'Inactive'::streak_status END,
        last_activity_date = CASE WHEN completion_streak > 0 THEN CURRENT_DATE ELSE last_activity_date END
    WHERE user_id = p_user_id AND streak_name = 'Daily Completion Streak';
    
    UPDATE public.streaks 
    SET current_streak = focus_streak,
        best_streak = GREATEST(best_streak, focus_streak),
        status = CASE WHEN focus_streak > 0 THEN 'Active'::streak_status ELSE 'Inactive'::streak_status END,
        last_activity_date = CASE WHEN focus_streak > 0 THEN CURRENT_DATE ELSE last_activity_date END
    WHERE user_id = p_user_id AND streak_name = 'Daily Focus Streak';
    
    UPDATE public.streaks 
    SET current_streak = habits_streak,
        best_streak = GREATEST(best_streak, habits_streak),
        status = CASE WHEN habits_streak > 0 THEN 'Active'::streak_status ELSE 'Inactive'::streak_status END,
        last_activity_date = CASE WHEN habits_streak > 0 THEN CURRENT_DATE ELSE last_activity_date END
    WHERE user_id = p_user_id AND streak_name = 'Daily Habits Streak';
    
    RAISE NOTICE 'Streaks calculated - Completion: %, Focus: %, Habits: %', completion_streak, focus_streak, habits_streak;
END;
$$;

-- Execute the streak calculation for the current user
SELECT public.calculate_current_streaks('e85290c2-1a57-4ff8-bb87-642307a5e627');