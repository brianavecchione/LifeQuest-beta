import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting daily quest reset...')

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    const resetTimestamp = new Date().toISOString()
    
    // Find only recurring daily habits that need to be reset (not one-time daily tasks)
    // Only reset completed recurring habits to avoid resetting one-time completed tasks
    const { data: dailyQuests, error: fetchError } = await supabase
      .from('quests')
      .select('user_id, id, quest_name')
      .eq('quest_type', 'Daily')
      .eq('status', 'Completed')
      .eq('is_recurring', true)

    if (fetchError) {
      console.error('Error fetching daily quests:', fetchError)
      throw fetchError
    }

    console.log(`Found ${dailyQuests?.length || 0} completed recurring daily habits to reset`)

    let totalResetCount = 0
    const userResetCounts = new Map<string, number>()

    if (dailyQuests && dailyQuests.length > 0) {
      // Count quests per user for logging
      dailyQuests.forEach(quest => {
        const count = userResetCounts.get(quest.user_id) || 0
        userResetCounts.set(quest.user_id, count + 1)
      })

      // Reset only completed recurring daily habits to 'Not started'
      const { data: updatedQuests, error: updateError } = await supabase
        .from('quests')
        .update({
          status: 'Not started',
          due_date: today,
          completed_at: null,
          updated_at: resetTimestamp
        })
        .eq('quest_type', 'Daily')
        .eq('status', 'Completed')
        .eq('is_recurring', true)
        .select('user_id')

      if (updateError) {
        console.error('Error updating daily quests:', updateError)
        throw updateError
      }

      totalResetCount = updatedQuests?.length || 0
      console.log(`Successfully reset ${totalResetCount} recurring daily habits`)

      // Log the reset for each user
      if (userResetCounts.size > 0) {
        const resetLogs = Array.from(userResetCounts.entries()).map(([userId, count]) => ({
          user_id: userId,
          reset_date: today,
          reset_timestamp: resetTimestamp,
          quests_reset_count: count
        }))

        const { error: logError } = await supabase
          .from('daily_reset_logs')
          .insert(resetLogs)

        if (logError) {
          console.error('Error logging reset:', logError)
          // Don't throw here, reset was successful even if logging failed
        } else {
          console.log(`Logged reset for ${userResetCounts.size} users`)
        }
      }

      // Also log a global reset entry (user_id = null for system-wide tracking)
      const { error: globalLogError } = await supabase
        .from('daily_reset_logs')
        .insert({
          user_id: null,
          reset_date: today,
          reset_timestamp: resetTimestamp,
          quests_reset_count: totalResetCount
        })

      if (globalLogError) {
        console.error('Error logging global reset:', globalLogError)
      }
    }

    // Always log that a reset attempt was made, even if no quests were found
    if (totalResetCount === 0) {
      const { error: globalLogError } = await supabase
        .from('daily_reset_logs')
        .insert({
          user_id: null,
          reset_date: today,
          reset_timestamp: resetTimestamp,
          quests_reset_count: 0
        })

      if (globalLogError) {
        console.error('Error logging empty reset:', globalLogError)
      }
    }

    const message = totalResetCount > 0 
      ? `Reset ${totalResetCount} recurring daily habits for ${today}`
      : 'No completed recurring daily habits found to reset'

    console.log(message)

    return new Response(
      JSON.stringify({
        success: true,
        message,
        resetCount: totalResetCount,
        affectedUsers: userResetCounts.size,
        date: today,
        timestamp: resetTimestamp
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in daily quest reset:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to reset daily quests',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})