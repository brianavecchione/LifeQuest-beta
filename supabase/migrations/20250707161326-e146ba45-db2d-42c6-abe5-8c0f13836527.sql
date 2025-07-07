-- Create table for daily XP tracking
CREATE TABLE public.daily_xp_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_xp_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own daily XP history" 
ON public.daily_xp_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily XP history" 
ON public.daily_xp_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily XP history" 
ON public.daily_xp_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update daily XP history
CREATE OR REPLACE FUNCTION public.update_daily_xp_history(p_user_id UUID, xp_gained INTEGER)
RETURNS VOID AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
BEGIN
  -- Insert or update daily XP for today
  INSERT INTO public.daily_xp_history (user_id, date, xp_earned)
  VALUES (p_user_id, today_date, xp_gained)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    xp_earned = daily_xp_history.xp_earned + EXCLUDED.xp_earned,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Update the existing quest completion trigger function to also track daily XP
CREATE OR REPLACE FUNCTION public.handle_quest_stat_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stats when quest status changes to 'Completed'
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
  END IF;
  
  -- If quest status changes from 'Completed' to something else, subtract the rewards
  IF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create index for efficient queries
CREATE INDEX idx_daily_xp_history_user_date ON public.daily_xp_history(user_id, date DESC);