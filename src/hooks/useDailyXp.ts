import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getLastNLocalDays, 
  generateDailyXpData, 
  getUserTimezone,
  debugTimezone 
} from '@/utils/timezone';

interface DailyXpData {
  date: string;
  xp: number;
  day: string;
  fullDate?: string; // For debugging
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
      
      // Debug timezone info
      const tzInfo = debugTimezone();
      console.log('🔍 Fetching daily XP history with timezone:', tzInfo);
      
      // Get last 30 days in local timezone
      const last30LocalDays = getLastNLocalDays(30);
      const earliestDate = last30LocalDays[0];
      
      console.log('📅 Querying XP history from:', earliestDate, 'to present');
      
      const { data, error } = await supabase
        .from('daily_xp_history')
        .select('date, xp_earned')
        .eq('user_id', user.id)
        .gte('date', earliestDate)
        .order('date', { ascending: true });

      console.log('📊 Daily XP history query result:', { 
        data, 
        error,
        dataCount: data?.length || 0 
      });

      if (error) {
        console.error('❌ Error fetching daily XP history:', error);
        return;
      }

      // Generate daily data with proper timezone handling
      const dailyData = generateDailyXpData(data || []);
      console.log('📈 Generated daily XP data:', dailyData);

      // Generate weekly data
      const weeklyData = generateWeeklyXpData(data || []);
      console.log('📊 Generated weekly XP data:', weeklyData);

      setDailyXpData(dailyData);
      setWeeklyXpData(weeklyData);
      
    } catch (error) {
      console.error('❌ Error processing XP history:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyXpData = (data: Array<{ date: string; xp_earned: number }>) => {
    // Create XP lookup map
    const xpLookup: Record<string, number> = {};
    data.forEach(entry => {
      xpLookup[entry.date] = entry.xp_earned;
    });

    const weeklyData: WeeklyXpData[] = [];
    const timezone = getUserTimezone();
    const today = new Date();
    
    // Calculate last 4 weeks
    for (let weekOffset = 3; weekOffset >= 0; weekOffset--) {
      const weekStart = new Date(today);
      // Get start of week (Sunday) in local timezone
      weekStart.setDate(today.getDate() - (weekOffset * 7) - today.getDay());
      
      let weeklyXp = 0;
      const weekDates: string[] = [];
      
      // Sum XP for each day of the week
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        weekDates.push(dateStr);
        weeklyXp += xpLookup[dateStr] || 0;
      }
      
      weeklyData.push({
        date: `Week ${4 - weekOffset}`,
        xp: weeklyXp,
        period: `Week of ${weekStart.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          timeZone: timezone 
        })}`
      });
    }

    return weeklyData;
  };

  useEffect(() => {
    fetchDailyXpHistory();
  }, [user?.id]);

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
          console.log('🔄 Daily XP history updated:', payload);
          // Refetch data when daily XP history changes
          fetchDailyXpHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    dailyXpData,
    weeklyXpData,
    loading,
    refetch: fetchDailyXpHistory
  };
};