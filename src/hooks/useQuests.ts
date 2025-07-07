import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useUser } from '@/contexts/UserContext';

type DbQuest = Database['public']['Tables']['quests']['Row'];

export interface Quest {
  id: string;
  quest_name: string;
  description?: string;
  quest_type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  xp_reward: number;
  gold_reward: number;
  tags?: string[];
  status: 'Not started' | 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  due_date?: string;
  user_id: string;
}

// Helper function to transform database quest to our Quest interface
const transformDbQuest = (dbQuest: DbQuest): Quest => ({
  id: dbQuest.id,
  quest_name: dbQuest.quest_name,
  description: dbQuest.description || undefined,
  quest_type: dbQuest.quest_type as Quest['quest_type'],
  priority: dbQuest.priority as Quest['priority'],
  xp_reward: dbQuest.xp_reward,
  gold_reward: dbQuest.gold_reward,
  tags: dbQuest.tags || undefined,
  status: dbQuest.status as Quest['status'],
  created_at: dbQuest.created_at,
  updated_at: dbQuest.updated_at,
  completed_at: dbQuest.completed_at || undefined,
  due_date: dbQuest.due_date || undefined,
  user_id: dbQuest.user_id,
});

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { user: currentUser, updateUser, refetchUserProfile } = useUser();

  // Fetch all quests for the current user
  const fetchQuests = async () => {
    if (!user) return;

    try {
      setLoading(true);
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

  // Update quest status
  const updateQuestStatus = async (questId: string, status: Quest['status']) => {
    if (!user) return false;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return false;

    const previousStatus = quest.status;
    
    // Check if unchecking would result in negative balances (informational only)
    let willHitZeroBalances = false;
    if (status !== 'Completed' && previousStatus === 'Completed') {
      // Check current user balances
      if (currentUser.totalXp < quest.xp_reward || currentUser.gold < quest.gold_reward) {
        willHitZeroBalances = true;
      }
    }
    
    // Track daily XP for chart (but let database handle total XP balance)
    if (status === 'Completed' && previousStatus !== 'Completed') {
      // Quest is being completed - track daily XP for chart
      const today = new Date().toISOString().split('T')[0];
      const currentDailyXp = currentUser.dailyXp || {};
      const updatedDailyXp = {
        ...currentDailyXp,
        [today]: (currentDailyXp[today] || 0) + quest.xp_reward
      };
      updateUser({ dailyXp: updatedDailyXp });
    } else if (status !== 'Completed' && previousStatus === 'Completed') {
      // Quest is being unchecked - update daily XP tracking
      const today = new Date().toISOString().split('T')[0];
      const currentDailyXp = currentUser.dailyXp || {};
      const updatedDailyXp = {
        ...currentDailyXp,
        [today]: Math.max(0, (currentDailyXp[today] || 0) - quest.xp_reward)
      };
      updateUser({ dailyXp: updatedDailyXp });
    }

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

      // Manually refresh user profile to sync XP/Gold balances
      // This ensures immediate UI updates while real-time subscriptions catch up
      if (refetchUserProfile) {
        await refetchUserProfile();
      }

      // Show success message with context about balance limits
      if (status === 'Completed') {
        toast({
          title: 'Quest Completed! ✨',
          description: `You earned ${quest.xp_reward} XP and ${quest.gold_reward} Gold!`,
        });
      } else if (previousStatus === 'Completed') {
        const description = willHitZeroBalances 
          ? `Quest unchecked. Your XP and Gold have been reduced to their minimum values.`
          : `${quest.xp_reward} XP and ${quest.gold_reward} Gold have been subtracted.`;
        
        toast({
          title: 'Quest Unchecked',
          description,
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating quest status:', error);
      
      // Revert daily XP tracking on error
      if (status === 'Completed' && previousStatus !== 'Completed') {
        const today = new Date().toISOString().split('T')[0];
        const currentDailyXp = currentUser.dailyXp || {};
        const updatedDailyXp = {
          ...currentDailyXp,
          [today]: Math.max(0, (currentDailyXp[today] || 0) - quest.xp_reward)
        };
        updateUser({ dailyXp: updatedDailyXp });
      } else if (previousStatus === 'Completed') {
        const today = new Date().toISOString().split('T')[0];
        const currentDailyXp = currentUser.dailyXp || {};
        const updatedDailyXp = {
          ...currentDailyXp,
          [today]: (currentDailyXp[today] || 0) + quest.xp_reward
        };
        updateUser({ dailyXp: updatedDailyXp });
      }

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

  // Get quest statistics
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
    refetchQuests: fetchQuests,
  };
};