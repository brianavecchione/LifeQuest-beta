-- Comprehensive fix for XP/Gold reward duplication
-- Drop any existing conflicting triggers to start fresh
DROP TRIGGER IF EXISTS trigger_quest_completion ON public.quests;
DROP TRIGGER IF EXISTS trigger_quest_stat_update ON public.quests;
DROP TRIGGER IF EXISTS trigger_update_badge_progress ON public.quests;
DROP TRIGGER IF EXISTS update_badge_progress_trigger ON public.quests;
DROP TRIGGER IF EXISTS handle_quest_completion_trigger ON public.quests;

-- Create a single, comprehensive quest completion trigger function
CREATE OR REPLACE FUNCTION public.handle_quest_completion_and_rewards()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Set completed_at timestamp when quest is marked as completed
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    NEW.completed_at = now();
    
    -- Log the quest completion
    RAISE NOTICE 'Quest completed: % (Type: %, XP: %, Gold: %) for user %', 
      NEW.quest_name, NEW.quest_type, NEW.xp_reward, NEW.gold_reward, NEW.user_id;
    
    -- Award XP and Gold rewards ONCE
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    
    -- Track daily XP for progress charts ONCE  
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
    
    RAISE NOTICE 'Rewards awarded: +% XP, +% Gold for user %', 
      NEW.xp_reward, NEW.gold_reward, NEW.user_id;
    
  -- Handle quest un-completion (status changes from Completed to something else)
  ELSIF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    NEW.completed_at = NULL;
    
    -- Subtract rewards when quest is uncompleted
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
    
    RAISE NOTICE 'Quest uncompleted: % lost % XP and % Gold for user %', 
      OLD.quest_name, OLD.xp_reward, OLD.gold_reward, OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the single quest completion trigger
CREATE TRIGGER trigger_quest_completion_and_rewards
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_quest_completion_and_rewards();

-- Create a separate trigger for badge progress (runs after the main trigger)
CREATE OR REPLACE FUNCTION public.update_badge_progress_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only update badge progress when quest is completed (no XP awarding here)
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    -- Update badge progress without awarding any additional XP/Gold
    PERFORM public.recalculate_badge_progress(NEW.user_id);
    
    RAISE NOTICE 'Badge progress updated for user % after completing quest %', 
      NEW.user_id, NEW.quest_name;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create badge progress trigger (runs AFTER the rewards trigger)
CREATE TRIGGER trigger_badge_progress_update
  AFTER UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_badge_progress_only();