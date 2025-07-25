-- Add recurrence fields to quests table
ALTER TABLE public.quests 
ADD COLUMN recurrence_type text CHECK (recurrence_type IN ('none', 'daily', 'weekly', 'monthly')) DEFAULT 'none',
ADD COLUMN recurrence_config jsonb DEFAULT NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.quests.recurrence_type IS 'Type of recurrence: none, daily, weekly, monthly';
COMMENT ON COLUMN public.quests.recurrence_config IS 'JSON config for recurrence: {days_of_week: [1,2,3], day_of_month: 15}';

-- Update existing quests to set recurrence_type based on is_recurring
UPDATE public.quests 
SET recurrence_type = CASE 
  WHEN is_recurring = true AND quest_type = 'Daily' THEN 'daily'
  ELSE 'none'
END;