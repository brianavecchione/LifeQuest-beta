-- Enable real-time updates for user profile tables
-- This migration configures the database tables to send real-time updates
-- when data changes, allowing the frontend to update instantly without polling

-- Enable replica identity FULL for profiles table to capture complete row data
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Enable replica identity FULL for user_balances table
ALTER TABLE public.user_balances REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication to activate real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_balances;

-- Verify the configuration
SELECT 
    schemaname, 
    tablename, 
    attrelid::regclass as table_name,
    CASE attidentity 
        WHEN 'n' THEN 'NOTHING'
        WHEN 'd' THEN 'DEFAULT' 
        WHEN 'f' THEN 'FULL'
        WHEN 'i' THEN 'INDEX'
    END as replica_identity
FROM pg_attribute 
JOIN pg_class ON pg_attribute.attrelid = pg_class.oid
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE pg_namespace.nspname = 'public' 
  AND pg_class.relname IN ('profiles', 'user_balances')
  AND pg_attribute.attnum = 0;