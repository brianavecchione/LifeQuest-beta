-- Create a function to delete a user account and all associated data
CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- This function will delete all user data and then the user account
  -- The CASCADE relationships should handle most of the cleanup
  
  -- Log the deletion attempt
  RAISE NOTICE 'Deleting user account and all associated data for user: %', p_user_id;
  
  -- Delete from all tables that reference the user
  DELETE FROM public.achievements WHERE user_id = p_user_id;
  DELETE FROM public.archived_quests WHERE user_id = p_user_id;
  DELETE FROM public.badge_notifications WHERE user_id = p_user_id;
  DELETE FROM public.daily_reset_logs WHERE user_id = p_user_id;
  DELETE FROM public.daily_xp_history WHERE user_id = p_user_id;
  DELETE FROM public.inventory_items WHERE user_id = p_user_id;
  DELETE FROM public.quests WHERE user_id = p_user_id;
  DELETE FROM public.rewards WHERE user_id = p_user_id;
  DELETE FROM public.soundtracks WHERE user_id = p_user_id;
  DELETE FROM public.streaks WHERE user_id = p_user_id;
  DELETE FROM public.user_balances WHERE user_id = p_user_id;
  DELETE FROM public.user_settings WHERE user_id = p_user_id;
  
  -- Delete from party-related tables
  DELETE FROM public.party_chat WHERE user_id = p_user_id;
  DELETE FROM public.party_leaderboard WHERE user_id = p_user_id;
  DELETE FROM public.party_members WHERE user_id = p_user_id;
  
  -- Delete parties where user is the leader
  DELETE FROM public.party_quests WHERE party_id IN (
    SELECT party_id FROM public.parties WHERE party_leader_id = p_user_id
  );
  DELETE FROM public.parties WHERE party_leader_id = p_user_id;
  
  -- Finally delete the profile
  DELETE FROM public.profiles WHERE user_id = p_user_id;
  
  RAISE NOTICE 'User account and all associated data deleted successfully for user: %', p_user_id;
END;
$$;