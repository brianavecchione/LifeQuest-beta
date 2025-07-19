-- Ensure all users have user_balances records
INSERT INTO public.user_balances (user_id, current_gold_balance, total_gold_earned, total_gold_spent)
SELECT 
  p.user_id,
  p.gold_balance as current_gold_balance,
  p.gold_balance as total_gold_earned,
  0 as total_gold_spent
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_balances ub 
  WHERE ub.user_id = p.user_id
);

-- Update the handle_new_user function to create user_balances record
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  -- Log the trigger execution
  RAISE NOTICE 'handle_new_user triggered for user ID: %', NEW.id;
  RAISE NOTICE 'Raw user metadata: %', NEW.raw_user_meta_data;
  
  BEGIN
    -- Create profile for new user
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'))
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  
  BEGIN
    -- Create user settings
    INSERT INTO public.user_settings (user_id, character_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'))
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'User settings created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating user settings for user %: %', NEW.id, SQLERRM;
  END;
  
  BEGIN
    -- Create user balance (NEW)
    INSERT INTO public.user_balances (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'User balance created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating user balance for user %: %', NEW.id, SQLERRM;
  END;
  
  RAISE NOTICE 'handle_new_user completed successfully for user: %', NEW.id;
  
  -- CRITICAL: Always return NEW for INSERT triggers
  RETURN NEW;
END;
$function$;