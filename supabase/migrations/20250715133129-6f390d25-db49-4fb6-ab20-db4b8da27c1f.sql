-- Check for duplicate or problematic triggers on the quests table
SELECT 
    t.tgname as trigger_name,
    t.tgenabled as enabled,
    p.proname as function_name,
    CASE 
        WHEN t.tgtype & 2 = 2 THEN 'AFTER'
        WHEN t.tgtype & 1 = 1 THEN 'BEFORE'
        ELSE 'INSTEAD OF'
    END as timing,
    CASE 
        WHEN t.tgtype & 16 = 16 THEN 'UPDATE'
        WHEN t.tgtype & 4 = 4 THEN 'INSERT'
        WHEN t.tgtype & 8 = 8 THEN 'DELETE'
        ELSE 'OTHER'
    END as event_type
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.quests'::regclass
  AND NOT tgisinternal
ORDER BY t.tgname;

-- Check the actual trigger function to see if there are any issues
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_quest_completion_final';

-- Also check if there are multiple functions with similar names that might be causing conflicts
SELECT proname FROM pg_proc WHERE proname ILIKE '%quest%' AND proname ILIKE '%completion%';