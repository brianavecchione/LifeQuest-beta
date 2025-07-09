-- Restore daily habits that were incorrectly archived today
-- First, get the daily habits that were archived today but should be active
INSERT INTO public.quests (
  user_id, 
  quest_name, 
  description, 
  quest_type, 
  priority, 
  xp_reward, 
  gold_reward, 
  tags, 
  status, 
  due_date,
  created_at,
  updated_at
)
SELECT 
  user_id,
  quest_name,
  description,
  quest_type,
  priority,
  xp_reward,
  gold_reward,
  tags,
  'Not started' as status,
  CURRENT_DATE as due_date,
  created_at,
  now() as updated_at
FROM archived_quests 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627'
  AND quest_type = 'Daily'
  AND completed_date = CURRENT_DATE::text
  AND quest_name NOT IN (
    SELECT quest_name 
    FROM quests 
    WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627' 
      AND quest_type = 'Daily'
  )
ON CONFLICT (user_id, quest_name, quest_type) DO NOTHING;

-- Remove the duplicate archived entries for today
DELETE FROM archived_quests 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627'
  AND quest_type = 'Daily'
  AND completed_date = CURRENT_DATE::text;