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

    console.log('Starting daily quest archiving...')

    // Get current UTC time and calculate cutoff for archiving
    const now = new Date()
    const archiveTimestamp = now.toISOString()
    
    // Archive quests completed before today (using a reasonable cutoff time)
    // This handles timezone differences by using a cutoff time instead of strict midnight
    const cutoffTime = new Date()
    cutoffTime.setUTCHours(6, 0, 0, 0) // 6 AM UTC cutoff
    
    // If it's before 6 AM UTC, use yesterday's 6 AM UTC as cutoff
    if (now.getUTCHours() < 6) {
      cutoffTime.setUTCDate(cutoffTime.getUTCDate() - 1)
    }
    
    const cutoffTimestamp = cutoffTime.toISOString()
    
    console.log(`Archiving quests completed before: ${cutoffTimestamp}`)
    
    // Find all completed quests that should be archived
    const { data: completedQuests, error: fetchError } = await supabase
      .from('quests')
      .select(`
        id,
        user_id,
        quest_name,
        description,
        quest_type,
        priority,
        xp_reward,
        gold_reward,
        tags,
        completed_at,
        created_at
      `)
      .eq('status', 'Completed')
      .not('completed_at', 'is', null)
      .lt('completed_at', cutoffTimestamp)

    if (fetchError) {
      console.error('Error fetching completed quests:', fetchError)
      throw fetchError
    }

    console.log(`Found ${completedQuests?.length || 0} completed quests to archive`)

    let totalArchivedCount = 0
    const userArchiveCounts = new Map<string, number>()

    if (completedQuests && completedQuests.length > 0) {
      // Get focus quests to determine which were in focus
      const { data: focusQuests } = await supabase
        .from('user_settings')
        .select('focus_quests')
        .not('focus_quests', 'is', null)
      
      const allFocusQuestIds = new Set<string>()
      if (focusQuests) {
        focusQuests.forEach(user => {
          if (user.focus_quests && Array.isArray(user.focus_quests)) {
            user.focus_quests.forEach(id => allFocusQuestIds.add(id))
          }
        })
      }

      // Prepare archive records
      const archiveRecords = completedQuests.map(quest => {
        const completedDate = new Date(quest.completed_at!).toISOString().split('T')[0]
        
        // Count per user
        const count = userArchiveCounts.get(quest.user_id) || 0
        userArchiveCounts.set(quest.user_id, count + 1)
        
        return {
          user_id: quest.user_id,
          original_quest_id: quest.id,
          quest_name: quest.quest_name,
          description: quest.description,
          quest_type: quest.quest_type,
          priority: quest.priority,
          xp_reward: quest.xp_reward,
          gold_reward: quest.gold_reward,
          tags: quest.tags,
          completed_date: completedDate,
          completed_at: quest.completed_at,
          archived_at: archiveTimestamp,
          was_in_focus: allFocusQuestIds.has(quest.id)
        }
      })

      // Insert into archived_quests table
      const { data: archivedQuests, error: archiveError } = await supabase
        .from('archived_quests')
        .insert(archiveRecords)
        .select('id')

      if (archiveError) {
        console.error('Error archiving quests:', archiveError)
        throw archiveError
      }

      totalArchivedCount = archivedQuests?.length || 0
      console.log(`Successfully archived ${totalArchivedCount} quests`)

      // Delete the original completed quests
      const questIdsToDelete = completedQuests.map(quest => quest.id)
      const { error: deleteError } = await supabase
        .from('quests')
        .delete()
        .in('id', questIdsToDelete)

      if (deleteError) {
        console.error('Error deleting original quests:', deleteError)
        // Don't throw here - archiving succeeded, deletion is secondary
      } else {
        console.log(`Successfully deleted ${questIdsToDelete.length} original quests`)
      }

      // Remove archived quest IDs from user focus lists
      if (allFocusQuestIds.size > 0) {
        const { data: userSettings, error: settingsError } = await supabase
          .from('user_settings')
          .select('id, user_id, focus_quests')
          .not('focus_quests', 'is', null)

        if (!settingsError && userSettings) {
          for (const settings of userSettings) {
            if (settings.focus_quests && Array.isArray(settings.focus_quests)) {
              const updatedFocusQuests = settings.focus_quests.filter(
                id => !questIdsToDelete.includes(id)
              )
              
              if (updatedFocusQuests.length !== settings.focus_quests.length) {
                await supabase
                  .from('user_settings')
                  .update({ focus_quests: updatedFocusQuests })
                  .eq('id', settings.id)
                
                console.log(`Updated focus quests for user ${settings.user_id}`)
              }
            }
          }
        }
      }
    }

    // Log the archiving operation
    const { error: logError } = await supabase
      .from('daily_reset_logs')
      .insert({
        user_id: null, // Global log entry
        reset_date: cutoffTime.toISOString().split('T')[0],
        reset_timestamp: archiveTimestamp,
        quests_reset_count: totalArchivedCount // Using this field to track archived count
      })

    if (logError) {
      console.error('Error logging archive operation:', logError)
    }

    const message = totalArchivedCount > 0 
      ? `Archived ${totalArchivedCount} completed quests from ${userArchiveCounts.size} users`
      : 'No completed quests found to archive'

    console.log(message)

    return new Response(
      JSON.stringify({
        success: true,
        message,
        archivedCount: totalArchivedCount,
        affectedUsers: userArchiveCounts.size,
        cutoffTime: cutoffTimestamp,
        timestamp: archiveTimestamp
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in daily quest archiving:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to archive completed quests',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})