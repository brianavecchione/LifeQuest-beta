-- Fix Level Up badge and force frontend sync for user Briana
-- User ID: c5070bec-0cb8-4895-8626-8c6ca48e9113

-- Mark Level Up badge as unlockable since user is Level 16 (well above Level 5)
UPDATE public.achievements 
SET 
  achievement_progress_current = 5,
  is_unlockable = TRUE
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
  AND achievement_name = 'Level Up!'
  AND NOT is_completed;

-- Also check Hundred Club badge (Level 10) - should also be unlockable
UPDATE public.achievements 
SET 
  achievement_progress_current = 10,
  is_unlockable = TRUE  
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
  AND achievement_name = 'Hundred Club'
  AND NOT is_completed;