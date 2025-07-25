import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Quest {
  id: string;
  user_id: string;
  quest_name: string;
  description?: string;
  quest_type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  xp_reward: number;
  gold_reward: number;
  tags?: string[];
  pomodoro_enabled: boolean;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrence_config?: {
    days_of_week?: number[];
    day_of_month?: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentDate = today.getDate();
    const currentDateString = today.toISOString().split('T')[0];

    console.log(`Generating recurring quests for ${currentDateString}, day: ${currentDay}, date: ${currentDate}`);

    // Get all quests with recurrence settings
    const { data: recurringQuests, error: fetchError } = await supabase
      .from('quests')
      .select('*')
      .neq('recurrence_type', 'none')
      .not('recurrence_type', 'is', null);

    if (fetchError) {
      console.error('Error fetching recurring quests:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${recurringQuests?.length || 0} recurring quests`);

    let generatedCount = 0;

    for (const quest of recurringQuests || []) {
      const recurrenceConfig = quest.recurrence_config || {};
      let shouldGenerate = false;

      // Check if quest should be generated today
      switch (quest.recurrence_type) {
        case 'daily':
          shouldGenerate = true;
          break;
        
        case 'weekly':
          // Convert Sunday=0 to Monday=1 system
          const adjustedDay = currentDay === 0 ? 7 : currentDay;
          shouldGenerate = recurrenceConfig.days_of_week?.includes(adjustedDay) || false;
          break;
        
        case 'monthly':
          shouldGenerate = recurrenceConfig.day_of_month === currentDate;
          break;
      }

      if (!shouldGenerate) {
        continue;
      }

      // Check if quest instance already exists for today
      const { data: existingQuest, error: checkError } = await supabase
        .from('quests')
        .select('id')
        .eq('user_id', quest.user_id)
        .eq('quest_name', quest.quest_name)
        .gte('created_at', currentDateString)
        .lt('created_at', `${currentDateString}T23:59:59.999Z`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing quest:', checkError);
        continue;
      }

      if (existingQuest) {
        console.log(`Quest "${quest.quest_name}" already exists for today for user ${quest.user_id}`);
        continue;
      }

      // Generate new quest instance
      const newQuest = {
        user_id: quest.user_id,
        quest_name: quest.quest_name,
        description: quest.description,
        quest_type: quest.quest_type,
        priority: quest.priority,
        difficulty: quest.difficulty,
        xp_reward: quest.xp_reward,
        gold_reward: quest.gold_reward,
        tags: quest.tags,
        due_date: quest.quest_type === 'Daily' ? currentDateString : null,
        pomodoro_enabled: quest.pomodoro_enabled,
        status: 'Not started',
        recurrence_type: 'none', // Generated instances are not recurring themselves
        recurrence_config: null,
      };

      const { error: insertError } = await supabase
        .from('quests')
        .insert(newQuest);

      if (insertError) {
        console.error(`Error creating recurring quest for user ${quest.user_id}:`, insertError);
        continue;
      }

      generatedCount++;
      console.log(`Generated recurring quest "${quest.quest_name}" for user ${quest.user_id}`);
    }

    console.log(`Successfully generated ${generatedCount} recurring quest instances`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated_count: generatedCount,
        message: `Generated ${generatedCount} recurring quest instances for ${currentDateString}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in recurring quest generator:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});