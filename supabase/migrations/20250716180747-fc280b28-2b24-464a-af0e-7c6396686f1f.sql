-- Fix update_daily_xp_history function to prevent negative XP values
CREATE OR REPLACE FUNCTION public.update_daily_xp_history(p_user_id uuid, xp_gained integer)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  current_xp INTEGER := 0;
  new_xp INTEGER;
BEGIN
  RAISE NOTICE 'DEBUG: update_daily_xp_history called for user % with XP: % on date %', p_user_id, xp_gained, today_date;
  
  -- Get current XP for today
  SELECT COALESCE(xp_earned, 0) INTO current_xp
  FROM public.daily_xp_history 
  WHERE user_id = p_user_id AND date = today_date;
  
  -- Calculate new XP, ensuring it doesn't go negative
  new_xp := GREATEST(0, current_xp + xp_gained);
  
  -- Insert or update daily XP for today with protection against negative values
  INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
  VALUES (p_user_id, today_date, new_xp)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    xp_earned = new_xp,
    updated_at = now();
    
  RAISE NOTICE 'DEBUG: update_daily_xp_history completed for user % - XP changed from % to %', p_user_id, current_xp, new_xp;
END;
$$;