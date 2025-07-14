-- Add debugging to update_user_stats function
CREATE OR REPLACE FUNCTION public.update_user_stats(p_user_id uuid, xp_gained integer, gold_gained integer)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $$
DECLARE
  new_xp_balance INTEGER;
  new_gold_balance INTEGER;
  new_level INTEGER;
  new_progress DECIMAL(5,2);
  current_xp_balance INTEGER;
  current_gold_balance INTEGER;
BEGIN
  RAISE NOTICE 'DEBUG: update_user_stats called for user % with XP: % and Gold: %', p_user_id, xp_gained, gold_gained;
  
  -- Get current balances first
  SELECT xp_balance, gold_balance INTO current_xp_balance, current_gold_balance
  FROM public.profiles 
  WHERE user_id = p_user_id;
  
  RAISE NOTICE 'DEBUG: Current balances - XP: %, Gold: %', current_xp_balance, current_gold_balance;
  
  -- Calculate new balances, ensuring they don't go negative
  new_xp_balance := GREATEST(0, current_xp_balance + xp_gained);
  new_gold_balance := GREATEST(0, current_gold_balance + gold_gained);
  
  RAISE NOTICE 'DEBUG: New balances - XP: %, Gold: %', new_xp_balance, new_gold_balance;
  
  -- Update XP and Gold balance with protected values
  UPDATE public.profiles 
  SET 
    xp_balance = new_xp_balance,
    gold_balance = new_gold_balance
  WHERE user_id = p_user_id;
  
  -- Calculate new level and progress based on final XP balance
  new_level := public.calculate_level_from_xp(new_xp_balance);
  new_progress := public.calculate_level_progress(new_xp_balance, new_level);
  
  -- Update level and progress
  UPDATE public.profiles 
  SET 
    user_level = new_level,
    level_progress = new_progress
  WHERE user_id = p_user_id;
  
  RAISE NOTICE 'DEBUG: update_user_stats completed for user %', p_user_id;
END;
$$;