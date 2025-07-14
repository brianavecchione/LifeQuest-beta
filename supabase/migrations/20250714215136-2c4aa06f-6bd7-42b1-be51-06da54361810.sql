-- Recreate the quest completion trigger properly
DROP TRIGGER IF EXISTS trigger_quest_completion_final ON public.quests;

CREATE OR REPLACE FUNCTION public.handle_quest_completion_final()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Handle quest completion (status changes to 'Completed')
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    -- Set completion timestamp
    NEW.completed_at = now();
    
    -- Award XP and Gold rewards (this is the ONLY place rewards should be awarded)
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    
    -- Track daily XP for progress charts
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
    
    RAISE NOTICE 'QUEST COMPLETED: % awarded % XP and % Gold to user %', 
      NEW.quest_name, NEW.xp_reward, NEW.gold_reward, NEW.user_id;
    
  -- Handle quest un-completion (status changes from 'Completed' to something else)
  ELSIF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    -- Clear completion timestamp
    NEW.completed_at = NULL;
    
    -- Subtract rewards
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
    
    RAISE NOTICE 'QUEST UNCOMPLETED: % subtracted % XP and % Gold from user %', 
      OLD.quest_name, OLD.xp_reward, OLD.gold_reward, OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trigger_quest_completion_final
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_completion_final();

-- Verify trigger exists
SELECT 
    t.tgname as trigger_name,
    t.tgenabled as enabled,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.quests'::regclass
  AND NOT tgisinternal;