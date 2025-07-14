-- Add debugging to update_daily_xp_history function
CREATE OR REPLACE FUNCTION public.update_daily_xp_history(p_user_id uuid, xp_gained integer)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
BEGIN
  RAISE NOTICE 'DEBUG: update_daily_xp_history called for user % with XP: % on date %', p_user_id, xp_gained, today_date;
  
  -- Insert or update daily XP for today
  INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
  VALUES (p_user_id, today_date, xp_gained)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    xp_earned = daily_xp_history.xp_earned + EXCLUDED.xp_earned,
    updated_at = now();
    
  RAISE NOTICE 'DEBUG: update_daily_xp_history completed for user %', p_user_id;
END;
$$;