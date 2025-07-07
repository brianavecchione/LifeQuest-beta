-- Complete cleanup of non-dummy account data and restrict seeding to dummy email only
DO $$
DECLARE
    dummy_user_id UUID := 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
BEGIN
    -- Clean up ALL non-dummy user data completely
    DELETE FROM public.quests WHERE user_id != dummy_user_id;
    DELETE FROM public.achievements WHERE user_id != dummy_user_id;
    DELETE FROM public.streaks WHERE user_id != dummy_user_id;
    DELETE FROM public.inventory_items WHERE user_id != dummy_user_id;
    DELETE FROM public.rewards WHERE user_id != dummy_user_id;
    DELETE FROM public.user_balances WHERE user_id != dummy_user_id;
    DELETE FROM public.user_settings WHERE user_id != dummy_user_id;
    DELETE FROM public.soundtracks WHERE user_id != dummy_user_id;
    
    -- Clean up party data (except dummy user's parties)
    DELETE FROM public.party_chat WHERE party_id NOT IN (
        SELECT party_id FROM public.parties WHERE party_leader_id = dummy_user_id
    );
    DELETE FROM public.party_leaderboard WHERE party_id NOT IN (
        SELECT party_id FROM public.parties WHERE party_leader_id = dummy_user_id
    );
    DELETE FROM public.party_members WHERE party_id NOT IN (
        SELECT party_id FROM public.parties WHERE party_leader_id = dummy_user_id
    );
    DELETE FROM public.party_quests WHERE party_id NOT IN (
        SELECT party_id FROM public.parties WHERE party_leader_id = dummy_user_id
    );
    DELETE FROM public.parties WHERE party_leader_id != dummy_user_id;
    
    RAISE NOTICE 'Non-dummy user data cleaned up completely';
END $$;

-- Update the new user creation function to NOT seed any data by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create basic profile, no seeding of achievements/rewards/streaks
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user settings creation to also NOT seed data
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user settings
  INSERT INTO public.user_settings (user_id, character_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
  
  -- Create user balance
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a specific function to seed ONLY the dummy account data
CREATE OR REPLACE FUNCTION public.seed_dummy_account_only()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    dummy_user_id UUID := 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
BEGIN
    -- Check if we need to seed the dummy account
    IF NOT EXISTS (SELECT 1 FROM public.achievements WHERE user_id = dummy_user_id LIMIT 1) THEN
        -- Seed achievements for dummy account only
        PERFORM public.seed_locked_achievements(dummy_user_id);
        PERFORM public.seed_locked_rewards(dummy_user_id);
        PERFORM public.seed_basic_streaks(dummy_user_id);
        
        RAISE NOTICE 'Dummy account seeded successfully';
    ELSE
        RAISE NOTICE 'Dummy account already has data, skipping seed';
    END IF;
END $$;

-- Run the dummy account seeding to ensure it has proper data
SELECT public.seed_dummy_account_only();