-- Let me check if there's any conflict by testing a simple quest completion
-- First check current XP for the dummy user
SELECT 
    p.display_name,
    p.xp_balance,
    p.gold_balance,
    p.user_level
FROM public.profiles p
WHERE p.user_id = 'c5070bec-0cb8-4895-8626-8c6ca48e9113';