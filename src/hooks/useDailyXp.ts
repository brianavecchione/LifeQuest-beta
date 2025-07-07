import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DailyXpData {
  date: string;
  xp: number;
  day: string;
}

interface WeeklyXpData {
  date: string;
  xp: number;
  period: string;
}

export const useDailyXp = () => {
  const { user } = useAuth();
  const [dailyXpData, setDailyXpData] = useState<DailyXpData[]>([]);
  const [weeklyXpData, setWeeklyXpData] = useState<WeeklyXpData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDailyXpHistory = async () => {
    if (!user) {
      setDailyXpData([]);
      setWeeklyXpData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching daily XP history for user:', user.id);
      
      // Fetch last 30 days of XP history
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('daily_xp_history')
        .select('date, xp_earned')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
         .order('date', { ascending: true });

      console.log('Daily XP history query result:', { data, error });

      if (error) {
        console.error('Error fetching daily XP history:', error);
        return;
      }

      // Create lookup map from database data
      const xpLookup: Record<string, number> = {};
      if (data) {
        data.forEach(entry => {
          xpLookup[entry.date] = entry.xp_earned;
        });
      }

      // Generate last 7 days data
      const last7Days: DailyXpData[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        last7Days.push({
          date: dayName,
          xp: xpLookup[dateStr] || 0,
          day: fullDayName
        });
      }

      // Generate last 4 weeks data
      const last4Weeks: WeeklyXpData[] = [];
      
      for (let weekOffset = 3; weekOffset >= 0; weekOffset--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (weekOffset * 7) - today.getDay());
        
        let weeklyXp = 0;
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + dayOffset);
          const dateStr = date.toISOString().split('T')[0];
          weeklyXp += xpLookup[dateStr] || 0;
        }
        
        last4Weeks.push({
          date: `Week ${4 - weekOffset}`,
          xp: weeklyXp,
          period: `Week of ${weekStart.toLocaleDateString()}`
        });
      }

      console.log('Generated XP data:', { dailyData: last7Days, weeklyData: last4Weeks });
      setDailyXpData(last7Days);
      setWeeklyXpData(last4Weeks);
      
    } catch (error) {
      console.error('Error processing XP history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyXpHistory();
  }, [user?.id]); // Only depend on user ID to avoid unnecessary refetches

  // Set up real-time subscription for XP history updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('daily-xp-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_xp_history',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Daily XP history updated:', payload);
          // Refetch data when daily XP history changes
          fetchDailyXpHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Only depend on user ID

  return {
    dailyXpData,
    weeklyXpData,
    loading,
    refetch: fetchDailyXpHistory
  };
};