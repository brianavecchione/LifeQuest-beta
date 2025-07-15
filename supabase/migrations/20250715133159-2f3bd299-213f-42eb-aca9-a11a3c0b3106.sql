-- Check if the trigger exists and is enabled
SELECT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_proc p ON t.tgfoid = p.oid
    WHERE tgrelid = 'public.quests'::regclass
      AND t.tgname = 'trigger_quest_completion_final'
      AND NOT tgisinternal
) as trigger_exists;

-- Check the update_user_stats function to see if it's causing duplication
SELECT prosrc FROM pg_proc WHERE proname = 'update_user_stats';

-- Test the trigger by checking if it's properly configured
SELECT 
    tgname,
    tgenabled,
    tgtype,
    proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.quests'::regclass
  AND NOT tgisinternal;