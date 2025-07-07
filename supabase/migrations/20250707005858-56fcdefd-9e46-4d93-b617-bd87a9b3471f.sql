-- Add missing fields to achievements table
ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_is_completed ON public.achievements(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_achievements_tags ON public.achievements USING GIN(tags);

-- Create validation trigger for achievement progress
CREATE OR REPLACE FUNCTION public.validate_achievement_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure current progress never exceeds goal
  IF NEW.achievement_progress_current > NEW.achievement_progress_goal THEN
    NEW.achievement_progress_current = NEW.achievement_progress_goal;
  END IF;
  
  -- Ensure progress is not negative
  IF NEW.achievement_progress_current < 0 THEN
    NEW.achievement_progress_current = 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger
DROP TRIGGER IF EXISTS validate_achievement_progress_trigger ON public.achievements;
CREATE TRIGGER validate_achievement_progress_trigger
  BEFORE INSERT OR UPDATE ON public.achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_achievement_progress();

-- Update existing demo achievements to include tags
UPDATE public.achievements 
SET tags = CASE 
  WHEN achievement_name = 'Quest Initiate' THEN ARRAY['progression', 'beginner']
  WHEN achievement_name = 'Focus Master' THEN ARRAY['focus', 'productivity', 'habits']
  WHEN achievement_name = 'Quest Collector' THEN ARRAY['progression', 'completion']
  WHEN achievement_name = 'Legendary Hero' THEN ARRAY['legendary', 'challenge', 'elite']
  WHEN achievement_name = 'Streak Champion' THEN ARRAY['consistency', 'habits', 'persistence']
  WHEN achievement_name = 'Social Butterfly' THEN ARRAY['social', 'connection', 'friendship']
  ELSE ARRAY[]::TEXT[]
END
WHERE user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113' AND tags IS NULL;