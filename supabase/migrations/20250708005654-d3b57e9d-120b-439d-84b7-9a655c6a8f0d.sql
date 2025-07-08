-- Update today's XP history to reflect actual XP earned (115 XP total for today)
UPDATE public.daily_xp_history 
SET 
  xp_earned = 115,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND date = CURRENT_DATE;

-- If no record exists for today, insert it
INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
SELECT 'e85290c2-1a57-4ff8-bb87-642307a5e627', CURRENT_DATE, 115
WHERE NOT EXISTS (
  SELECT 1 FROM public.daily_xp_history 
  WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
    AND date = CURRENT_DATE
);