-- Fix XP/Gold reward duplication by identifying and consolidating triggers
-- Check what triggers currently exist on the quests table
SELECT 
    tgname as trigger_name,
    proname as function_name,
    CASE 
        WHEN tgtype & 1 = 1 THEN 'BEFORE'
        WHEN tgtype & 2 = 2 THEN 'AFTER'
        ELSE 'INSTEAD OF'
    END as timing,
    CASE 
        WHEN tgtype & 4 = 4 THEN 'INSERT'
        WHEN tgtype & 8 = 8 THEN 'DELETE'  
        WHEN tgtype & 16 = 16 THEN 'UPDATE'
        ELSE 'OTHER'
    END as event_type
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'quests'::regclass
  AND NOT tgisinternal
ORDER BY tgname;