-- Hard reset user stats to correct values
UPDATE public.profiles 
SET 
  xp_balance = 105,
  gold_balance = 90,
  user_level = 1,
  level_progress = 0.00,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Also reset user_balances table if it exists
UPDATE public.user_balances 
SET 
  current_gold_balance = 90,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Check for any completed achievements that might be contributing excess gold
SELECT 
  achievement_name,
  quest_value,
  xp_reward,
  gold_reward,
  is_completed,
  earned_at,
  claimed_at
FROM public.achievements 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
AND is_completed = true
ORDER BY earned_at;