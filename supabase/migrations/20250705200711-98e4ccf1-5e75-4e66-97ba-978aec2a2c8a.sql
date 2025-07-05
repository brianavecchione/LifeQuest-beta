-- Create enums for quest types and priorities
CREATE TYPE public.quest_type AS ENUM ('Daily', 'Main', 'Side', 'Legendary');
CREATE TYPE public.quest_priority AS ENUM ('Low', 'Medium', 'High');

-- Create the quests table
CREATE TABLE public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_name TEXT NOT NULL,
  description TEXT,
  quest_type public.quest_type NOT NULL DEFAULT 'Main',
  priority public.quest_priority NOT NULL DEFAULT 'Medium',
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  gold_reward INTEGER NOT NULL DEFAULT 0 CHECK (gold_reward >= 0),
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'Not started' CHECK (status IN ('Not started', 'In Progress', 'Completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for efficient querying
CREATE INDEX idx_quests_user_id ON public.quests(user_id);
CREATE INDEX idx_quests_user_status ON public.quests(user_id, status);
CREATE INDEX idx_quests_user_type ON public.quests(user_id, quest_type);
CREATE INDEX idx_quests_user_priority ON public.quests(user_id, priority);
CREATE INDEX idx_quests_tags ON public.quests USING GIN(tags);
CREATE INDEX idx_quests_created_at ON public.quests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user access
CREATE POLICY "Users can view their own quests" 
ON public.quests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quests" 
ON public.quests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests" 
ON public.quests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quests" 
ON public.quests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quests_updated_at
BEFORE UPDATE ON public.quests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a trigger to automatically set completed_at when status changes to 'Completed'
CREATE OR REPLACE FUNCTION public.handle_quest_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Set completed_at when quest is marked as completed
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    NEW.completed_at = now();
  END IF;
  
  -- Clear completed_at if quest status changes from completed to something else
  IF NEW.status != 'Completed' AND OLD.status = 'Completed' THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quest_completion_trigger
BEFORE UPDATE ON public.quests
FOR EACH ROW
EXECUTE FUNCTION public.handle_quest_completion();