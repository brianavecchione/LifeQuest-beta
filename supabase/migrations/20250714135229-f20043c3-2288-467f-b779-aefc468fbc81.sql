-- Ensure XP tracking trigger works for ALL quest status changes, not just specific ones
CREATE OR REPLACE FUNCTION public.handle_quest_stat_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only update stats when quest status changes to 'Completed'
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    -- Update user stats (profile XP/Gold balance)
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    -- Track daily XP in history table for charts
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
    
    -- Log the XP update for debugging
    RAISE NOTICE 'Quest completed: % earned % XP and % gold for user %', 
      NEW.quest_name, NEW.xp_reward, NEW.gold_reward, NEW.user_id;
  END IF;
  
  -- If quest status changes from 'Completed' to something else, subtract the rewards
  IF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    -- Subtract user stats
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    -- Subtract from daily XP history
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
    
    -- Log the XP subtraction for debugging
    RAISE NOTICE 'Quest uncompleted: % lost % XP and % gold for user %', 
      OLD.quest_name, OLD.xp_reward, OLD.gold_reward, OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Make sure the trigger is active
DROP TRIGGER IF EXISTS trigger_quest_stat_update ON public.quests;
CREATE TRIGGER trigger_quest_stat_update
  AFTER UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_stat_update();