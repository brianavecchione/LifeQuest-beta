-- Fix the trigger function to always return NEW
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $$
BEGIN
  -- Log the trigger execution
  RAISE NOTICE 'handle_new_user triggered for user ID: %', NEW.id;
  RAISE NOTICE 'Raw user metadata: %', NEW.raw_user_meta_data;
  
  -- Create profile for new user
  BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
    
    RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'Profile already exists for user: %', NEW.id;
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating profile for user %: %', NEW.id, SQLERRM;
      -- Continue execution even if profile creation fails
  END;
  
  -- Create user settings
  BEGIN
    INSERT INTO public.user_settings (user_id, character_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
    
    RAISE NOTICE 'User settings created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'User settings already exist for user: %', NEW.id;
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating user settings for user %: %', NEW.id, SQLERRM;
      -- Continue execution even if settings creation fails
  END;
  
  -- Create user balance  
  BEGIN
    INSERT INTO public.user_balances (user_id)
    VALUES (NEW.id);
    
    RAISE NOTICE 'User balance created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'User balance already exists for user: %', NEW.id;
    WHEN OTHERS THEN
      RAISE NOTICE 'Error creating user balance for user %: %', NEW.id, SQLERRM;
      -- Continue execution even if balance creation fails
  END;
  
  -- Seed achievements and other data
  BEGIN
    PERFORM public.seed_comprehensive_badges(NEW.id);
    PERFORM public.seed_locked_rewards(NEW.id);
    PERFORM public.seed_basic_streaks(NEW.id);
    
    RAISE NOTICE 'User data seeded successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error seeding user data for user %: %', NEW.id, SQLERRM;
      -- Continue execution even if seeding fails
  END;
  
  RAISE NOTICE 'handle_new_user completed successfully for user: %', NEW.id;
  
  -- CRITICAL: Always return NEW for INSERT triggers
  RETURN NEW;
END;
$$;