-- Update XP calculation functions to match frontend progressive formula
-- Progressive XP formula: cumulative XP to reach level n = baseXP * (n * (n + 1)) / 2
-- Base XP = 100

-- Calculate total XP required to reach a specific level
CREATE OR REPLACE FUNCTION public.calculate_xp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Progressive triangular formula: baseXP * (level * (level + 1)) / 2
  RETURN 100 * (level_num * (level_num + 1)) / 2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate current level from total XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_level INTEGER := 1;
  xp_for_level INTEGER;
BEGIN
  -- Find the highest level where total XP meets the threshold
  WHILE true LOOP
    xp_for_level := 100 * (current_level * (current_level + 1)) / 2;
    IF total_xp < xp_for_level THEN
      EXIT;
    END IF;
    current_level := current_level + 1;
  END LOOP;
  
  RETURN current_level;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate level progress percentage
CREATE OR REPLACE FUNCTION public.calculate_level_progress(total_xp INTEGER, current_level INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  current_level_xp_threshold INTEGER;
  next_level_xp_threshold INTEGER;
  xp_in_current_level INTEGER;
  xp_required_for_next_level INTEGER;
  progress_percentage DECIMAL(5,2);
BEGIN
  -- Calculate XP thresholds
  current_level_xp_threshold := CASE 
    WHEN current_level = 1 THEN 0
    ELSE 100 * ((current_level - 1) * current_level) / 2
  END;
  
  next_level_xp_threshold := 100 * (current_level * (current_level + 1)) / 2;
  
  -- Calculate progress within current level
  xp_in_current_level := total_xp - current_level_xp_threshold;
  xp_required_for_next_level := next_level_xp_threshold - current_level_xp_threshold;
  
  -- Calculate percentage (avoid division by zero)
  IF xp_required_for_next_level > 0 THEN
    progress_percentage := (xp_in_current_level * 100.0) / xp_required_for_next_level;
  ELSE
    progress_percentage := 0;
  END IF;
  
  -- Ensure percentage is between 0 and 100
  RETURN GREATEST(0, LEAST(100, progress_percentage));
END;
$$ LANGUAGE plpgsql IMMUTABLE;