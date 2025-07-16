-- Create a function to seed user data that can be called separately
CREATE OR REPLACE FUNCTION public.seed_new_user_data(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user already has achievements (avoid duplicate seeding)
  IF EXISTS (SELECT 1 FROM public.achievements WHERE achievements.user_id = seed_new_user_data.user_id LIMIT 1) THEN
    RAISE NOTICE 'User % already has seeded data, skipping', user_id;
    RETURN;
  END IF;
  
  -- Seed achievements
  BEGIN
    PERFORM public.seed_comprehensive_badges(user_id);
    RAISE NOTICE 'Seeded badges for user %', user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error seeding badges for user %: %', user_id, SQLERRM;
  END;
  
  -- Seed rewards
  BEGIN
    PERFORM public.seed_locked_rewards(user_id);
    RAISE NOTICE 'Seeded rewards for user %', user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error seeding rewards for user %: %', user_id, SQLERRM;
  END;
  
  -- Seed streaks
  BEGIN
    PERFORM public.seed_basic_streaks(user_id);
    RAISE NOTICE 'Seeded streaks for user %', user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error seeding streaks for user %: %', user_id, SQLERRM;
  END;
  
  RAISE NOTICE 'User data seeding completed for user %', user_id;
END;
$$;