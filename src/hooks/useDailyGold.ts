import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getLastNLocalDays } from '@/utils/timezone';

interface DailyGoldData {
  date: string;
  gold: number;
  day: string;
  fullDate?: string;
}

interface WeeklyGoldData {
  date: string;
  gold: number;
  period: string;
}

export const useDailyGold = () => {
  const { user } = useAuth();
  const [dailyGoldData, setDailyGoldData] = useState<DailyGoldData[]>([]);
  const [weeklyGoldData, setWeeklyGoldData] = useState<WeeklyGoldData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDailyGoldHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get last 30 days to have enough data for weekly calculations
      const lastNDays = getLastNLocalDays(30);
      const startDate = lastNDays[0];
      const endDate = lastNDays[lastNDays.length - 1];

      console.log('🏆 Fetching daily gold history from', startDate, 'to', endDate);

      const { data, error } = await supabase
        .from('daily_gold_history')
        .select('date, gold_earned')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching daily gold history:', error);
        throw error;
      }

      console.log('🏆 Raw daily gold data from database:', data);

      // Process daily data (last 7 days)
      const last7Days = getLastNLocalDays(7);
      const dailyData = last7Days.map((dateStr) => {
        const dbEntry = data?.find(entry => entry.date === dateStr);
        const goldForDay = dbEntry?.gold_earned || 0;
        
        // Create date in local timezone
        const [year, month, day] = dateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        
        const dayName = localDate.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDayName = localDate.toLocaleDateString('en-US', { weekday: 'long' });
        
        return {
          date: dayName,
          gold: goldForDay,
          day: fullDayName,
          fullDate: dateStr
        };
      });

      // Process weekly data (last 4 weeks)
      const weeklyData = generateWeeklyGoldData(data || []);

      setDailyGoldData(dailyData);
      setWeeklyGoldData(weeklyData);

      console.log('🏆 Processed daily gold data:', dailyData);
      console.log('🏆 Processed weekly gold data:', weeklyData);

    } catch (error) {
      console.error('❌ Error in fetchDailyGoldHistory:', error);
      // Set empty data as fallback
      setDailyGoldData([]);
      setWeeklyGoldData([]);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyGoldData = (data: Array<{ date: string; gold_earned: number }>): WeeklyGoldData[] => {
    const weeks: WeeklyGoldData[] = [];
    const today = new Date();
    
    // Generate last 4 weeks
    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + (weekOffset * 7))); // Start of week (Sunday)
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
      
      // Calculate total gold for this week
      let totalGold = 0;
      for (let day = 0; day < 7; day++) {
        const checkDate = new Date(weekStart);
        checkDate.setDate(weekStart.getDate() + day);
        const dateStr = checkDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        
        const dayData = data.find(entry => entry.date === dateStr);
        if (dayData) {
          totalGold += dayData.gold_earned;
        }
      }
      
      const weekLabel = weekOffset === 0 ? 'This Week' : 
                       weekOffset === 1 ? 'Last Week' : 
                       `${weekOffset + 1} weeks ago`;
      
      const periodLabel = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      weeks.unshift({
        date: weekLabel,
        gold: totalGold,
        period: periodLabel
      });
    }
    
    return weeks;
  };

  useEffect(() => {
    fetchDailyGoldHistory();
  }, [user?.id]);

  // Set up real-time subscription for daily_gold_history changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`daily-gold-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_gold_history',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('🏆 Daily gold history changed, refetching...');
          fetchDailyGoldHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const refetch = async () => {
    await fetchDailyGoldHistory();
  };

  return {
    dailyGoldData,
    weeklyGoldData,
    loading,
    refetch,
  };
};