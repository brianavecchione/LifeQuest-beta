
import React from 'react';
import { Crown, Trophy, Star, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CharacterStatsProps {
  character: {
    name: string;
    level: number;
    xp: number;
    xpToNext: number;
    totalXp: number;
    gold: number;
  };
}

const CharacterStats = ({ character }: CharacterStatsProps) => {
  const xpProgress = (character.xp / character.xpToNext) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg">
          {character.name.charAt(0)}
        </div>
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

          <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-purple-500/30">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-purple-400 mr-1" />
              <span className="text-purple-400 text-sm font-medium">Range</span>
            </div>
            <div className="text-xl font-bold text-white">1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
