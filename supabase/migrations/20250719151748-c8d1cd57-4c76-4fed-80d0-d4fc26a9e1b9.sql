-- Create trigger to sync gold balance from user_balances to profiles
CREATE OR REPLACE FUNCTION public.sync_gold_balance_to_profiles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update profiles table when user_balances changes
  UPDATE public.profiles 
  SET gold_balance = NEW.current_gold_balance
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger on user_balances table
DROP TRIGGER IF EXISTS sync_gold_balance_trigger ON public.user_balances;
CREATE TRIGGER sync_gold_balance_trigger
  AFTER UPDATE OF current_gold_balance ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_gold_balance_to_profiles();

-- Also trigger on INSERT to handle new records
DROP TRIGGER IF EXISTS sync_gold_balance_insert_trigger ON public.user_balances;
CREATE TRIGGER sync_gold_balance_insert_trigger
  AFTER INSERT ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_gold_balance_to_profiles();

-- Sync existing data to make sure they're aligned
UPDATE public.profiles 
SET gold_balance = ub.current_gold_balance
FROM public.user_balances ub
WHERE profiles.user_id = ub.user_id;