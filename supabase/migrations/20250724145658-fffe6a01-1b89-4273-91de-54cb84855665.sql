-- Enable real-time updates for user profile tables
-- This allows the frontend to receive instant updates when user data changes

-- Enable replica identity FULL for profiles table to capture complete row data
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Enable replica identity FULL for user_balances table  
ALTER TABLE public.user_balances REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication to activate real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_balances;