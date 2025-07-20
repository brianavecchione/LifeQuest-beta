import React, { useState } from 'react';
import { TrendingUp, Loader2, Coins, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';
import { useQuests } from '@/hooks/useQuestsWrapper';

const XPProgressChart = () => {
  const { user: character, getDailyXpData, getWeeklyXpData, isLoading } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { balance } = useUserBalance();
  const { quests } = useQuests();
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  
  const activeUser = isGuestMode ? guestUser : character;

  // Get real or guest XP data with fallback for safety
  const weeklyXpData = React.useMemo(() => {
    if (isGuestMode) {
      // Generate mock data for guest mode
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const mockXp = Math.floor(Math.random() * 50) + 10; // Random XP between 10-60
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          xp: mockXp,
          day: date.toLocaleDateString('en-US', { weekday: 'long' })
        };
      });
    }
    
    try {
      const data = getDailyXpData();
      return data;
    } catch (error) {
      console.error('❌ Error getting daily XP data:', error);
      // Fallback to empty data
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          xp: 0,
          day: date.toLocaleDateString('en-US', { weekday: 'long' })
        };
      });
    }
  }, [isGuestMode, getDailyXpData, activeUser.totalXp]);

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
  }, [getWeeklyXpData]);

  const chartConfig = {
    xp: {
      label: "XP Earned",
      color: "hsl(var(--chart-1))",
    },
  };

  const currentData = chartPeriod === 'week' ? weeklyXpData : monthlyXpData;
  const hasXpData = currentData.some(item => item.xp > 0);

  // Calculate summary stats
  const goldEarned = React.useMemo(() => {
    if (isGuestMode) return Math.floor(Math.random() * 100) + 50; // Mock data for guest
    return balance?.total_gold_earned || 0;
  }, [isGuestMode, balance?.total_gold_earned]);

  const questsCompleted = React.useMemo(() => {
    if (isGuestMode) return Math.floor(Math.random() * 20) + 8; // Mock data for guest
    return quests.filter(q => q.status === 'Completed').length;
  }, [isGuestMode, quests]);

  const levelProgress = React.useMemo(() => {
    const currentLevel = activeUser.level || 1;
    const currentXP = activeUser.totalXp || 0;
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpForNextLevel = currentLevel * 100;
    const progressInLevel = currentXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    return Math.round((progressInLevel / xpNeededForLevel) * 100);
  }, [activeUser.level, activeUser.totalXp]);

  // Show loading state if user data is still loading
  if (!isGuestMode && (isLoading || !character.name)) {
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
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20">
              <Skeleton className="h-4 w-16 bg-slate-600 mb-2" />
              <Skeleton className="h-6 w-12 bg-slate-600 mb-1" />
              <Skeleton className="h-3 w-20 bg-slate-600" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20 shadow-2xl">
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
      <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20 mb-6">
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
                key={`xp-chart-${chartPeriod}`}
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
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                  animationBegin={0}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Gold Earned */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Gold</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{goldEarned}</div>
          <div className="text-xs text-slate-400">Gold Earned</div>
        </div>

        {/* Quests Completed */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Quests</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{questsCompleted}</div>
          <div className="text-xs text-slate-400">Completed</div>
        </div>

        {/* Level Progress */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-purple-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
            <span className="text-purple-400 text-sm font-medium">Level</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{Math.max(0, Math.min(100, levelProgress))}%</div>
          <div className="text-xs text-slate-400 mb-2">Progress</div>
          <Progress 
            value={Math.max(0, Math.min(100, levelProgress))} 
            className="h-2 bg-slate-600/50"
          />
        </div>
      </div>
    </div>
  );
};

export default XPProgressChart;