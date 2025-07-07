-- Fix badge gold rewards and level-based badge eligibility for user Briana
-- User ID: c5070bec-0cb8-4895-8626-8c6ca48e9113

-- First, let's check current state and add gold rewards to badges that don't have them
UPDATE public.achievements 
SET gold_reward = CASE 
  WHEN quest_value = 'Bronze' THEN 25
  WHEN quest_value = 'Silver' THEN 50  
  WHEN quest_value = 'Gold' THEN 100
  WHEN quest_value = 'Legendary' THEN 200
  ELSE gold_reward
END
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
  AND gold_reward = 0;

-- Calculate gold owed from completed badges
DO $$
DECLARE
  earned_badges_gold INTEGER;
  current_gold INTEGER;
  current_level INTEGER;
BEGIN
  -- Get current user stats
  SELECT gold_balance, user_level INTO current_gold, current_level
  FROM public.profiles 
  WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
  
  -- Calculate total gold from earned badges
  SELECT COALESCE(SUM(gold_reward), 0) INTO earned_badges_gold
  FROM public.achievements 
  WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113' 
    AND is_completed = TRUE;
  
  RAISE NOTICE 'Current gold: %, Earned badges gold: %, Current level: %', 
    current_gold, earned_badges_gold, current_level;
  
  -- Update gold balance to include badge rewards (only add what's missing)
  -- Assuming current gold minus quest gold should equal badge gold
  UPDATE public.profiles 
  SET gold_balance = current_gold + earned_badges_gold
  WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
  
END $$;

-- Fix level-based badge eligibility - ensure Level Up badge is not unlockable until level 5
UPDATE public.achievements 
SET 
  is_unlockable = FALSE,
  achievement_progress_current = LEAST(achievement_progress_goal, 
    CASE 
      WHEN achievement_name = 'Level Up!' THEN (
        SELECT user_level FROM public.profiles WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
      )
      ELSE achievement_progress_current
    END
  )
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
  AND achievement_name = 'Level Up!'
  AND achievement_progress_current < achievement_progress_goal;

-- Fix other level-based badges similarly
UPDATE public.achievements 
SET 
  is_unlockable = FALSE,
  achievement_progress_current = LEAST(achievement_progress_goal,
    CASE 
      WHEN achievement_name = 'Hundred Club' THEN (
        SELECT user_level FROM public.profiles WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
      )
      ELSE achievement_progress_current
    END
  )
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113'
  AND achievement_name = 'Hundred Club'
  AND achievement_progress_current < achievement_progress_goal;

RAISE NOTICE 'Fixed badge gold rewards and level-based badge eligibility for user Briana';