-- Remove duplicate trigger that's causing double XP/Gold rewards
DROP TRIGGER IF EXISTS on_quest_status_update ON public.quests;