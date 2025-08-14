-- Fix critical security vulnerability: Restrict profiles table access
-- Currently all profiles are publicly readable which exposes sensitive user data

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that only allows users to view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- For party functionality, we'll need to create a separate policy or view
-- For now, let's add a minimal policy for party members to see basic info of other party members
CREATE POLICY "Party members can view basic info of other party members" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.parties p 
      WHERE (auth.uid() = ANY(p.party_members) OR auth.uid() = p.party_leader_id)
        AND (user_id = ANY(p.party_members) OR user_id = p.party_leader_id)
    )
  )
);