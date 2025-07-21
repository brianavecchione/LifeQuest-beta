import React from 'react';
import { Flame, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStreaks } from '@/hooks/useStreaksWrapper';

const StreaksSection = () => {
  const { streaks, loading } = useStreaks();

  if (loading) {
    return (
      <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Your Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-400">Loading streaks...</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate current and longest streaks
  const currentStreak = Math.max(...streaks.map(streak => streak.current_streak || 0), 0);
  const longestStreak = Math.max(...streaks.map(streak => streak.best_streak || 0), 0);

  return (
    <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Your Streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-full">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-orange-400 text-sm font-medium">Current Streak</div>
              <div className="text-3xl font-bold text-white">
                {currentStreak}
                <span className="text-lg text-orange-300 ml-1">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-lg p-4 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-full">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-yellow-400 text-sm font-medium">Longest Streak</div>
              <div className="text-3xl font-bold text-white">
                {longestStreak}
                <span className="text-lg text-yellow-300 ml-1">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Streaks Count */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-purple-400 text-sm font-medium">Active Streaks</div>
              <div className="text-3xl font-bold text-white">
                {streaks.filter(s => s.status === 'Active').length}
                <span className="text-lg text-purple-300 ml-1">running</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreaksSection;