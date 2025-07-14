-- Create or update the quest completion trigger to properly track daily XP
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
  END IF;
  
  -- If quest status changes from 'Completed' to something else, subtract the rewards
  IF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    -- Subtract user stats
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    -- Subtract from daily XP history
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on the quests table
DROP TRIGGER IF EXISTS trigger_quest_stat_update ON public.quests;
CREATE TRIGGER trigger_quest_stat_update
  AFTER UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_stat_update();