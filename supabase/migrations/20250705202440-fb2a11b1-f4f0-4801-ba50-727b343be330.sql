-- Create enum for achievement tiers
CREATE TYPE public.achievement_tier AS ENUM ('Bronze', 'Silver', 'Gold', 'Legendary');

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_value achievement_tier NOT NULL DEFAULT 'Bronze',
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  gold_reward INTEGER NOT NULL DEFAULT 0 CHECK (gold_reward >= 0),
  achievement_progress_current INTEGER NOT NULL DEFAULT 0 CHECK (achievement_progress_current >= 0),
  achievement_progress_goal INTEGER NOT NULL DEFAULT 1 CHECK (achievement_progress_goal > 0),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure progress doesn't exceed goal
  CONSTRAINT valid_progress CHECK (achievement_progress_current <= achievement_progress_goal)
);

-- Enable Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own achievements" 
ON public.achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
ON public.achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
ON public.achievements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements" 
ON public.achievements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically mark achievement as completed and set earned_at
CREATE OR REPLACE FUNCTION public.handle_achievement_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark as completed when progress reaches goal
  IF NEW.achievement_progress_current >= NEW.achievement_progress_goal AND NOT OLD.is_completed THEN
    NEW.is_completed = TRUE;
    NEW.earned_at = now();
    
    -- Award XP and Gold rewards
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
  END IF;
  
  -- Unmark completion if progress goes below goal
  IF NEW.achievement_progress_current < NEW.achievement_progress_goal AND OLD.is_completed THEN
    NEW.is_completed = FALSE;
    NEW.earned_at = NULL;
    
    -- Subtract XP and Gold rewards
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for achievement completion
CREATE TRIGGER achievement_completion_trigger
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.handle_achievement_completion();

-- Create index for efficient queries
CREATE INDEX idx_achievements_user_completion ON public.achievements(user_id, is_completed);
CREATE INDEX idx_achievements_tier ON public.achievements(quest_value);