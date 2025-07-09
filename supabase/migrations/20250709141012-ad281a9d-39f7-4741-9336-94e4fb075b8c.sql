-- Remove duplicate daily habits, keeping only the oldest one for each habit name
DELETE FROM quests 
WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627'
  AND quest_type = 'Daily'
  AND id NOT IN (
    SELECT DISTINCT ON (quest_name) id
    FROM quests
    WHERE user_id = 'e85290c2-1a57-4ff8-bb87-642307a5e627'
      AND quest_type = 'Daily'
    ORDER BY quest_name, created_at ASC
  );