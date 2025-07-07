-- Update user stats to Level 2, 105 XP, 90 Gold
UPDATE public.profiles 
SET 
  xp_balance = 105,
  gold_balance = 90,
  user_level = 2,
  level_progress = 5.00,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Update user_balances table to match
UPDATE public.user_balances 
SET 
  current_gold_balance = 90,
  updated_at = now()
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627';

-- Fix XP calculation functions for progressive leveling curve
-- New formula: Level 1 = 100 XP, Level 2 = 200 XP, Level 3 = 300 XP, etc.
CREATE OR REPLACE FUNCTION public.calculate_xp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Progressive curve: each level requires level * 100 XP total
  RETURN level_num * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update level calculation from total XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- With progressive curve: Level = total_xp / 100 (rounded up, minimum 1)
  RETURN GREATEST(CEIL(total_xp / 100.0), 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update level progress calculation
CREATE OR REPLACE FUNCTION public.calculate_level_progress(total_xp INTEGER, current_level INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  current_level_min_xp INTEGER;
  next_level_min_xp INTEGER;
  progress_xp INTEGER;
  progress_percentage DECIMAL(5,2);
BEGIN
  -- XP required to reach current level
  current_level_min_xp := CASE 
    WHEN current_level = 1 THEN 0
    ELSE (current_level - 1) * 100
  END;
  
  -- XP required to reach next level
  next_level_min_xp := current_level * 100;
  
  -- Progress within current level
  progress_xp := total_xp - current_level_min_xp;
  
  -- Calculate percentage (avoid division by zero)
  IF (next_level_min_xp - current_level_min_xp) > 0 THEN
    progress_percentage := (progress_xp * 100.0) / (next_level_min_xp - current_level_min_xp);
  ELSE
    progress_percentage := 0;
  END IF;
  
  -- Ensure percentage is between 0 and 100
  RETURN GREATEST(0, LEAST(100, progress_percentage));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Ensure badge XP is properly tracked in daily XP history
-- Update the achievement completion trigger to include daily XP tracking
CREATE OR REPLACE FUNCTION public.handle_achievement_unlock_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark as unlockable when progress reaches goal but not yet claimed
  IF NEW.achievement_progress_current >= NEW.achievement_progress_goal 
     AND NOT OLD.is_unlockable 
     AND NOT NEW.is_completed THEN
    NEW.is_unlockable = TRUE;
  END IF;
  
  -- When manually claimed, mark as completed and set both timestamps
  IF NEW.is_completed AND NOT OLD.is_completed AND NEW.claimed_at IS NOT NULL THEN
    NEW.earned_at = NEW.claimed_at;
    NEW.is_unlockable = FALSE;
    
    -- Award XP and Gold rewards AND track in daily XP history
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;