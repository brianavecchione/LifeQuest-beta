-- Create a robust trigger that handles all edge cases
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $$
BEGIN
  -- Log the trigger execution
  RAISE NOTICE 'handle_new_user triggered for user ID: %', NEW.id;
  
  -- Create profile for new user
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'))
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user settings
  INSERT INTO public.user_settings (user_id, character_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'))
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user balance
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Seed user data in a separate transaction to prevent blocking
  -- This will be done via a deferred function call
  PERFORM pg_notify('new_user_seed', NEW.id::text);
  
  RAISE NOTICE 'handle_new_user completed successfully for user: %', NEW.id;
  
  RETURN NEW;
END;
$$;