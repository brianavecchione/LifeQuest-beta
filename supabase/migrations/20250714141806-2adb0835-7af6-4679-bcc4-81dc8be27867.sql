-- Add pomodoro_enabled field to quests table
ALTER TABLE public.quests 
ADD COLUMN pomodoro_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment to document the field
COMMENT ON COLUMN public.quests.pomodoro_enabled IS 'Whether Pomodoro timer is enabled for this quest';