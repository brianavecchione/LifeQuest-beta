-- Add user stats fields to the profiles table
ALTER TABLE public.profiles ADD COLUMN gold_balance INTEGER NOT NULL DEFAULT 0 CHECK (gold_balance >= 0);
ALTER TABLE public.profiles ADD COLUMN user_level INTEGER NOT NULL DEFAULT 1 CHECK (user_level >= 1);
ALTER TABLE public.profiles ADD COLUMN xp_balance INTEGER NOT NULL DEFAULT 0 CHECK (xp_balance >= 0);
ALTER TABLE public.profiles ADD COLUMN level_progress DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (level_progress >= 0 AND level_progress <= 100);
ALTER TABLE public.profiles ADD COLUMN party_rank TEXT DEFAULT 'Member';

-- Create function to calculate required XP for a given level
CREATE OR REPLACE FUNCTION public.calculate_xp_for_level(level_num INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- XP formula: level * 100 + (level - 1) * 50
  -- Level 1: 100 XP, Level 2: 250 XP, Level 3: 450 XP, etc.
  RETURN level_num * 100 + GREATEST(level_num - 1, 0) * 50;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to calculate level from total XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level_num INTEGER := 1;
  required_xp INTEGER;
BEGIN
  WHILE total_xp >= public.calculate_xp_for_level(level_num) LOOP
    level_num := level_num + 1;
  END LOOP;
  
  -- Return the previous level since we went one level too far
  RETURN GREATEST(level_num - 1, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to calculate level progress percentage
CREATE OR REPLACE FUNCTION public.calculate_level_progress(total_xp INTEGER, current_level INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  current_level_xp INTEGER;
  next_level_xp INTEGER;
  progress_xp INTEGER;
  progress_percentage DECIMAL(5,2);
BEGIN
  -- XP required for current level
  current_level_xp := CASE 
    WHEN current_level = 1 THEN 0
    ELSE public.calculate_xp_for_level(current_level - 1)
  END;
  
  -- XP required for next level
  next_level_xp := public.calculate_xp_for_level(current_level);
  
  -- Progress within current level
  progress_xp := total_xp - current_level_xp;
  
  -- Calculate percentage (avoid division by zero)
  IF (next_level_xp - current_level_xp) > 0 THEN
    progress_percentage := (progress_xp * 100.0) / (next_level_xp - current_level_xp);
  ELSE
    progress_percentage := 0;
  END IF;
  
  -- Ensure percentage is between 0 and 100
  RETURN GREATEST(0, LEAST(100, progress_percentage));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to update user stats when XP/Gold is earned
CREATE OR REPLACE FUNCTION public.update_user_stats(p_user_id UUID, xp_gained INTEGER, gold_gained INTEGER)
RETURNS VOID AS $$
DECLARE
  new_xp_balance INTEGER;
  new_gold_balance INTEGER;
  new_level INTEGER;
  new_progress DECIMAL(5,2);
BEGIN
  -- Update XP and Gold balance
  UPDATE public.profiles 
  SET 
    xp_balance = xp_balance + xp_gained,
    gold_balance = gold_balance + gold_gained
  WHERE user_id = p_user_id;
  
  -- Get the updated XP balance
  SELECT xp_balance, gold_balance INTO new_xp_balance, new_gold_balance
  FROM public.profiles 
  WHERE user_id = p_user_id;
  
  -- Calculate new level and progress
  new_level := public.calculate_level_from_xp(new_xp_balance);
  new_progress := public.calculate_level_progress(new_xp_balance, new_level);
  
  -- Update level and progress
  UPDATE public.profiles 
  SET 
    user_level = new_level,
    level_progress = new_progress
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to automatically update user stats when quests are completed
CREATE OR REPLACE FUNCTION public.handle_quest_stat_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stats when quest status changes to 'Completed'
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
  END IF;
  
  -- If quest status changes from 'Completed' to something else, subtract the rewards
  IF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user stats when quest status changes
CREATE TRIGGER quest_stat_update_trigger
AFTER UPDATE ON public.quests
FOR EACH ROW
EXECUTE FUNCTION public.handle_quest_stat_update();

-- Create index for efficient user stats queries
CREATE INDEX idx_profiles_user_stats ON public.profiles(user_id, user_level, xp_balance, gold_balance);

-- Initialize stats for existing users (set everyone to level 1 with 0 XP/Gold)
UPDATE public.profiles 
SET 
  gold_balance = 0,
  user_level = 1,
  xp_balance = 0,
  level_progress = 0.00,
  party_rank = 'Member'
WHERE gold_balance IS NULL;