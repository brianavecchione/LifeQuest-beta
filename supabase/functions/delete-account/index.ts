import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify the user's JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const userId = user.id

    // Log the account deletion attempt
    console.log(`Account deletion requested for user ID: ${userId}`)

    // Delete user data from all tables in the correct order (to handle foreign key constraints)
    const tablesToDelete = [
      'badge_notifications',
      'daily_xp_history', 
      'archived_quests',
      'quests',
      'achievements',
      'streaks',
      'rewards',
      'inventory_items',
      'user_balances',
      'user_settings',
      'party_members',
      'party_chat',
      'party_leaderboard',
      'party_quests',
      'parties',
      'gold_shop_items',
      'soundtracks',
      'profiles'
    ]

    // Delete data from each table
    for (const table of tablesToDelete) {
      try {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId)
        
        if (deleteError) {
          console.error(`Error deleting from ${table}:`, deleteError)
          // Continue with other tables even if one fails
        } else {
          console.log(`Successfully deleted data from ${table}`)
        }
      } catch (error) {
        console.error(`Exception deleting from ${table}:`, error)
        // Continue with other tables even if one fails
      }
    }

    // Delete party data where user is the leader
    try {
      const { error: partyError } = await supabase
        .from('parties')
        .delete()
        .eq('party_leader_id', userId)
      
      if (partyError) {
        console.error('Error deleting parties:', partyError)
      }
    } catch (error) {
      console.error('Exception deleting parties:', error)
    }

    // Delete user from auth (this should be done last)
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId)
    
    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user account' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log successful deletion (without PII)
    console.log(`Account successfully deleted for user ID: ${userId}`)

    return new Response(
      JSON.stringify({ message: 'Account deleted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in delete-account function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})