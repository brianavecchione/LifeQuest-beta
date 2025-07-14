-- Remove ALL existing triggers on quests table to fix the triple reward issue
DROP TRIGGER IF EXISTS on_quest_status_update ON public.quests;
DROP TRIGGER IF EXISTS trigger_quest_completion_final ON public.quests;
DROP TRIGGER IF EXISTS trigger_quest_completion_and_rewards ON public.quests;
DROP TRIGGER IF EXISTS trigger_update_badge_progress ON public.quests;
DROP TRIGGER IF EXISTS trigger_update_badge_progress_only ON public.quests;
DROP TRIGGER IF EXISTS trigger_handle_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS trigger_handle_quest_completion_and_rewards ON public.quests;
DROP TRIGGER IF EXISTS quest_completion_trigger ON public.quests;
DROP TRIGGER IF EXISTS quest_reward_trigger ON public.quests;
DROP TRIGGER IF EXISTS badge_progress_trigger ON public.quests;

-- Create the single, clean trigger for quest completion
CREATE TRIGGER trigger_quest_completion_final
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_completion_final();

-- Verify only one trigger exists
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