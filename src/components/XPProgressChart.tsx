import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';

const XPProgressChart = () => {
  const { user: character, getDailyXpData, getWeeklyXpData, isLoading } = useUser();
  const { isGuestMode, guestUser } = useGuest();
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

  // Show loading state if user data is still loading
  if (!isGuestMode && (isLoading || !character.name)) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32 bg-slate-700" />
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
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-bold text-green-400">Progress Over Time</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={chartPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setChartPeriod('week')}
            className="bg-green-600 hover:bg-green-700 text-xs border-green-500/30"
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={chartPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setChartPeriod('month')}
            className="bg-green-600 hover:bg-green-700 text-xs border-green-500/30"
          >
            Month
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/20">
        {hasXpData ? (
          <>
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
            
            <div className="mt-3 text-center">
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
  );
};

export default XPProgressChart;