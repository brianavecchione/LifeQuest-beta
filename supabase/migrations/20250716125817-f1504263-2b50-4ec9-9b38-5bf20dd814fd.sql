-- Add a field to distinguish recurring daily habits from one-time daily tasks
ALTER TABLE public.quests ADD COLUMN is_recurring BOOLEAN DEFAULT false;

-- Update the daily reset logic to only reset recurring daily habits
-- First, let's create a function to help identify recurring vs one-time tasks
CREATE OR REPLACE FUNCTION public.is_likely_recurring_habit(quest_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Common patterns for recurring habits
  RETURN (
    quest_name ILIKE '%daily%' OR
    quest_name ILIKE '%every day%' OR
    quest_name ILIKE '%habit%' OR
    quest_name ILIKE '%routine%' OR
    quest_name ILIKE '%meditate%' OR
    quest_name ILIKE '%exercise%' OR
    quest_name ILIKE '%workout%' OR
    quest_name ILIKE '%vitamin%' OR
    quest_name ILIKE '%supplement%' OR
    quest_name ILIKE '%water%' OR
    quest_name ILIKE '%sleep%' OR
    quest_name ILIKE '%journal%' OR
    quest_name ILIKE '%read%' OR
    quest_name ILIKE '%pray%' OR
    quest_name ILIKE '%stretch%' OR
    quest_name ILIKE '%walk%' OR
    quest_name ILIKE '%morning%' OR
    quest_name ILIKE '%evening%' OR
    quest_name ILIKE '%night%' OR
    quest_name ILIKE '%meal%' OR
    quest_name ILIKE '%breakfast%' OR
    quest_name ILIKE '%lunch%' OR
    quest_name ILIKE '%dinner%'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing daily quests to mark likely recurring habits
UPDATE public.quests 
SET is_recurring = public.is_likely_recurring_habit(quest_name)
WHERE quest_type = 'Daily';

-- Fix the completed tasks that were incorrectly reset
-- These should remain completed as they were one-time tasks
UPDATE public.quests 
SET 
  status = 'Completed',
  completed_at = '2025-07-15 20:00:00+00'  -- Approximate completion time from yesterday
WHERE quest_name IN (
  'Submit 4S expense report',
  'Call parents', 
  'List Gucci shoes on eBay',
  'Book 4S hotel'
) AND status = 'Not started' AND is_recurring = false;