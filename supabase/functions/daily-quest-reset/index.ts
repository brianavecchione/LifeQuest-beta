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
    
    // Find all daily quests that need to be reset
    const { data: dailyQuests, error: fetchError } = await supabase
      .from('quests')
      .select('*')
      .eq('quest_type', 'Daily')

    if (fetchError) {
      console.error('Error fetching daily quests:', fetchError)
      throw fetchError
    }

    console.log(`Found ${dailyQuests?.length || 0} daily quests`)

    if (dailyQuests && dailyQuests.length > 0) {
      // Reset all daily quests to 'Not started' and update due date to today
      const { data: updatedQuests, error: updateError } = await supabase
        .from('quests')
        .update({
          status: 'Not started',
          due_date: today,
          completed_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('quest_type', 'Daily')
        .select()

      if (updateError) {
        console.error('Error updating daily quests:', updateError)
        throw updateError
      }

      console.log(`Successfully reset ${updatedQuests?.length || 0} daily quests`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Reset ${updatedQuests?.length || 0} daily quests for ${today}`,
          resetCount: updatedQuests?.length || 0,
          date: today
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else {
      console.log('No daily quests found to reset')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No daily quests found to reset',
          resetCount: 0,
          date: today
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

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