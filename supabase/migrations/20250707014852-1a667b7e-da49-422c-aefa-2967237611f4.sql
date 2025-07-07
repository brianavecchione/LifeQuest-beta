-- Clean up non-dummy account data while preserving dummy account
DO $$
DECLARE
    dummy_user_id UUID := 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
BEGIN
    -- Clean up all non-dummy user data
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
    
    RAISE NOTICE 'Non-dummy user data cleaned up successfully';
END $$;

-- Create function to seed locked achievements for new users
CREATE OR REPLACE FUNCTION public.seed_locked_achievements(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Seed basic locked achievements for new users
    INSERT INTO public.achievements (user_id, achievement_name, description, achievement_progress_current, achievement_progress_goal, is_completed, xp_reward, gold_reward, quest_value) VALUES
    (p_user_id, 'Quest Initiate', 'Complete your first quest', 0, 1, false, 100, 50, 'Bronze'),
    (p_user_id, 'Focus Master', 'Complete 5 daily habit quests', 0, 5, false, 200, 100, 'Silver'),
    (p_user_id, 'Quest Collector', 'Complete 10 quests of any type', 0, 10, false, 150, 75, 'Bronze'),
    (p_user_id, 'Legendary Hero', 'Complete your first Legendary quest', 0, 1, false, 500, 250, 'Legendary'),
    (p_user_id, 'Streak Champion', 'Maintain a 30-day daily habit streak', 0, 30, false, 300, 150, 'Gold'),
    (p_user_id, 'Social Butterfly', 'Complete 5 social-related quests', 0, 5, false, 150, 80, 'Silver');
END $$;

-- Create function to seed locked rewards for new users
CREATE OR REPLACE FUNCTION public.seed_locked_rewards(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Seed basic locked personal rewards
    INSERT INTO public.rewards (user_id, name, description, reward_type, gold_cost, status) VALUES
    (p_user_id, 'Afternoon Off', 'Take a well-deserved break from work', 'Personal', 800, 'Locked'),
    (p_user_id, 'Favorite Restaurant Dinner', 'Enjoy a meal at your favorite restaurant', 'Personal', 1200, 'Locked'),
    (p_user_id, 'New Book Purchase', 'Buy that book you''ve been wanting to read', 'Personal', 300, 'Locked'),
    (p_user_id, 'Movie Night Out', 'See the latest blockbuster in theaters', 'Personal', 500, 'Locked'),
    (p_user_id, 'Spa Day Experience', 'Full day of relaxation and pampering', 'Personal', 2500, 'Locked'),
    
    -- Seed basic locked company rewards
    (p_user_id, 'Flexible Work Schedule', 'Choose your optimal working hours', 'Company', 1500, 'Locked'),
    (p_user_id, 'Professional Development Course', 'Invest in your skill growth', 'Company', 2000, 'Locked'),
    (p_user_id, 'Team Lunch Sponsorship', 'Treat your team to a group meal', 'Company', 1000, 'Locked'),
    (p_user_id, 'Remote Work Equipment', 'Upgrade your home office setup', 'Company', 1800, 'Locked'),
    (p_user_id, 'Conference Attendance', 'Attend an industry conference', 'Company', 3000, 'Locked');
END $$;

-- Create function to seed basic streaks for new users
CREATE OR REPLACE FUNCTION public.seed_basic_streaks(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Seed basic inactive streaks
    INSERT INTO public.streaks (user_id, streak_name, description, current_streak, best_streak, status) VALUES
    (p_user_id, 'Daily Habit Streak', 'Consecutive days completing at least one daily habit', 0, 0, 'Inactive'),
    (p_user_id, 'Reading Streak', 'Consecutive days of reading', 0, 0, 'Inactive'),
    (p_user_id, 'Exercise Streak', 'Consecutive days of physical activity', 0, 0, 'Inactive');
END $$;

-- Update the new user profile creation function to include seeding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'));
  
  -- Seed locked achievements, rewards, and streaks for new users
  PERFORM public.seed_locked_achievements(NEW.id);
  PERFORM public.seed_locked_rewards(NEW.id);
  PERFORM public.seed_basic_streaks(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the user settings creation function to include balance creation
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