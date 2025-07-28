-- Enable real-time for quests table
ALTER TABLE public.quests REPLICA IDENTITY FULL;

-- Add the table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.quests;