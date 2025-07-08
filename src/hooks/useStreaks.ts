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
    if (streaks.length === 0) return { streak_name: 'No streaks', current_streak: 0 };
    
    // Find the streak with the highest current count
    return streaks.reduce((best, current) => 
      current.current_streak > best.current_streak ? current : best
    );
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
    recalculateStreaks,
    refetch: fetchStreaks
  };
};