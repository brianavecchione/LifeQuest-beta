-- Fix the trigger function that's missing a RETURN statement
-- The error shows "control reached end of trigger procedure without RETURN"
-- Let's check and fix the handle_new_user_settings function

CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  -- Create user settings
  INSERT INTO public.user_settings (user_id, character_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
  
  -- Create user balance
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id);
  
  RETURN NEW; -- This was missing!
END;
$function$;