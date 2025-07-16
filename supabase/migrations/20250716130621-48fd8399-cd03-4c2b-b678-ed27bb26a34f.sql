-- Fix the incorrectly reset tasks that should have remained completed
-- These were one-time tasks that got reset by the daily reset logic

UPDATE public.quests 
SET 
  status = 'Completed',
  completed_at = '2025-07-15 18:00:00+00',  -- Yesterday completion time
  updated_at = now()
WHERE 
  user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
  AND quest_name IN (
    'List Gucci shoes on Ebay',
    'Submit 4S hotel expense report'
  )
  AND status = 'Not started'
  AND is_recurring = false;