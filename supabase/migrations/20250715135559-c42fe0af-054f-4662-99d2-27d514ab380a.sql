-- Remove the duplicate trigger that's causing XP duplication
-- We have two triggers doing the same thing:
-- 1. quest_stat_update_trigger (AFTER UPDATE) - OLD trigger
-- 2. trigger_quest_completion_final (BEFORE UPDATE) - NEW trigger
-- 
-- Both are awarding XP, causing duplication. Remove the old one.

DROP TRIGGER IF EXISTS quest_stat_update_trigger ON public.quests;
DROP TRIGGER IF EXISTS trigger_quest_stat_update ON public.quests;

-- Verify remaining triggers
SELECT 
    t.tgname as trigger_name,
    t.tgenabled as enabled,
    c.relname as table_name,
    p.proname as function_name,
    CASE 
        WHEN t.tgtype & 2 = 2 THEN 'BEFORE'
        WHEN t.tgtype & 4 = 4 THEN 'AFTER'
        ELSE 'UNKNOWN'
    END as timing
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relname = 'quests'
  AND NOT t.tgisinternal
ORDER BY t.tgname;