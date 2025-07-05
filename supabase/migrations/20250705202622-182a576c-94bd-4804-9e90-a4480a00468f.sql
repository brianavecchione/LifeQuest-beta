-- Create enum for streak status
CREATE TYPE public.streak_status AS ENUM ('Active', 'Inactive');

-- Create streaks table
CREATE TABLE public.streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_name TEXT NOT NULL,
  description TEXT NOT NULL,
  status streak_status NOT NULL DEFAULT 'Inactive',
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  best_streak INTEGER NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure current streak doesn't exceed best streak
  CONSTRAINT valid_streak_comparison CHECK (current_streak <= best_streak OR best_streak = 0),
  -- Ensure unique streak names per user
  UNIQUE(user_id, streak_name)
);

-- Enable Row Level Security
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own streaks" 
ON public.streaks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks" 
ON public.streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streaks" 
ON public.streaks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_streaks_updated_at
BEFORE UPDATE ON public.streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle streak updates and best streak tracking
CREATE OR REPLACE FUNCTION public.handle_streak_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update best streak if current streak exceeds it
  IF NEW.current_streak > NEW.best_streak THEN
    NEW.best_streak = NEW.current_streak;
  END IF;
  
  -- Set status based on current streak and activity
  IF NEW.current_streak > 0 AND NEW.last_activity_date = CURRENT_DATE THEN
    NEW.status = 'Active';
  ELSE
    NEW.status = 'Inactive';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak updates
CREATE TRIGGER streak_update_trigger
BEFORE UPDATE ON public.streaks
FOR EACH ROW
EXECUTE FUNCTION public.handle_streak_update();

-- Create function to check and update streak status daily
CREATE OR REPLACE FUNCTION public.update_streak_status()
RETURNS VOID AS $$
BEGIN
  -- Mark streaks as inactive if last activity was not today
  UPDATE public.streaks 
  SET 
    status = 'Inactive',
    current_streak = CASE 
      WHEN last_activity_date < CURRENT_DATE - INTERVAL '1 day' THEN 0
      ELSE current_streak
    END
  WHERE last_activity_date IS NULL 
    OR last_activity_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for efficient queries
CREATE INDEX idx_streaks_user_status ON public.streaks(user_id, status);
CREATE INDEX idx_streaks_current_length ON public.streaks(current_streak DESC);
CREATE INDEX idx_streaks_best_length ON public.streaks(best_streak DESC);
CREATE INDEX idx_streaks_activity_date ON public.streaks(last_activity_date);

-- Create function to increment streak safely
CREATE OR REPLACE FUNCTION public.increment_streak(p_user_id UUID, p_streak_name TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.streaks 
  SET 
    current_streak = current_streak + 1,
    last_activity_date = CURRENT_DATE,
    status = 'Active'
  WHERE user_id = p_user_id 
    AND streak_name = p_streak_name;
    
  -- If no streak exists, this function won't create one
  -- Streaks should be created explicitly by the application
END;
$$ LANGUAGE plpgsql;