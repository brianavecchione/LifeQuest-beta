-- Fix XP/Gold reward duplication by consolidating triggers
-- First, check what triggers currently exist on the quests table
SELECT 
    tgname as trigger_name,
    tgtype,
    proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'quests'::regclass
  AND NOT tgisinternal;

-- List all triggers that might be affecting quest rewards
SELECT 
    schemaname,
    tablename,
    triggername,
    definition 
FROM pg_views 
WHERE viewname = 'pg_triggers' 
LIMIT 0; -- Just to see the structure

-- Check actual active triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing,
    event_object_table
FROM information_schema.triggers 
WHERE event_object_table = 'quests'
  AND trigger_schema = 'public';