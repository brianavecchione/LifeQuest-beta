-- Remove the sync trigger that keeps profiles.gold_balance in sync with user_balances
DROP TRIGGER IF EXISTS sync_gold_balance_trigger ON user_balances;

-- Drop the sync function
DROP FUNCTION IF EXISTS public.sync_gold_balance_to_profiles();

-- Remove the gold_balance column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gold_balance;