-- Create trigger to initialize user_balances for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_balances()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new profiles (which are created when users sign up)
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_balances();

-- Update user_balances for existing demo user
INSERT INTO public.user_balances (user_id, current_gold_balance, total_gold_earned, total_gold_spent, inventory_slots_used, inventory_capacity)
VALUES ('c5070bec-0cb8-4895-8626-8c6ca48e9113', 1250, 2500, 1250, 8, 50)
ON CONFLICT (user_id) DO UPDATE SET
  current_gold_balance = 1250,
  total_gold_earned = 2500,
  total_gold_spent = 1250,
  inventory_slots_used = 8,
  inventory_capacity = 50;

-- Insert demo inventory items for dummy user
INSERT INTO public.inventory_items (user_id, name, description, category, rarity, effect_description, duration_days, equipped, date_acquired, date_expiration) VALUES 
-- Gear items
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Focus Enhancer Ring', 'A mystical ring that sharpens mental clarity', 'Gear', 'Rare', '+25% XP from focus-related quests', 30, true, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '25 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Productivity Cloak', 'A shimmering cloak worn by legendary achievers', 'Gear', 'Epic', '+15% bonus gold from completed quests', NULL, true, CURRENT_TIMESTAMP - INTERVAL '12 days', NULL),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Time Turner Amulet', 'An ancient amulet that bends time to your will', 'Gear', 'Legendary', 'Extends quest deadlines by 1 day', NULL, false, CURRENT_TIMESTAMP - INTERVAL '20 days', NULL),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Scholar''s Spectacles', 'Glasses that enhance learning and comprehension', 'Gear', 'Common', '+10% XP from learning quests', 14, false, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '11 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Warrior''s Gauntlets', 'Heavy gloves that boost physical prowess', 'Gear', 'Rare', '+20% XP from fitness quests', NULL, false, CURRENT_TIMESTAMP - INTERVAL '8 days', NULL),

-- Companion items
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Motivational Phoenix', 'A fiery companion that reignites your passion', 'Companion', 'Epic', 'Prevents quest failure for 3 days after activation', 7, false, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '2 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Wise Owl Advisor', 'A sagely owl that provides strategic guidance', 'Companion', 'Rare', 'Reveals optimal quest priority suggestions', NULL, true, CURRENT_TIMESTAMP - INTERVAL '10 days', NULL),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Energetic Squirrel', 'A hyperactive companion that keeps you moving', 'Companion', 'Common', '+5% faster quest completion', 21, false, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '19 days');

-- Insert global gold shop items (available to all users)
INSERT INTO public.gold_shop_items (name, description, category, gold_cost, effect_description, duration_days, is_limited_edition, availability_status) VALUES 
-- Personal rewards
('Coffee Shop Gift Card', 'Treat yourself to your favorite coffee blend', 'Personal', 500, 'Redeem for $25 coffee shop gift card', NULL, false, 'Available'),
('Premium Streaming Subscription', 'Upgrade your entertainment experience', 'Personal', 800, '3 months of premium streaming service', 90, false, 'Available'),
('Fitness Tracker', 'Monitor your health and activity goals', 'Personal', 1200, 'Bluetooth-enabled fitness tracking device', NULL, false, 'Available'),
('Massage Therapy Session', 'Relax and unwind with professional massage', 'Personal', 1500, '60-minute therapeutic massage session', NULL, false, 'Available'),
('Weekend Getaway Voucher', 'Escape to your dream destination', 'Personal', 3000, '$500 travel voucher for weekend trips', NULL, true, 'Available'),

-- LifeQuest rewards
('Extra Quest Slot', 'Expand your quest capacity', 'LifeQuest', 300, 'Unlock one additional active quest slot', NULL, false, 'Available'),
('XP Multiplier Boost', 'Accelerate your progression', 'LifeQuest', 600, '2x XP for 7 days', 7, false, 'Available'),
('Gold Rush Charm', 'Increase your gold earnings', 'LifeQuest', 750, '+50% gold from quests for 5 days', 5, false, 'Available'),
('Streak Protector Shield', 'Safeguard your progress', 'LifeQuest', 400, 'Prevents streak loss for 3 days', 3, false, 'Available'),
('Legendary Quest Unlock', 'Access elite challenges', 'LifeQuest', 2000, 'Unlocks exclusive legendary quest category', NULL, true, 'Available'),
('Custom Avatar Frame', 'Personalize your profile', 'LifeQuest', 250, 'Animated border for profile avatar', NULL, false, 'SoldOut'),
('Priority Support Badge', 'Get VIP assistance', 'LifeQuest', 1000, '30 days of priority customer support', 30, false, 'Available');

-- Insert personal and company rewards for dummy user
INSERT INTO public.rewards (user_id, name, description, reward_type, gold_cost, status, date_unlocked) VALUES 
-- Personal rewards
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Afternoon Off', 'Take a well-deserved break from work', 'Personal', 800, 'Unlocked', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Favorite Restaurant Dinner', 'Enjoy a meal at your favorite restaurant', 'Personal', 1200, 'Redeemed', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'New Book Purchase', 'Buy that book you''ve been wanting to read', 'Personal', 300, 'Unlocked', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Movie Night Out', 'See the latest blockbuster in theaters', 'Personal', 500, 'Locked', NULL),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Spa Day Experience', 'Full day of relaxation and pampering', 'Personal', 2500, 'Locked', NULL),

-- Company rewards
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Flexible Work Schedule', 'Choose your optimal working hours', 'Company', 1500, 'Unlocked', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Professional Development Course', 'Invest in your skill growth', 'Company', 2000, 'Locked', NULL),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Team Lunch Sponsorship', 'Treat your team to a group meal', 'Company', 1000, 'Redeemed', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Remote Work Equipment', 'Upgrade your home office setup', 'Company', 1800, 'Locked', NULL),
('c5070bec-0cb8-4895-8626-8c6ca48e9113', 'Conference Attendance', 'Attend an industry conference', 'Company', 3000, 'Locked', NULL);

-- Create function to reset dummy data (admin tool)
CREATE OR REPLACE FUNCTION public.reset_dummy_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  dummy_user_id UUID := 'c5070bec-0cb8-4895-8626-8c6ca48e9113';
BEGIN
  -- Delete existing data
  DELETE FROM public.inventory_items WHERE user_id = dummy_user_id;
  DELETE FROM public.rewards WHERE user_id = dummy_user_id;
  DELETE FROM public.user_balances WHERE user_id = dummy_user_id;
  
  -- This function can be extended to re-insert fresh dummy data
  -- For now, it just clears existing data
  
  RAISE NOTICE 'Dummy user data has been reset. Run the data population script to repopulate.';
END;
$$;