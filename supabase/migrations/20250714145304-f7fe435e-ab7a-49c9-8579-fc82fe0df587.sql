-- Create a single, clean quest completion and reward system
-- This will be the ONLY trigger that handles quest rewards

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
    
    -- Award XP and Gold rewards (this is the ONLY place rewards are awarded)
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    
    -- Track daily XP for progress charts
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
    
    -- Log for debugging
    RAISE NOTICE 'QUEST COMPLETED: % awarded % XP and % Gold to user %', 
      NEW.quest_name, NEW.xp_reward, NEW.gold_reward, NEW.user_id;
    
  -- Handle quest un-completion (status changes from 'Completed' to something else)
  ELSIF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    -- Clear completion timestamp
    NEW.completed_at = NULL;
    
    -- Subtract rewards (use the OLD values to be safe)
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
    
    -- Log for debugging
    RAISE NOTICE 'QUEST UNCOMPLETED: % subtracted % XP and % Gold from user %', 
      OLD.quest_name, OLD.xp_reward, OLD.gold_reward, OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the single trigger (BEFORE UPDATE so we can modify NEW.completed_at)
CREATE TRIGGER trigger_quest_completion_final
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_completion_final();

-- Reset today's negative XP to 0 to fix the current issue
UPDATE public.daily_xp_history 
SET xp_earned = 0, updated_at = now()
WHERE date = CURRENT_DATE 
  AND xp_earned < 0;