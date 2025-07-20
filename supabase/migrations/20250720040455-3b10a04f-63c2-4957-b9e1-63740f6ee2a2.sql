-- Create daily_gold_history table to track gold earnings over time
CREATE TABLE IF NOT EXISTS public.daily_gold_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  gold_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_gold_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily gold history" 
ON public.daily_gold_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily gold history" 
ON public.daily_gold_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily gold history" 
ON public.daily_gold_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update daily gold history (similar to XP tracking)
CREATE OR REPLACE FUNCTION public.update_daily_gold_history(p_user_id uuid, gold_gained integer)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  today_date DATE := CURRENT_DATE;
  current_gold INTEGER := 0;
  new_gold INTEGER;
BEGIN
  RAISE NOTICE 'DEBUG: update_daily_gold_history called for user % with Gold: % on date %', p_user_id, gold_gained, today_date;
  
  -- Get current gold for today
  SELECT COALESCE(gold_earned, 0) INTO current_gold
  FROM public.daily_gold_history 
  WHERE user_id = p_user_id AND date = today_date;
  
  -- Calculate new gold, ensuring it doesn't go negative
  new_gold := GREATEST(0, current_gold + gold_gained);
  
  -- Insert or update daily gold for today with protection against negative values
  INSERT INTO public.daily_gold_history (user_id, date, gold_earned)
  VALUES (p_user_id, today_date, new_gold)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    gold_earned = new_gold,
    updated_at = now();
    
  RAISE NOTICE 'DEBUG: update_daily_gold_history completed for user % - Gold changed from % to %', p_user_id, current_gold, new_gold;
END;
$function$;

-- Update the quest completion trigger to also track gold history
CREATE OR REPLACE FUNCTION public.handle_quest_completion_final()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Handle quest completion (status changes to 'Completed')
  IF NEW.status = 'Completed' AND (OLD.status IS NULL OR OLD.status != 'Completed') THEN
    -- Set completion timestamp
    NEW.completed_at = now();
    
    -- Award XP and Gold rewards (this is the ONLY place rewards should be awarded)
    PERFORM public.update_user_stats(NEW.user_id, NEW.xp_reward, NEW.gold_reward);
    
    -- Track daily XP for progress charts
    PERFORM public.update_daily_xp_history(NEW.user_id, NEW.xp_reward);
    
    -- Track daily Gold for progress charts (NEW)
    PERFORM public.update_daily_gold_history(NEW.user_id, NEW.gold_reward);
    
    RAISE NOTICE 'QUEST COMPLETED: % awarded % XP and % Gold to user %', 
      NEW.quest_name, NEW.xp_reward, NEW.gold_reward, NEW.user_id;
    
  -- Handle quest un-completion (status changes from 'Completed' to something else)
  ELSIF OLD.status = 'Completed' AND NEW.status != 'Completed' THEN
    -- Clear completion timestamp
    NEW.completed_at = NULL;
    
    -- Subtract rewards
    PERFORM public.update_user_stats(NEW.user_id, -OLD.xp_reward, -OLD.gold_reward);
    PERFORM public.update_daily_xp_history(NEW.user_id, -OLD.xp_reward);
    
    -- Subtract from daily Gold history (NEW)
    PERFORM public.update_daily_gold_history(NEW.user_id, -OLD.gold_reward);
    
    RAISE NOTICE 'QUEST UNCOMPLETED: % subtracted % XP and % Gold from user %', 
      OLD.quest_name, OLD.xp_reward, OLD.gold_reward, OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;