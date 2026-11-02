import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateLocalStreaks, debugTimezone, getLocalDateFromUTC } from '@/utils/timezone';

interface Streak {
  id: string;
  streak_name: string;
  description: string;
  current_streak: number;
  best_streak: number;
  status: 'Active' | 'Inactive';
  last_activity_date: string | null;
}

export const useStreaks = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateStreaksFromQuests = async () => {
    if (!user) return;
    
    try {
      // Debug timezone info
      const tzInfo = debugTimezone();
      console.log('🔥 Calculating streaks with timezone:', tzInfo);
      
      // Get all completed quests (current + archived) with completion dates
      const [currentQuests, archivedQuests, xpHistory] = await Promise.all([
        supabase
          .from('quests')
          .select('completed_at')
          .eq('user_id', user.id)
          .eq('status', 'Completed')
          .not('completed_at', 'is', null),
        supabase
          .from('archived_quests')
          .select('completed_at')
          .eq('user_id', user.id),
        supabase
          .from('daily_xp_history')
          .select('date, xp_earned')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
      ]);

      if (currentQuests.error || archivedQuests.error) {
        throw currentQuests.error || archivedQuests.error;
      }

      if (xpHistory.error) {
        console.error('Error fetching XP history:', xpHistory.error);
      }

      // Combine all completion timestamps (UTC)
      const allCompletedTimestamps = [
        ...(currentQuests.data || []).map(q => q.completed_at),
        ...(archivedQuests.data || []).map(q => q.completed_at)
      ].filter(timestamp => timestamp !== null);

      console.log('📊 STREAK ISSUE DEBUG - Found completed timestamps:', {
        currentCount: currentQuests.data?.length || 0,
        archivedCount: archivedQuests.data?.length || 0,
        totalTimestamps: allCompletedTimestamps.length,
        xpHistoryCount: xpHistory.data?.length || 0,
        allTimestamps: allCompletedTimestamps
      });

      // Calculate streaks with proper timezone handling and XP history fallback
      const streakData = calculateLocalStreaks(allCompletedTimestamps, xpHistory.data || []);
      
      console.log('🎯 STREAK ISSUE DEBUG - Calculated streak data:', streakData);
      console.log('🎯 Current streak should be:', streakData.currentStreak, '(user reported: 2 days incorrect)');
      console.log('🎯 Longest streak should be:', streakData.longestStreak);
      console.log('🎯 Total completed quests:', allCompletedTimestamps.length);

      setCurrentStreak(streakData.currentStreak);
      setLongestStreak(streakData.longestStreak);
      setTotalCompleted(allCompletedTimestamps.length); // Use total count of all completed quests
      
    } catch (error) {
      console.error('❌ Error calculating streaks:', error);
      setError('Failed to calculate streaks');
    }
  };

  const fetchStreaks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .order('current_streak', { ascending: false });

      if (error) throw error;
      setStreaks(data || []);
      
      // Calculate streaks from quest data for more accurate results
      await calculateStreaksFromQuests();
    } catch (error) {
      console.error('❌ Error fetching streaks:', error);
      setError('Failed to load streaks');
    } finally {
      setLoading(false);
    }
  };

  const recalculateStreaks = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('calculate_current_streaks', {
        p_user_id: user.id
      });
      
      if (error) throw error;
      
      // Refresh streaks after recalculation
      await fetchStreaks();
    } catch (error) {
      console.error('❌ Error recalculating streaks:', error);
      setError('Failed to recalculate streaks');
    }
  };

  const getBestStreak = () => {
    // Use calculated streak data for more accuracy
    return { 
      streak_name: 'Daily Completion Streak', 
      current_streak: currentStreak 
    };
  };

  const getLongestStreak = () => {
    return longestStreak;
  };

  const getTotalCompleted = () => {
    return totalCompleted;
  };

  useEffect(() => {
    fetchStreaks();
    // Force streak calculation on mount for debugging
    console.log('🔥 STREAK DEBUG - useStreaks hook mounted, forcing calculation...');
    setTimeout(() => {
      calculateStreaksFromQuests();
    }, 1000);
  }, [user]);

  // Set up real-time subscription for quest completions to update streaks
  useEffect(() => {
    if (!user) return;

    const questChannel = supabase
      .channel(`quest-completions-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔄 Quest updated, recalculating streaks:', payload);
          // Recalculate streaks when quest status changes
          calculateStreaksFromQuests();
        }
      )
      .subscribe();

    const streakChannel = supabase
      .channel(`streaks-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'streaks',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchStreaks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questChannel);
      supabase.removeChannel(streakChannel);
    };
  }, [user]);

  return {
    streaks,
    loading,
    error,
    getBestStreak,
    getLongestStreak,
    getTotalCompleted,
    currentStreak,
    longestStreak,
    totalCompleted,
    recalculateStreaks,
    refetch: fetchStreaks
  };
};