-- Reset personal account XP/Gold balances after duplicate award fix
-- Target user: briana.vecchione@gmail.com

UPDATE public.profiles 
SET 
  xp_balance = 0,
  gold_balance = 0,
  user_level = 1,
  level_progress = 0.00
WHERE user_id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'briana.vecchione@gmail.com'
);