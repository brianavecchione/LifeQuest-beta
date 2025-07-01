
import React, { useState } from 'react';
import { Trophy, Target, Flame, Calendar, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AchievementsSection = () => {
  const [currentTab, setCurrentTab] = useState<'achievements' | 'streaks'>('achievements');

  const achievements = [
    {
      name: 'Quest Initiate',
      description: 'Complete your first 10 quests',
      progress: 10,
      total: 10,
      completed: true,
      icon: '🏆',
      rarity: 'Bronze',
      xpReward: 100
    },
    {
      name: 'Focus Master',
      description: 'Complete 5 hours of focused work',
      progress: 3,
      total: 5,
      completed: false,
      icon: '🎯',
      rarity: 'Silver',
      xpReward: 250
    },
    {
      name: 'Legend in Making',
      description: 'Complete 100 total quests',
      progress: 47,
      total: 100,
      completed: false,
      icon: '👑',
      rarity: 'Gold',
      xpReward: 500
    }
  ];

  const streaks = [
    {
      name: 'Daily Quester',
      description: 'Complete at least one quest daily',
      currentStreak: 7,
      bestStreak: 12,
      icon: '🔥',
      active: true
    },
    {
      name: 'Focus Warrior',
      description: 'Use quest timer daily',
      currentStreak: 3,
      bestStreak: 8,
      icon: '⏰',
      active: true
    },
    {
      name: 'XP Hunter',
      description: 'Earn 100+ XP daily',
      currentStreak: 0,
      bestStreak: 5,
      icon: '⭐',
      active: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Bronze': return 'bg-amber-700';
      case 'Silver': return 'bg-slate-500';
      case 'Gold': return 'bg-yellow-500';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-emerald-400">Achievements & Milestones</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab('achievements')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'achievements' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Target className="w-4 h-4 mr-1 inline" />
              Achievements
            </button>
            <button
              onClick={() => setCurrentTab('streaks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'streaks' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Flame className="w-4 h-4 mr-1 inline" />
              Streaks
            </button>
          </div>
        </div>

        {currentTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`rounded-lg p-4 border transition-all ${
                achievement.completed 
                  ? 'bg-emerald-900/30 border-emerald-500/50' 
                  : 'bg-slate-700/50 border-slate-600/50'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${achievement.completed ? '' : 'opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-bold">{achievement.name}</h4>
                      <Badge className={`${getRarityColor(achievement.rarity)} text-white`}>
                        {achievement.rarity}
                      </Badge>
                      {achievement.completed && (
                        <Badge className="bg-emerald-600 text-white">
                          +{achievement.xpReward} XP
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(achievement.progress / achievement.total) * 100} className="flex-1 h-2" />
                      <span className="text-slate-400 text-sm">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'streaks' && (
          <div className="space-y-4">
            {streaks.map((streak, index) => (
              <div key={index} className={`rounded-lg p-4 border transition-all ${
                streak.active 
                  ? 'bg-orange-900/30 border-orange-500/50' 
                  : 'bg-slate-700/50 border-slate-600/50'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${streak.active ? '' : 'opacity-50'}`}>
                    {streak.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-bold">{streak.name}</h4>
                      {streak.active && (
                        <Badge className="bg-orange-600 text-white">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{streak.description}</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-medium">
                          Current: {streak.currentStreak}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">
                          Best: {streak.bestStreak}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsSection;
