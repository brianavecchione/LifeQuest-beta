import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
      // Get all completed quests (current + archived) with completion dates
      const [currentQuests, archivedQuests] = await Promise.all([
        supabase
          .from('quests')
          .select('completed_at')
          .eq('user_id', user.id)
          .eq('status', 'Completed')
          .not('completed_at', 'is', null),
        supabase
          .from('archived_quests')
          .select('completed_at')
          .eq('user_id', user.id)
      ]);

      if (currentQuests.error || archivedQuests.error) {
        throw currentQuests.error || archivedQuests.error;
      }

      // Combine all completion dates
      const allCompletedDates = [
        ...(currentQuests.data || []).map(q => q.completed_at),
        ...(archivedQuests.data || []).map(q => q.completed_at)
      ].filter(date => date !== null);

      // Get unique dates (YYYY-MM-DD format)
      const uniqueDates = [...new Set(
        allCompletedDates.map(date => new Date(date!).toISOString().split('T')[0])
      )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Sort descending

      // Calculate streaks
      const today = new Date().toISOString().split('T')[0];
      let current = 0;
      let longest = 0;
      let tempStreak = 0;

      // Calculate current streak (consecutive days from today backwards)
      for (let i = 0; i < uniqueDates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (uniqueDates.includes(expectedDateStr)) {
          current++;
        } else {
          break;
        }
      }

      // Calculate longest streak ever
      for (let i = 0; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(uniqueDates[i - 1]);
          const daysDiff = Math.abs((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            tempStreak++;
          } else {
            longest = Math.max(longest, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longest = Math.max(longest, tempStreak);

      setCurrentStreak(current);
      setLongestStreak(longest);
      setTotalCompleted(allCompletedDates.length);
      
    } catch (error) {
      console.error('Error calculating streaks:', error);
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
      
      // Also calculate streaks from quest data for more accurate results
      await calculateStreaksFromQuests();
    } catch (error) {
      console.error('Error fetching streaks:', error);
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
      console.error('Error recalculating streaks:', error);
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
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('streaks-changes')
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
      supabase.removeChannel(channel);
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