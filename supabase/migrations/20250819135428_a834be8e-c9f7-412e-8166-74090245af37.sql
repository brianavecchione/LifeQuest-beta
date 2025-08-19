-- Remove all triggers that sync gold balance between tables
DROP TRIGGER IF EXISTS sync_gold_balance_trigger ON user_balances;
DROP TRIGGER IF EXISTS sync_gold_balance_insert_trigger ON user_balances;
DROP TRIGGER IF EXISTS sync_gold_balance_update_trigger ON user_balances;

-- Drop the sync function
DROP FUNCTION IF EXISTS public.sync_gold_balance_to_profiles() CASCADE;

-- Remove the gold_balance column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gold_balance;