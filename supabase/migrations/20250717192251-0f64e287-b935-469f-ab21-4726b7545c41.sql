-- Force recalculation of user level using the updated progressive formula
-- Update the user's level and progress based on their current XP using the new functions

UPDATE public.profiles 
SET 
  user_level = public.calculate_level_from_xp(xp_balance),
  level_progress = public.calculate_level_progress(xp_balance, public.calculate_level_from_xp(xp_balance))
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Also force recalculation of badge progress with the corrected level
SELECT public.recalculate_badge_progress('e85290c2-1a57-4ff8-bb87-642307a5e627');