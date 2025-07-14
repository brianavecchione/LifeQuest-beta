-- Check if the trigger function has any duplication or if it's being called multiple times
-- Let's see the actual function body
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'handle_quest_completion_final';