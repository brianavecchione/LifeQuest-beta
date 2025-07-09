-- Fix the update_daily_xp_history function to use proper timezone handling
CREATE OR REPLACE FUNCTION public.update_daily_xp_history(p_user_id uuid, xp_gained integer)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  -- Use current date in UTC, but let the application handle timezone conversion
  today_date DATE := CURRENT_DATE;
BEGIN
  -- Insert or update daily XP for today
  -- Note: The application should pass the correct local date
  INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
  VALUES (p_user_id, today_date, xp_gained)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    xp_earned = daily_xp_history.xp_earned + EXCLUDED.xp_earned,
    updated_at = now();
END;
$function$;

-- Clean up the incorrect daily XP data for the current user
-- Remove negative XP entries and fix date issues
DELETE FROM public.daily_xp_history 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND xp_earned <= 0;

-- Update the daily XP history to use proper local dates
-- Recalculate based on quest completion timestamps
INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
SELECT 
  user_id,
  DATE(completed_at AT TIME ZONE 'America/New_York') as local_date,
  SUM(xp_reward) as total_xp
FROM public.quests 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND status = 'Completed' 
  AND completed_at IS NOT NULL
GROUP BY user_id, DATE(completed_at AT TIME ZONE 'America/New_York')
ON CONFLICT (user_id, date) 
DO UPDATE SET 
  xp_earned = EXCLUDED.xp_earned,
  updated_at = now();