-- Fix update_user_stats function to work with user_balances table instead of profiles.gold_balance
CREATE OR REPLACE FUNCTION public.update_user_stats(p_user_id uuid, xp_gained integer, gold_gained integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update user level and XP in profiles table
  UPDATE public.profiles 
  SET 
    xp_balance = xp_balance + xp_gained,
    user_level = public.calculate_level_from_xp(xp_balance + xp_gained),
    level_progress = public.calculate_level_progress(xp_balance + xp_gained, public.calculate_level_from_xp(xp_balance + xp_gained)),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Update gold balance in user_balances table
  INSERT INTO public.user_balances (user_id, current_gold_balance, total_gold_earned)
  VALUES (p_user_id, gold_gained, GREATEST(0, gold_gained))
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    current_gold_balance = GREATEST(0, user_balances.current_gold_balance + gold_gained),
    total_gold_earned = CASE 
      WHEN gold_gained > 0 THEN user_balances.total_gold_earned + gold_gained 
      ELSE user_balances.total_gold_earned 
    END,
    updated_at = now();
    
  RAISE NOTICE 'Updated user stats: +% XP, +% Gold for user %', xp_gained, gold_gained, p_user_id;
END;
$function$