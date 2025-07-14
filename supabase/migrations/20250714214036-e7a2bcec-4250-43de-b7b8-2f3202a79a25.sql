-- Check all functions that might be updating user stats
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE proname LIKE '%update_user_stats%' 
   OR proname LIKE '%update_daily_xp%'
   OR proname LIKE '%handle_quest%'
ORDER BY proname;