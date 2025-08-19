import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';
import { useQuests } from '@/hooks/useQuestsWrapper';
import { useDailyGold } from '@/hooks/useDailyGoldWrapper';
import { calculateGoldThisWeek, calculateGoldThisMonth, calculateQuestsCompletedThisWeek, calculateQuestsCompletedThisMonth, getCurrentWeekBounds, getCurrentMonthBounds, calculateXpThisWeek, calculateXpThisMonth } from '@/utils/timezone';
import { useDailyXp } from '@/hooks/useDailyXpWrapper';

const XPProgressChart = React.memo(() => {
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const { user: character, getDailyXpData, getWeeklyXpData, isLoading } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { balance } = useUserBalance();
  const { quests } = useQuests();
  const { dailyXpData: xpHistoryData, loading: xpLoading } = useDailyXp();
  const { dailyGoldData: goldHistoryData, loading: goldLoading } = useDailyGold();
  
  const activeUser = isGuestMode ? guestUser : character;

  // Debug logging for guest mode (throttled to prevent excessive logs)
  const debugData = React.useMemo(() => ({
    isGuestMode,
    hasCharacter: !!character,
    hasGuestUser: !!guestUser,
    isLoading,
    xpLoading,
    goldLoading
  }), [isGuestMode, !!character, !!guestUser, isLoading, xpLoading, goldLoading]);

  React.useEffect(() => {
    console.log('📊 XPProgressChart Debug:', debugData);
  }, [debugData]);

  // In guest mode, use guestUser directly to avoid circular reference issues
  const displayUser = isGuestMode ? guestUser : activeUser;

  // Get real or guest XP data with stable memoization
  const weeklyXpData = React.useMemo(() => {
    if (isGuestMode) {
      // Generate stable mock data for guest mode
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const mockXp = Math.floor(Math.random() * 50) + 10; // Random XP between 10-60
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          xp: mockXp,
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          fullDate: date.toISOString().split('T')[0]
        };
      });
    }
    
    try {
      const data = getDailyXpData();
      return data || [];
    } catch (error) {
      console.error('❌ Error getting daily XP data:', error);
      // Fallback to empty data
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          xp: 0,
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          fullDate: date.toISOString().split('T')[0]
        };
      });
    }
  }, [isGuestMode, getDailyXpData]);

  const monthlyXpData = React.useMemo(() => {
    if (isGuestMode) {
      // Generate mock weekly data for guest mode
      return Array.from({ length: 4 }, (_, i) => ({
        date: `Week ${4 - i}`,
        xp: Math.floor(Math.random() * 200) + 100, // Random XP between 100-300
        period: `Week ${4 - i}`
      }));
    }
    
    try {
      const data = getWeeklyXpData();
      return data;
    } catch (error) {
      console.error('❌ Error getting weekly XP data:', error);
      // Fallback to empty data
      return Array.from({ length: 4 }, (_, i) => ({
        date: `Week ${i + 1}`,
        xp: 0,
        period: `Week ${i + 1}`
      }));
    }
  }, [getWeeklyXpData, isGuestMode]);

  const chartConfig = {
    xp: {
      label: "XP Earned",
      color: "hsl(var(--chart-1))",
    },
  };

  // Track animated XP values for smooth transitions
  const [animatedXpValues, setAnimatedXpValues] = useState<{ [key: string]: number }>({});
  
  // Memoize current data selection to prevent unnecessary re-renders
  const rawCurrentData = React.useMemo(() => {
    const data = chartPeriod === 'week' ? weeklyXpData : monthlyXpData;
    return data || [];
  }, [chartPeriod, weeklyXpData, monthlyXpData]);

  // Animate XP values smoothly for the current day only
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayShort = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    rawCurrentData.forEach((item, index) => {
      const key = `${chartPeriod}-${item.date || item.period}-${index}`;
      const isToday = (chartPeriod === 'week' && item.fullDate === today) || 
                     (chartPeriod === 'week' && item.date === todayShort) ||
                     (chartPeriod === 'month' && index === rawCurrentData.length - 1); // Last item for month view
      
      if (isToday) {
        const targetXp = item.xp;
        const currentAnimatedValue = animatedXpValues[key] || 0;
        
        // Only animate if there's a significant change
        if (Math.abs(targetXp - currentAnimatedValue) > 0.1) {
          let startValue = currentAnimatedValue;
          let startTime = Date.now();
          const duration = 1200; // 1.2 seconds
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(progress);
            
            const currentValue = startValue + (targetXp - startValue) * easedProgress;
            
            setAnimatedXpValues(prev => ({
              ...prev,
              [key]: currentValue
            }));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setAnimatedXpValues(prev => ({
                ...prev,
                [key]: targetXp
              }));
            }
          };
          
          requestAnimationFrame(animate);
        }
      }
    });
  }, [rawCurrentData, chartPeriod]);

  // Create current data with animated values
  const currentData = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayShort = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    return rawCurrentData.map((item, index) => {
      const key = `${chartPeriod}-${item.date || item.period}-${index}`;
      const isToday = (chartPeriod === 'week' && item.fullDate === today) || 
                     (chartPeriod === 'week' && item.date === todayShort) ||
                     (chartPeriod === 'month' && index === rawCurrentData.length - 1); // Last item for month view
      
      if (isToday) {
        // Use animated value for current day
        const animatedValue = animatedXpValues[key];
        return {
          ...item,
          xp: animatedValue !== undefined ? animatedValue : item.xp
        };
      }
      
      // Non-current day items stay static
      return item;
    });
  }, [rawCurrentData, chartPeriod, animatedXpValues]);
  
  // Check if user has any XP data at all, not just current period
  const hasXpData = React.useMemo(() => {
    if (isGuestMode) return true; // Guest mode always has mock data
    
    // Check historical XP data to see if user has ever earned XP
    const hasHistoricalXp = xpHistoryData.some(item => item.xp > 0);
    
    console.log('📊 XP Data Check:', {
      hasHistoricalXp,
      xpHistoryData: xpHistoryData.slice(0, 3), // Log first few items
      currentDataHasXp: currentData.some(item => item.xp > 0)
    });
    
    return hasHistoricalXp;
  }, [isGuestMode, xpHistoryData, currentData]);

  // Calculate summary stats with fallback messaging
  const goldEarnedThisWeek = React.useMemo(() => {
    if (isGuestMode) return Math.floor(Math.random() * 200) + 150; // Mock data for guest
    
    // Check if we have gold history data
    if (goldLoading) return null; // Still loading
    
    try {
      // Use actual daily gold history to calculate weekly total
      const { start, end } = getCurrentWeekBounds();
      console.log('🏆 Calculating gold for week:', { start, end, goldHistoryData });
      
      // Convert daily gold data to the format expected by calculateGoldThisWeek
      const goldHistory = goldHistoryData.map(day => ({
        date: day.fullDate || day.date,
        gold_earned: day.gold
      }));
      
      const weeklyGold = calculateGoldThisWeek(goldHistory);
      console.log('🏆 Calculated weekly gold:', weeklyGold);
      return weeklyGold;
    } catch (error) {
      console.error('Error calculating weekly gold:', error);
      return null; // Data not available
    }
  }, [isGuestMode, goldHistoryData, goldLoading]);

  const questsCompletedThisWeek = React.useMemo(() => {
    if (isGuestMode) return Math.floor(Math.random() * 15) + 5; // Mock data for guest
    
    // Check if we have quest completion timestamps
    const questsWithTimestamps = quests.filter(q => q.completed_at);
    if (questsWithTimestamps.length === 0 && quests.some(q => q.status === 'Completed')) {
      // Some quests are completed but don't have timestamps
      console.warn('⚠️ Found completed quests without timestamps');
      return null; // Data not available
    }
    
    try {
      const weeklyCompleted = calculateQuestsCompletedThisWeek(quests);
      console.log('🎯 Calculated weekly quests completed:', weeklyCompleted);
      return weeklyCompleted;
    } catch (error) {
      console.error('Error calculating weekly quests:', error);
      return null; // Data not available
    }
  }, [isGuestMode, quests]);

  const levelProgressThisPeriod = React.useMemo(() => {
    if (isGuestMode) return Math.floor(Math.random() * 80) + 10; // Mock data for guest
    
    // Check if we have XP history data
    if (xpLoading) return null; // Still loading
    
    try {
      const currentLevel = displayUser?.level || 1;
      
      // Calculate XP needed to reach next level
      const xpForNextLevel = currentLevel * 100;
      const xpForCurrentLevel = (currentLevel - 1) * 100;
      const xpNeededForLevelUp = xpForNextLevel - xpForCurrentLevel; // Always 100 in this system
      
      // Convert daily XP data to the format expected by calculate functions
      const xpHistory = xpHistoryData.map(day => ({
        date: day.fullDate || day.date,
        xp_earned: day.xp
      }));
      
      // Calculate XP earned this period
      const xpEarnedThisPeriod = chartPeriod === 'week' 
        ? calculateXpThisWeek(xpHistory)
        : calculateXpThisMonth(xpHistory);
      
      console.log('📊 Level Progress Debug:', {
        currentLevel,
        xpNeededForLevelUp,
        xpEarnedThisPeriod,
        chartPeriod,
        xpHistoryData
      });
      
      if (xpEarnedThisPeriod === 0) {
        return 0; // No progress this period
      }
      
      // Calculate percentage progress toward next level
      // If they earned more XP than needed for level up, calculate progress into next level(s)
      let remainingXp = xpEarnedThisPeriod;
      let progressPercentage = 0;
      
      // Handle case where user leveled up during this period
      if (remainingXp >= xpNeededForLevelUp) {
        // They completed at least one level - calculate progress into current/next level
        const completeLevels = Math.floor(remainingXp / 100); // Each level needs 100 XP
        remainingXp = remainingXp % 100; // XP progress into the current level
        progressPercentage = remainingXp; // This represents percentage since each level is 100 XP
      } else {
        // They didn't level up - show progress toward next level
        progressPercentage = (remainingXp / xpNeededForLevelUp) * 100;
      }
      
      const finalPercentage = Math.min(100, Math.max(0, Math.round(progressPercentage)));
      console.log('📊 Final level progress percentage:', finalPercentage);
      
      return finalPercentage;
    } catch (error) {
      console.error('Error calculating level progress:', error);
      return null; // Data not available
    }
  }, [isGuestMode, xpHistoryData, xpLoading, chartPeriod, displayUser?.level]);

  // Show loading state if user data is still loading
  if (!isGuestMode && (isLoading || !character?.name || goldLoading || xpLoading)) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32 bg-slate-700" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 bg-slate-700" />
            <Skeleton className="h-8 w-16 bg-slate-700" />
          </div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20">
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Skeleton className="h-8 w-32 bg-slate-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 shadow-2xl transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-yellow-400">Progress Overview</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={chartPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setChartPeriod('week')}
            className={chartPeriod === 'week' 
              ? "bg-green-600 hover:bg-green-700 text-white border-green-500/30" 
              : "bg-transparent border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            }
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={chartPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setChartPeriod('month')}
            className={chartPeriod === 'month' 
              ? "bg-green-600 hover:bg-green-700 text-white border-green-500/30" 
              : "bg-transparent border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            }
          >
            Month
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20 mb-6 transition-all duration-300 ease-in-out">
        {hasXpData ? (
          <>
            <div className="mb-3">
              <span className="text-green-400 text-sm font-medium">
                XP Earned {chartPeriod === 'week' ? 'This Week' : 'This Month'}
              </span>
            </div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart 
                data={currentData}
                width={undefined}
                height={200}
              >
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  domain={[0, 'dataMax']}
                  allowDataOverflow={false}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelStyle={{ color: '#f1f5f9' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #10b981',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#xpGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-center">
            <div className="text-slate-400 mb-2">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium mb-1">No XP Data Yet</p>
              <p className="text-sm">
                You haven't earned any XP yet. Start completing quests to track your progress here!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View More Stats Button */}
    </div>
  );
});

export default XPProgressChart;