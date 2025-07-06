-- Add due_date column to quests table
ALTER TABLE public.quests 
ADD COLUMN due_date DATE;