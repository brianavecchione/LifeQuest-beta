-- Update the existing Tuesday entry to show 50 XP instead of 155
UPDATE public.daily_xp_history 
SET xp_earned = 50, updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND date = '2025-07-08';

-- Insert a new entry for Monday with 125 XP
INSERT INTO public.daily_xp_history (user_id, date, xp_earned, created_at, updated_at)
VALUES (
  'e85290c2-1a57-4ff8-bb87-642307a5e627',
  '2025-07-07',
  125,
  now(),
  now()
);