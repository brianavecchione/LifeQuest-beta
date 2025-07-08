
import React, { useState } from 'react';
import { Crown, Trophy, Star, TrendingUp, Calendar, Loader2, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '@/contexts/UserContext';
import { useStreaks } from '@/hooks/useStreaks';

interface CharacterStatsProps {
  character: {
    name: string;
    level: number;
    xp: number;
    xpToNext: number;
    totalXp: number;
    gold: number;
    avatar: string;
  };
}

const CharacterStats = ({ character }: CharacterStatsProps) => {
  const { getDailyXpData, getWeeklyXpData, isLoading } = useUser();
  const { getBestStreak, loading: streaksLoading } = useStreaks();
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const xpProgress = (character.xp / character.xpToNext) * 100;
  
  const bestStreak = getBestStreak();

  // Get real XP data with fallback for safety - MUST call hooks before any conditional returns
  const weeklyXpData = React.useMemo(() => {
    try {
      return getDailyXpData();
    } catch (error) {
      console.error('Error getting daily XP data:', error);
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
  }, [getDailyXpData]);

  const monthlyXpData = React.useMemo(() => {
    try {
      return getWeeklyXpData();
    } catch (error) {
      console.error('Error getting weekly XP data:', error);
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
  
  // Check if user has any XP data
  const hasXpData = currentData.some(item => item.xp > 0);

  // Show loading state if user data is still loading or if user has no name yet
  if (isLoading || !character.name) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Info Loading */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-24 h-24 rounded-full bg-slate-700" />
              <div>
                <Skeleton className="h-8 w-32 mb-2 bg-slate-700" />
                <Skeleton className="h-6 w-24 bg-slate-700" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-5 w-24 bg-slate-700" />
                  <Skeleton className="h-5 w-16 bg-slate-700" />
                </div>
                <Skeleton className="h-3 w-full bg-slate-700" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Skeleton className="h-20 bg-slate-700" />
                <Skeleton className="h-20 bg-slate-700" />
                <Skeleton className="h-20 bg-slate-700" />
              </div>
            </div>
          </div>
          
          {/* Chart Loading */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-24 bg-slate-700" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 bg-slate-700" />
                <Skeleton className="h-8 w-16 bg-slate-700" />
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/20">
              <div className="h-[200px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Character Info Section */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            {character.avatar.startsWith('data:') || character.avatar.startsWith('http') ? (
              <img 
                src={character.avatar} 
                alt={character.name} 
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-amber-400/30"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg">
                {character.avatar}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-amber-400 mb-1">{character.name}</h2>
              <div className="flex items-center gap-2 text-yellow-300">
                <Crown className="w-5 h-5" />
                <span className="text-lg font-semibold">Level {character.level}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 font-medium">Level Progress</span>
                <span className="text-amber-400 font-bold">{character.xp}/{character.xpToNext} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-slate-700">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
              </Progress>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-red-500/30">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
                  <span className="text-red-400 text-sm font-medium">Total XP</span>
                </div>
                <div className="text-xl font-bold text-white">{character.totalXp}</div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-yellow-500/30">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-yellow-400 text-sm font-medium">Gold</span>
                </div>
                <div className="text-xl font-bold text-white">{character.gold}</div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-purple-500/30 cursor-help">
                      <div className="flex items-center justify-center mb-1">
                        <Flame className="w-4 h-4 text-purple-400 mr-1" />
                        <span className="text-purple-400 text-sm font-medium">Streak</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {streaksLoading ? '...' : bestStreak.current_streak}
                      </div>
                      <div className="text-xs text-purple-300">
                        {streaksLoading ? '' : bestStreak.current_streak === 1 ? 'Day' : 'Days'}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-800 border-purple-500/30">
                    <p className="text-sm">
                      {bestStreak.current_streak > 0 
                        ? `You've completed at least one quest every day for the past ${bestStreak.current_streak} ${bestStreak.current_streak === 1 ? 'day' : 'days'}!`
                        : 'Complete a quest to start your streak!'
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* XP Progress Chart Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-green-400">XP Progress</h3>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={chartPeriod === 'week' ? 'default' : 'outline'}
                onClick={() => setChartPeriod('week')}
                className="bg-green-600 hover:bg-green-700 text-xs"
              >
                Week
              </Button>
              <Button
                size="sm"
                variant={chartPeriod === 'month' ? 'default' : 'outline'}
                onClick={() => setChartPeriod('month')}
                className="bg-green-600 hover:bg-green-700 text-xs"
              >
                Month
              </Button>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/20">
            {hasXpData ? (
              <>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <AreaChart data={currentData}>
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
                    />
                  </AreaChart>
                </ChartContainer>
                
                <div className="mt-2 text-center">
                  <span className="text-slate-400 text-sm">
                    {chartPeriod === 'week' ? 'Daily XP Earned This Week' : 'Weekly XP Earned This Month'}
                  </span>
                </div>
              </>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center">
                <div className="text-slate-400 mb-2">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">No XP Data Yet</p>
                  <p className="text-sm">
                    You haven't earned any XP yet. Start completing quests to track your progress here!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
