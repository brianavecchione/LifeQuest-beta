-- Create reset log table to track daily quest resets
CREATE TABLE public.daily_reset_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  reset_date DATE NOT NULL,
  reset_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quests_reset_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_daily_reset_logs_user_date ON public.daily_reset_logs(user_id, reset_date);
CREATE INDEX idx_daily_reset_logs_timestamp ON public.daily_reset_logs(reset_timestamp DESC);

-- Enable RLS
ALTER TABLE public.daily_reset_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own reset logs" 
ON public.daily_reset_logs 
FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "System can insert reset logs" 
ON public.daily_reset_logs 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for timestamp updates
CREATE TRIGGER update_daily_reset_logs_updated_at
BEFORE UPDATE ON public.daily_reset_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();