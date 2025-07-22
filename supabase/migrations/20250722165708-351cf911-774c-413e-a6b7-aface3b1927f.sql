-- Add difficulty column to quests table
CREATE TYPE public.quest_difficulty AS ENUM ('Easy', 'Moderate', 'Hard');

ALTER TABLE public.quests 
ADD COLUMN difficulty public.quest_difficulty NOT NULL DEFAULT 'Moderate';

-- Create index for efficient querying by difficulty
CREATE INDEX idx_quests_user_difficulty ON public.quests(user_id, difficulty);