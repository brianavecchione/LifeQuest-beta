import React, { useState, useEffect } from 'react';
import { Coins, CheckCircle2, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';
import { useQuests } from '@/hooks/useQuestsWrapper';
import { useDailyGold } from '@/hooks/useDailyGoldWrapper';
import { useDailyXp } from '@/hooks/useDailyXpWrapper';
import { useArchivedQuests } from '@/hooks/useArchivedQuests';
import { calculateGoldThisWeek, calculateGoldThisMonth, calculateQuestsCompletedThisWeek, calculateQuestsCompletedThisMonth, calculateXpThisWeek, calculateXpThisMonth, getCurrentWeekBounds, getCurrentMonthBounds } from '@/utils/timezone';

const StatsSection = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const { user: character } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { balance } = useUserBalance();
  const { quests } = useQuests();
  const { dailyGoldData } = useDailyGold();
  const { dailyXpData } = useDailyXp();
  const { archivedQuests, fetchArchivedQuests, loading: archivedLoading } = useArchivedQuests();

  const user = isGuestMode ? guestUser : character;

  // Fetch archived quests for the selected period
  useEffect(() => {
    if (!isGuestMode && user) {
      const bounds = period === 'week' ? getCurrentWeekBounds() : getCurrentMonthBounds();
      fetchArchivedQuests(bounds.start, bounds.end);
    }
  }, [period, user, isGuestMode, fetchArchivedQuests]);

  // Combine current and archived quests for accurate counting
  const allQuests = React.useMemo(() => {
    if (isGuestMode) return quests;
    
    // Transform archived quests to match expected format
    const transformedArchivedQuests = archivedQuests.map(archived => ({
      id: archived.id,
      completed_at: archived.completed_at,
      status: 'Completed' as const,
      quest_name: archived.quest_name,
      quest_type: archived.quest_type,
      xp_reward: archived.xp_reward,
      gold_reward: archived.gold_reward
    }));
    
    return [...quests, ...transformedArchivedQuests];
  }, [quests, archivedQuests, isGuestMode]);

  // Debug logging for data accuracy
  React.useEffect(() => {
    console.log('📊 StatsSection Debug - Raw Data:', {
      period,
      dailyXpData,
      dailyGoldData,
      quests: quests.filter(q => q.status === 'Completed' && q.completed_at),
      isGuestMode
    });
  }, [period, dailyXpData, dailyGoldData, quests, isGuestMode]);

  // Convert data formats for calculations
  const goldHistoryFormatted = dailyGoldData.map(day => ({
    date: day.fullDate || day.date,
    gold_earned: day.gold
  }));

  const xpHistoryFormatted = dailyXpData.map(day => ({
    date: day.fullDate || day.date,
    xp_earned: day.xp
  }));

  // Helper function for graceful fallbacks
  const getDisplayValue = (value: number | null | undefined, isLoading: boolean): string => {
    if (isLoading) return '—';
    if (value === null || value === undefined || isNaN(value)) return '—';
    return value.toString();
  };

  // Calculate stats based on period - using combined quest data
  const goldEarnedThisPeriod = period === 'week' 
    ? calculateGoldThisWeek(goldHistoryFormatted) 
    : calculateGoldThisMonth(goldHistoryFormatted);

  const questsCompletedThisPeriod = period === 'week' 
    ? calculateQuestsCompletedThisWeek(allQuests) 
    : calculateQuestsCompletedThisMonth(allQuests);

  const xpEarnedThisPeriod = period === 'week' 
    ? calculateXpThisWeek(xpHistoryFormatted) 
    : calculateXpThisMonth(xpHistoryFormatted);

  // Debug logging for calculated values
  React.useEffect(() => {
    console.log('📊 StatsSection Debug - Calculated Values:', {
      period,
      goldEarnedThisPeriod,
      questsCompletedThisPeriod,
      xpEarnedThisPeriod,
      allQuestsCount: allQuests.length,
      currentQuestsCount: quests.length,
      archivedQuestsCount: archivedQuests.length,
      archivedLoading
    });
  }, [period, goldEarnedThisPeriod, questsCompletedThisPeriod, xpEarnedThisPeriod, allQuests, archivedQuests, archivedLoading]);

  // Calculate XP required to reach next level (using level * 100 as base XP per level)
  const currentLevel = user?.level || 1;
  const xpRequiredForNextLevel = currentLevel * 100; // XP needed to go from current level to next
  
  // Calculate level progress percentage based on XP earned this period vs XP required for next level
  const levelProgressThisPeriod = xpRequiredForNextLevel > 0 ? 
    Math.min(Math.round((xpEarnedThisPeriod / xpRequiredForNextLevel) * 100), 100) : 0;

  const periodLabel = period === 'week' ? 'Weekly' : 'Monthly';

  return (
    <Card className="bg-slate-900 border border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {periodLabel} Progress
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={period === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('week')}
              className="text-xs"
            >
              Week
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('month')}
              className="text-xs"
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Four metric cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* XP Earned */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-500/30">
            <div className="text-center">
              <div className="p-2 bg-blue-500/20 rounded-full mx-auto w-fit mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-blue-400 text-sm font-medium mb-1">XP Earned</div>
              <div className="text-2xl font-bold text-white">
                {getDisplayValue(xpEarnedThisPeriod, archivedLoading)}
              </div>
              <div className="text-xs text-slate-400">
                {`This ${period === 'week' ? 'Week' : 'Month'}`}
              </div>
            </div>
          </div>

          {/* Gold Earned */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="text-center">
              <div className="p-2 bg-yellow-500/20 rounded-full mx-auto w-fit mb-3">
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-yellow-400 text-sm font-medium mb-1">Gold Earned</div>
              <div className="text-2xl font-bold text-white">
                {getDisplayValue(goldEarnedThisPeriod, archivedLoading)}
              </div>
              <div className="text-xs text-slate-400">
                {`This ${period === 'week' ? 'Week' : 'Month'}`}
              </div>
            </div>
          </div>

          {/* Quests Completed */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="text-center">
              <div className="p-2 bg-green-500/20 rounded-full mx-auto w-fit mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-green-400 text-sm font-medium mb-1">Quests Completed</div>
              <div className="text-2xl font-bold text-white">
                {getDisplayValue(questsCompletedThisPeriod, archivedLoading)}
              </div>
              <div className="text-xs text-slate-400">
                {`This ${period === 'week' ? 'Week' : 'Month'}`}
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="text-center">
              <div className="p-2 bg-purple-500/20 rounded-full mx-auto w-fit mb-3">
                <div className="w-5 h-5 rounded-full border-2 border-purple-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-purple-400 text-sm font-medium mb-1">Level Progress</div>
              <div className="text-2xl font-bold text-white">
                {archivedLoading ? '—' : `${levelProgressThisPeriod}%`}
              </div>
              <div className="text-xs text-slate-400">
                {levelProgressThisPeriod === 0
                  ? `No progress this ${period}`
                  : `Toward Level ${currentLevel + 1}`
                }
              </div>
              <Progress 
                value={levelProgressThisPeriod} 
                className="h-2 bg-slate-600/50 mt-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSection;