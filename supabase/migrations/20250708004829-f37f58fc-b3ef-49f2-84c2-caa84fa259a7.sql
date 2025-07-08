-- Reset user stats to correct Level 2, 115 XP, 90 Gold
UPDATE public.profiles 
SET 
  xp_balance = 115,
  gold_balance = 90,
  user_level = 2,
  level_progress = 7.50,  -- 15 XP out of 200 XP needed for level = 7.5%
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Update user_balances table to match
UPDATE public.user_balances 
SET 
  current_gold_balance = 90,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Clear any incorrect daily XP history and reset to current values
DELETE FROM public.daily_xp_history 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Add today's baseline XP entry 
INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
VALUES ('e85290c2-1a57-4ff8-bb87-642307a5e627', CURRENT_DATE, 0);