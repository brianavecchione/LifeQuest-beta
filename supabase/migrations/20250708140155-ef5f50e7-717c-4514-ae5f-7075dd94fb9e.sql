-- Create archived quests table for completed quest history
CREATE TABLE public.archived_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_quest_id UUID NOT NULL,
  quest_name TEXT NOT NULL,
  description TEXT,
  quest_type public.quest_type NOT NULL,
  priority public.quest_priority NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  gold_reward INTEGER NOT NULL DEFAULT 0,
  tags TEXT[],
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  was_in_focus BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_archived_quests_user_id ON public.archived_quests(user_id);
CREATE INDEX idx_archived_quests_completed_date ON public.archived_quests(user_id, completed_date DESC);
CREATE INDEX idx_archived_quests_quest_type ON public.archived_quests(user_id, quest_type);
CREATE INDEX idx_archived_quests_archived_at ON public.archived_quests(archived_at DESC);

-- Enable RLS
ALTER TABLE public.archived_quests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own archived quests" 
ON public.archived_quests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert archived quests" 
ON public.archived_quests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Users cannot update or delete archived quests to maintain data integrity
CREATE POLICY "Users cannot modify archived quests" 
ON public.archived_quests 
FOR UPDATE 
USING (false);

CREATE POLICY "Users cannot delete archived quests" 
ON public.archived_quests 
FOR DELETE 
USING (false);

-- Add trigger for timestamp updates
CREATE TRIGGER update_archived_quests_updated_at
BEFORE UPDATE ON public.archived_quests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();