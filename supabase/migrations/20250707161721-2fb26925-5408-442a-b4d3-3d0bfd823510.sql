-- Enable real-time replication for daily_xp_history table
ALTER TABLE public.daily_xp_history REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_xp_history;