import React from 'react';
import { Flame, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStreaks } from '@/hooks/useStreaksWrapper';

const StreaksSection = () => {
  const { streaks, loading } = useStreaks();

  if (loading) {
    return (
      <Card className="bg-slate-900 border border-slate-700/50">
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
    <Card className="bg-slate-900 border border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Your Streaks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Three streak cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Streak */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-500/30">
            <div className="text-center">
              <div className="p-2 bg-orange-500/20 rounded-full mx-auto w-fit mb-3">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-orange-400 text-sm font-medium mb-1">Current Streak</div>
              <div className="text-3xl font-bold text-white">
                {currentStreak}
              </div>
              <div className="text-sm text-orange-300">days</div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="text-center">
              <div className="p-2 bg-yellow-500/20 rounded-full mx-auto w-fit mb-3">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-yellow-400 text-sm font-medium mb-1">Longest Streak</div>
              <div className="text-3xl font-bold text-white">
                {longestStreak}
              </div>
              <div className="text-sm text-yellow-300">days</div>
            </div>
          </div>

          {/* Active Streaks Count */}
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="text-center">
              <div className="p-2 bg-purple-500/20 rounded-full mx-auto w-fit mb-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm font-medium mb-1">Active Streaks</div>
              <div className="text-3xl font-bold text-white">
                {streaks.filter(s => s.status === 'Active').length}
              </div>
              <div className="text-sm text-purple-300">running</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreaksSection;