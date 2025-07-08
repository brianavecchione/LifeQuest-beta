-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to reset daily quests every day at midnight UTC
SELECT cron.schedule(
  'daily-quest-reset',
  '0 0 * * *', -- Run at midnight UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://iiivtylfvnntjxzyximw.supabase.co/functions/v1/daily-quest-reset',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaXZ0eWxmdm5udGp4enl4aW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDM2MzYsImV4cCI6MjA2NzMxOTYzNn0.QFdvYfgbwq_n_qbxCIJspVG4KEU_EfA-flGOalsa2ek"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Create a cron job to archive completed quests daily at 11:59 PM UTC (before reset)
SELECT cron.schedule(
  'daily-quest-archive',
  '59 23 * * *', -- Run at 11:59 PM UTC every day (1 minute before reset)
  $$
  SELECT
    net.http_post(
        url:='https://iiivtylfvnntjxzyximw.supabase.co/functions/v1/daily-quest-archive',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaXZ0eWxmdm5udGp4enl4aW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDM2MzYsImV4cCI6MjA2NzMxOTYzNn0.QFdvYfgbwq_n_qbxCIJspVG4KEU_EfA-flGOalsa2ek"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Verify both cron jobs were created
SELECT * FROM cron.job WHERE jobname IN ('daily-quest-reset', 'daily-quest-archive');