-- Update all existing Daily quests to have standardized rewards
UPDATE public.quests 
SET 
  xp_reward = 5,
  gold_reward = 0,
  updated_at = now()
WHERE quest_type = 'Daily';

-- Create a trigger function to enforce Daily quest rewards
CREATE OR REPLACE FUNCTION public.enforce_daily_quest_rewards()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If quest_type is Daily, force the rewards to be 5 XP and 0 Gold
  IF NEW.quest_type = 'Daily' THEN
    NEW.xp_reward = 5;
    NEW.gold_reward = 0;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set rewards for Daily quests
DROP TRIGGER IF EXISTS enforce_daily_rewards_trigger ON public.quests;
CREATE TRIGGER enforce_daily_rewards_trigger
  BEFORE INSERT OR UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_daily_quest_rewards();