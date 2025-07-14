-- Let me add debugging to the trigger function to see what's happening
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
    
    -- Award XP and Gold rewards (this should be the ONLY place rewards are awarded)
    RAISE NOTICE 'DEBUG: About to award % XP and % Gold to user % for quest %', 
      NEW.xp_reward, NEW.gold_reward, NEW.user_id, NEW.quest_name;
    
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    
    RAISE NOTICE 'DEBUG: update_user_stats called for user %', NEW.user_id;
    
    -- Track daily XP for progress charts
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
    
    RAISE NOTICE 'DEBUG: update_daily_xp_history called for user %', NEW.user_id;
    
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