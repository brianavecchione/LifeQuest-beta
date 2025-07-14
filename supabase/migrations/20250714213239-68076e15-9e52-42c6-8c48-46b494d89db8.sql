-- Check what triggers are currently active on the quests table
SELECT 
    t.tgname as trigger_name,
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