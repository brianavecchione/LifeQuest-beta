-- Fix the badge unlockable logic to properly check if progress meets goal
-- Update all achievements to have correct is_unlockable status

UPDATE public.achievements 
SET is_unlockable = (
  achievement_progress_current >= achievement_progress_goal 
  AND NOT is_completed
)
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Verify the Level Up badge is now correctly locked
SELECT achievement_name, achievement_progress_current, achievement_progress_goal, is_unlockable 
FROM achievements 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
AND achievement_name = 'Level Up!';