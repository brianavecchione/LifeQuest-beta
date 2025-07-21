import React, { useState } from 'react';
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
import { calculateGoldThisWeek, calculateQuestsCompletedThisWeek, calculateXpThisWeek, calculateXpThisMonth } from '@/utils/timezone';

const StatsSection = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const { user: character } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { balance } = useUserBalance();
  const { quests } = useQuests();
  const { dailyGoldData } = useDailyGold();
  const { dailyXpData } = useDailyXp();

  const user = isGuestMode ? guestUser : character;

  // Calculate stats based on period
  const goldEarnedThisPeriod = period === 'week' 
    ? calculateGoldThisWeek(dailyGoldData) 
    : null; // Add month calculation if needed

  const questsCompletedThisPeriod = period === 'week' 
    ? calculateQuestsCompletedThisWeek(quests) 
    : null; // Add month calculation if needed

  const xpEarnedThisPeriod = period === 'week' 
    ? calculateXpThisWeek(dailyXpData) 
    : calculateXpThisMonth(dailyXpData);

  // Calculate level progress percentage
  const levelProgressThisPeriod = user?.level ? 
    Math.round((xpEarnedThisPeriod / (user.level * 100)) * 100) : 0;

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
                {xpEarnedThisPeriod === null ? '—' : xpEarnedThisPeriod}
              </div>
              <div className="text-xs text-slate-400">
                {xpEarnedThisPeriod === null ? 'Data not available' : `This ${period === 'week' ? 'Week' : 'Month'}`}
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
                {goldEarnedThisPeriod === null ? '—' : goldEarnedThisPeriod}
              </div>
              <div className="text-xs text-slate-400">
                {goldEarnedThisPeriod === null ? 'Data not available' : `This ${period === 'week' ? 'Week' : 'Month'}`}
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
                {questsCompletedThisPeriod === null ? '—' : questsCompletedThisPeriod}
              </div>
              <div className="text-xs text-slate-400">
                {questsCompletedThisPeriod === null ? 'Data not available' : `This ${period === 'week' ? 'Week' : 'Month'}`}
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
                {levelProgressThisPeriod === null ? '—' : `${Math.min(levelProgressThisPeriod, 100)}%`}
              </div>
              <div className="text-xs text-slate-400">
                {levelProgressThisPeriod === null 
                  ? 'Data not available' 
                  : levelProgressThisPeriod === 0
                  ? `No progress this ${period}`
                  : `This ${period === 'week' ? 'Week' : 'Month'}`
                }
              </div>
              {levelProgressThisPeriod !== null && (
                <Progress 
                  value={Math.min(levelProgressThisPeriod, 100)} 
                  className="h-2 bg-slate-600/50 mt-2"
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSection;