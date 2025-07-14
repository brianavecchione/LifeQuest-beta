-- Check if the function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_quest_completion_final';

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_quest_completion_final ON public.quests;
CREATE TRIGGER trigger_quest_completion_final
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_completion_final();

-- Verify the trigger was created
SELECT 
    t.tgname as trigger_name,
    t.tgenabled as enabled,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.quests'::regclass
  AND NOT tgisinternal;