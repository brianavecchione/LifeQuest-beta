-- Add unlockable status to achievements table
ALTER TABLE public.achievements 
ADD COLUMN is_unlockable BOOLEAN NOT NULL DEFAULT FALSE;

-- Add claimed_at timestamp for when user manually claims the badge
ALTER TABLE public.achievements 
ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE;

-- Update the achievement completion trigger to handle unlockable status
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
    
    -- Award XP and Gold rewards only when claimed
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace the old achievement completion trigger
DROP TRIGGER IF EXISTS achievement_completion_trigger ON public.achievements;
CREATE TRIGGER achievement_unlock_status_trigger
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.handle_achievement_unlock_status();

-- Function to claim a badge
CREATE OR REPLACE FUNCTION public.claim_achievement(p_achievement_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  achievement_record RECORD;
BEGIN
  -- Get the achievement and verify it's unlockable
  SELECT * INTO achievement_record 
  FROM public.achievements 
  WHERE id = p_achievement_id 
    AND user_id = p_user_id 
    AND is_unlockable = TRUE 
    AND is_completed = FALSE;
    
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Mark as completed and claimed
  UPDATE public.achievements 
  SET 
    is_completed = TRUE,
    is_unlockable = FALSE,
    claimed_at = now(),
    earned_at = now()
  WHERE id = p_achievement_id AND user_id = p_user_id;
  
  -- Award rewards
  PERFORM public.update_user_stats(p_user_id, achievement_record.xp_reward, achievement_record.gold_reward);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Update existing achievements to properly set unlockable status
UPDATE public.achievements 
SET is_unlockable = TRUE 
WHERE achievement_progress_current >= achievement_progress_goal 
  AND is_completed = FALSE;