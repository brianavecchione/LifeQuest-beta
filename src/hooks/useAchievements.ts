import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Achievement {
  id: string;
  achievement_name: string;
  description: string;
  achievement_progress_current: number;
  achievement_progress_goal: number;
  is_completed: boolean;
  is_unlockable: boolean;
  quest_value: 'Bronze' | 'Silver' | 'Gold' | 'Legendary';
  xp_reward: number;
  gold_reward: number;
  earned_at: string | null;
  claimed_at: string | null;
  tags: string[] | null;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('is_completed', { ascending: false })
        .order('quest_value', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAchievementProgress = async (achievementId: string, newProgress: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .update({ 
          achievement_progress_current: newProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', achievementId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refresh achievements to get updated data
      await fetchAchievements();
    } catch (error) {
      console.error('Error updating achievement progress:', error);
    }
  };

  const createUserAchievement = async (achievementData: {
    achievement_name: string;
    description: string;
    achievement_progress_goal?: number;
    quest_value?: 'Bronze' | 'Silver' | 'Gold' | 'Legendary';
    xp_reward?: number;
    gold_reward?: number;
    tags?: string[];
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .insert({
          achievement_name: achievementData.achievement_name,
          description: achievementData.description,
          achievement_progress_goal: achievementData.achievement_progress_goal || 1,
          quest_value: achievementData.quest_value || 'Bronze',
          xp_reward: achievementData.xp_reward || 0,
          gold_reward: achievementData.gold_reward || 0,
          tags: achievementData.tags || [],
          user_id: user.id,
        });

      if (error) throw error;
      
      // Refresh achievements to include the new one
      await fetchAchievements();
    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  const claimAchievement = async (achievementId: string) => {
    if (!user) return { success: false, achievement: null };

    try {
      const { data, error } = await supabase.rpc('claim_achievement', {
        p_achievement_id: achievementId,
        p_user_id: user.id
      });

      if (error) throw error;

      if (data) {
        // Find the achievement for return data
        const claimedAchievement = achievements.find(a => a.id === achievementId);
        
        // Refresh achievements to show updated status
        await fetchAchievements();
        
        return { success: true, achievement: claimedAchievement };
      } else {
        return { success: false, achievement: null };
      }
    } catch (error) {
      console.error('Error claiming achievement:', error);
      return { success: false, achievement: null };
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`achievements-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh achievements when they change
          fetchAchievements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    achievements,
    loading,
    updateAchievementProgress,
    createUserAchievement,
    claimAchievement,
    refetch: fetchAchievements
  };
};