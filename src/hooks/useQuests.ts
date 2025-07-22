import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useUser } from '@/contexts/UserContext';
import { testMedicationCase, testResetLogic, shouldQuestReset } from '@/utils/dailyResetTest';
import { getLocalToday, getLocalDateFromUTC, getLocalDayBoundariesUTC } from '@/utils/timezone';

type DbQuest = Database['public']['Tables']['quests']['Row'];

export interface Quest {
  id: string;
  quest_name: string;
  description?: string;
  quest_type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  xp_reward: number;
  gold_reward: number;
  tags?: string[];
  status: 'Not started' | 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string;
  user_id: string;
  pomodoro_enabled: boolean;
  is_recurring?: boolean;
}

// Helper function to transform database quest to our Quest interface
const transformDbQuest = (dbQuest: DbQuest): Quest => ({
  id: dbQuest.id,
  quest_name: dbQuest.quest_name,
  description: dbQuest.description || undefined,
  quest_type: dbQuest.quest_type as Quest['quest_type'],
  priority: dbQuest.priority as Quest['priority'],
  difficulty: (dbQuest as any).difficulty as Quest['difficulty'] || 'Moderate',
  xp_reward: dbQuest.xp_reward,
  gold_reward: dbQuest.gold_reward,
  tags: dbQuest.tags || undefined,
  status: dbQuest.status as Quest['status'],
  created_at: dbQuest.created_at,
  updated_at: dbQuest.updated_at,
  completed_at: dbQuest.completed_at || undefined,
  due_date: dbQuest.due_date || undefined,
  user_id: dbQuest.user_id,
  pomodoro_enabled: dbQuest.pomodoro_enabled,
  is_recurring: dbQuest.is_recurring || false,
});

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { user: currentUser, updateUser, refetchUserProfile, refetchDailyXp } = useUser();

  // Archive completed quests from previous days
  const archiveOldQuests = async () => {
    if (!user) return;

    try {
      // Use the same timezone logic as the server
      const now = new Date()
      const cutoffTime = new Date()
      cutoffTime.setUTCHours(6, 0, 0, 0) // 6 AM UTC cutoff
      
      // If it's before 6 AM UTC, use yesterday's 6 AM UTC as cutoff
      if (now.getUTCHours() < 6) {
        cutoffTime.setUTCDate(cutoffTime.getUTCDate() - 1)
      }
      
      const cutoffTimestamp = cutoffTime.toISOString()
      
      // Find completed NON-DAILY quests from before the cutoff time that should be archived
      // Daily habits are handled separately in the reset logic to preserve streak history
      const { data: oldCompletedQuests, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Completed')
        .neq('quest_type', 'Daily') // Exclude daily habits - they're handled in reset logic
        .not('completed_at', 'is', null)
        .lt('completed_at', cutoffTimestamp);

      if (error) {
        console.error('Error checking for old completed quests:', error);
        return;
      }

      if (oldCompletedQuests && oldCompletedQuests.length > 0) {
        console.log(`Found ${oldCompletedQuests.length} old completed quests, archiving...`);
        
        // Get current focus quests to determine which were in focus
        const focusQuests = JSON.parse(localStorage.getItem('lifequest-todays-focus') || '[]');
        
        // Prepare archive records - process ALL quests in the array
        const archiveRecords = oldCompletedQuests.map((quest, index) => {
          console.log(`Client archiving quest ${index + 1}/${oldCompletedQuests.length}: "${quest.quest_name}"`);
          
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
            completed_date: new Date(quest.completed_at).toISOString().split('T')[0],
            completed_at: quest.completed_at,
            was_in_focus: focusQuests.includes(quest.id)
          };
        });

        // Archive the quests
        const { error: archiveError } = await supabase
          .from('archived_quests')
          .insert(archiveRecords);

        if (archiveError) {
          console.error('Error archiving old quests:', archiveError);
          return;
        }

        // Delete the original quests - make sure we delete ALL quests
        const questIdsToDelete = oldCompletedQuests.map(q => q.id);
        console.log(`Client deleting ${questIdsToDelete.length} quests:`, questIdsToDelete);
        
        const { error: deleteError } = await supabase
          .from('quests')
          .delete()
          .in('id', questIdsToDelete);

        if (deleteError) {
          console.error('Error deleting original quests:', deleteError);
        } else {
          console.log(`Successfully archived and removed ${oldCompletedQuests.length} old completed quests`);
          
          // Update focus quests to remove archived ones - process ALL archived quests
          const updatedFocusQuests = focusQuests.filter(id => !questIdsToDelete.includes(id));
          localStorage.setItem('lifequest-todays-focus', JSON.stringify(updatedFocusQuests));
          
          // Dispatch event to notify components that focus list has been updated
          window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
          
          console.log(`Updated Today's Focus: removed ${questIdsToDelete.length} archived quests, ${updatedFocusQuests.length} remaining`);
        }
      }
    } catch (error) {
      console.error('Error in quest archiving:', error);
    }
  };

  // Check and handle daily quest reset on app load
  const checkDailyReset = async () => {
    if (!user) return;

    try {
      const todayLocal = getLocalToday();
      console.log('🔄 Checking daily quest reset for local date:', todayLocal);
      console.log('🔄 Current time:', new Date().toISOString());
      
      // First, archive completed daily habits from previous days to preserve streak/XP history
      // Only archive recurring habits, not one-time daily tasks
      const { data: completedDailies, error: dailyError } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id)
        .eq('quest_type', 'Daily')
        .eq('status', 'Completed')
        .eq('is_recurring', true)
        .not('completed_at', 'is', null);

      if (dailyError) {
        console.error('❌ Error checking completed daily habits:', dailyError);
        return;
      }

      // Archive completed daily habits from previous days
      if (completedDailies && completedDailies.length > 0) {
        const dailiesFromPreviousDays = completedDailies.filter(quest => {
          if (!quest.completed_at) return false;
          const completedLocalDate = getLocalDateFromUTC(quest.completed_at);
          const shouldArchive = completedLocalDate !== todayLocal;
          console.log(`🔍 Checking daily habit "${quest.quest_name}": 
            - Completed at (UTC): ${quest.completed_at}
            - Completed local date: ${completedLocalDate} 
            - Today local date: ${todayLocal}
            - Should archive: ${shouldArchive}`);
          return shouldArchive;
        });

        if (dailiesFromPreviousDays.length > 0) {
          console.log(`📝 Archiving ${dailiesFromPreviousDays.length} completed daily habits from previous days`);
          
          const focusQuests = JSON.parse(localStorage.getItem('lifequest-todays-focus') || '[]');
          
          const archiveRecords = dailiesFromPreviousDays.map(quest => ({
            user_id: quest.user_id,
            original_quest_id: quest.id,
            quest_name: quest.quest_name,
            description: quest.description,
            quest_type: quest.quest_type,
            priority: quest.priority,
            xp_reward: quest.xp_reward,
            gold_reward: quest.gold_reward,
            tags: quest.tags,
            completed_date: new Date(quest.completed_at).toISOString().split('T')[0],
            completed_at: quest.completed_at,
            was_in_focus: focusQuests.includes(quest.id)
          }));

          const { error: archiveError } = await supabase
            .from('archived_quests')
            .insert(archiveRecords);

          if (archiveError) {
            console.error('❌ Error archiving daily habits:', archiveError);
          } else {
            console.log('✅ Successfully archived completed daily habits');
          }
        }
      }

      // Now find ALL daily habits that need to be reset for today
      console.log(`🔍 Looking for daily habits to reset for today: ${todayLocal}`);
      
      const { data: allDailyHabits, error: resetError } = await supabase
        .from('quests')
        .select('id, quest_name, due_date, status, completed_at, is_recurring')
        .eq('quest_type', 'Daily')
        .eq('user_id', user.id);

      if (resetError) {
        console.error('❌ Error checking daily habits for reset:', resetError);
        return;
      }

      // Filter daily habits that need to be reset (regardless of is_recurring flag)
      const dailyHabitsToReset = allDailyHabits?.filter(habit => {
        const needsReset = shouldQuestReset({
          status: habit.status as 'Not started' | 'In Progress' | 'Completed',
          due_date: habit.due_date
        }, todayLocal);
        console.log(`📋 Daily habit "${habit.quest_name}": due_date=${habit.due_date}, status=${habit.status}, is_recurring=${habit.is_recurring}, needsReset=${needsReset}`);
        return needsReset;
      }) || [];

      // Reset daily habits that are not already set for today
      if (dailyHabitsToReset && dailyHabitsToReset.length > 0) {
        console.log(`⚡ Found ${dailyHabitsToReset.length} daily habits to reset for today:`, 
          dailyHabitsToReset.map(q => `${q.quest_name} (${q.status}, due: ${q.due_date || 'NULL'}, recurring: ${q.is_recurring})`));
        
        const questIdsToReset = dailyHabitsToReset.map(q => q.id);
        
        const { error: updateError } = await supabase
          .from('quests')
          .update({
            status: 'Not started',
            due_date: todayLocal, // Set to today's local date
            completed_at: null, // Reset completion timestamp for new day
            updated_at: new Date().toISOString()
          })
          .in('id', questIdsToReset);

        if (updateError) {
          console.error('❌ Error resetting recurring daily habits:', updateError);
        } else {
          console.log('✅ Successfully reset daily habits for today');
          
          // Log the client-side reset
          try {
            await supabase
              .from('daily_reset_logs')
              .insert({
                user_id: user.id,
                reset_date: todayLocal,
                reset_timestamp: new Date().toISOString(),
                quests_reset_count: dailyHabitsToReset.length
              });
          } catch (logError) {
            console.error('❌ Error logging client-side reset:', logError);
          }
        }
      } else {
        console.log('✅ All daily habits are already set for today');
      }

      // Handle non-daily quests (separate logic)
      const { data: outdatedQuests, error } = await supabase
        .from('quests')
        .select('id, quest_name, due_date, status, completed_at')
        .eq('user_id', user.id)
        .neq('quest_type', 'Daily') // Only non-daily quests
        .not('due_date', 'is', null)
        .lt('due_date', todayLocal);

      if (error) {
        console.error('❌ Error checking for outdated non-daily quests:', error);
        return;
      }

      // Reset outdated non-daily quests if any
      if (outdatedQuests && outdatedQuests.length > 0) {
        console.log(`⚡ Found ${outdatedQuests.length} outdated non-daily quests to reset`);
        
        const questIdsToReset = outdatedQuests.map(q => q.id);
        
        const { error: resetError } = await supabase
          .from('quests')
          .update({
            status: 'Not started',
            due_date: todayLocal,
            completed_at: null,
            updated_at: new Date().toISOString()
          })
          .in('id', questIdsToReset);

        if (resetError) {
          console.error('❌ Error resetting non-daily quests:', resetError);
        } else {
          console.log('✅ Successfully reset non-daily quests');
        }
      }
    } catch (error) {
      console.error('❌ Error in daily reset check:', error);
    }
  };

  // Fetch all quests for the current user
  const fetchQuests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Run reset logic tests in development
      if (process.env.NODE_ENV === 'development') {
        testResetLogic();
        testMedicationCase();
      }
      
      // First archive old completed quests
      await archiveOldQuests();
      
      // Then check for daily resets
      await checkDailyReset();
      
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuests((data || []).map(transformDbQuest));
    } catch (error) {
      console.error('Error fetching quests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch quests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new quest
  const createQuest = async (questData: Omit<Quest, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    if (!user) return null;

    // Create optimistic quest object for immediate UI update
    const optimisticQuest: Quest = {
      id: `temp-${Date.now()}`, // Temporary ID
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: undefined,
      ...questData,
    };

    // Add quest immediately to local state for instant feedback
    setQuests(prev => [optimisticQuest, ...prev]);

    try {
      const { data, error } = await supabase
        .from('quests')
        .insert({
          ...questData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const transformedQuest = transformDbQuest(data);
      
      // Replace the optimistic quest with the real one from the database
      setQuests(prev => 
        prev.map(quest => 
          quest.id === optimisticQuest.id ? transformedQuest : quest
        )
      );
      
      toast({
        title: 'Quest Created! 🎯',
        description: `${data.quest_name} has been added to your quest log.`,
      });

      return transformedQuest;
    } catch (error) {
      console.error('Error creating quest:', error);
      
      // Remove the optimistic quest on error
      setQuests(prev => prev.filter(quest => quest.id !== optimisticQuest.id));
      
      toast({
        title: 'Error',
        description: 'Failed to create quest. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Add debouncing to prevent duplicate calls
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  // Update quest status
  const updateQuestStatus = async (questId: string, status: Quest['status']) => {
    if (!user) return false;

    // Prevent duplicate calls for the same quest
    if (pendingUpdates.has(questId)) {
      console.log(`🚫 Preventing duplicate update for quest: ${questId}`);
      return false;
    }

    const quest = quests.find(q => q.id === questId);
    if (!quest) return false;

    const previousStatus = quest.status;
    
    // Skip if status hasn't actually changed
    if (previousStatus === status) {
      console.log(`🚫 Status unchanged for quest: ${questId}`);
      return false;
    }
    
    // Debug XP tracking
    console.log(`🎯 Quest Status Update Debug:
      - Quest: "${quest.quest_name}"
      - Type: ${quest.quest_type}
      - Previous Status: ${previousStatus}
      - New Status: ${status}
      - XP Reward: ${quest.xp_reward}
      - Gold Reward: ${quest.gold_reward}`);

    // Add to pending updates to prevent duplicates
    setPendingUpdates(prev => new Set([...prev, questId]));

    // Update quest status in local state immediately
    setQuests(prev => 
      prev.map(q => 
        q.id === questId ? { ...q, status } : q
      )
    );

    try {
      const { data, error } = await supabase
        .from('quests')
        .update({ status })
        .eq('id', questId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update with the actual data from the database
      const transformedQuest = transformDbQuest(data);
      setQuests(prev => 
        prev.map(q => 
          q.id === questId ? transformedQuest : q
        )
      );

      console.log(`✅ Quest status updated in database:
        - Quest completed_at: ${transformedQuest.completed_at}
        - Database trigger awards XP: ${transformedQuest.xp_reward}`);

      // The database trigger handles ALL XP/Gold rewards automatically
      // We just need to refresh the profile to sync the UI with the database
      if (refetchUserProfile) {
        console.log('🔄 Refreshing user profile to sync with database...');
        await refetchUserProfile();
      }

      // Also refresh daily XP data to update charts
      if (refetchDailyXp) {
        console.log('📊 Refreshing daily XP data for charts...');
        await refetchDailyXp();
      }

      // Trigger badge progress update after quest completion
      if (status === 'Completed' && previousStatus !== 'Completed') {
        // Small delay to ensure quest completion is processed first
        setTimeout(async () => {
          try {
            // Trigger badge recalculation via database function
            await supabase.rpc('recalculate_badge_progress', {
              p_user_id: user.id
            });
            console.log('Badge progress recalculated after quest completion');
          } catch (error) {
            console.error('Error triggering badge update:', error);
          }
        }, 100);
      }

      // Show success message - database trigger handles actual rewards
      if (status === 'Completed') {
        toast({
          title: 'Quest Completed! ✨',
          description: `Great job! Check your XP and gold balance for rewards.`,
        });
      } else if (previousStatus === 'Completed') {
        toast({
          title: 'Quest Unchecked',
          description: `Quest marked as incomplete. Rewards have been adjusted.`,
        });
      }

      // Remove from pending updates
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(questId);
        return next;
      });

      return true;
    } catch (error) {
      console.error('Error updating quest status:', error);

      // Revert quest status in local state
      setQuests(prev => 
        prev.map(q => 
          q.id === questId ? { ...q, status: previousStatus } : q
        )
      );

      // More specific error message
      const errorMessage = error.message?.includes('check constraint') 
        ? 'Cannot uncheck quest: would result in negative balance.'
        : 'Failed to update quest status. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      // Remove from pending updates on error
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(questId);
        return next;
      });

      return false;
    }
  };

  // Delete a quest
  const deleteQuest = async (questId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', questId)
        .eq('user_id', user.id);

      if (error) throw error;

      setQuests(prev => prev.filter(quest => quest.id !== questId));
      toast({
        title: 'Quest Deleted',
        description: 'Quest has been removed from your quest log.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting quest:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete quest. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Filter quests by type, status, or priority
  const getQuestsByFilter = (filter: {
    type?: Quest['quest_type'];
    status?: Quest['status'];
    priority?: Quest['priority'];
  }) => {
    return quests.filter(quest => {
      if (filter.type && quest.quest_type !== filter.type) return false;
      if (filter.status && quest.status !== filter.status) return false;
      if (filter.priority && quest.priority !== filter.priority) return false;
      return true;
    });
  };

  // Get quest statistics including archived quests
  const getQuestStats = () => {
    const completed = quests.filter(q => q.status === 'Completed').length;
    const inProgress = quests.filter(q => q.status === 'In Progress').length;
    const notStarted = quests.filter(q => q.status === 'Not started').length;
    const totalXP = quests.filter(q => q.status === 'Completed').reduce((sum, q) => sum + q.xp_reward, 0);
    const totalGold = quests.filter(q => q.status === 'Completed').reduce((sum, q) => sum + q.gold_reward, 0);

    return {
      total: quests.length,
      completed,
      inProgress,
      notStarted,
      totalXP,
      totalGold,
    };
  };

  // Get total completed quests across all time (including archived)
  const getTotalCompletedQuests = async () => {
    if (!user) return 0;
    
    try {
      // Count current completed quests
      const currentCompleted = quests.filter(q => q.status === 'Completed').length;
      
      // Count archived quests (all archived quests were completed)
      const { count: archivedCount, error } = await supabase
        .from('archived_quests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error counting archived quests:', error);
        return currentCompleted; // Return current completed if archived count fails
      }
      
      return currentCompleted + (archivedCount || 0);
    } catch (error) {
      console.error('Error getting total completed quests:', error);
      return quests.filter(q => q.status === 'Completed').length;
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [user]);

  return {
    quests,
    loading,
    createQuest,
    updateQuestStatus,
    deleteQuest,
    getQuestsByFilter,
    getQuestStats,
    getTotalCompletedQuests,
    refetchQuests: fetchQuests,
  };
};