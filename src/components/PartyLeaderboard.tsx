
import React, { useState } from 'react';
import { Trophy, Medal, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PartyLeaderboard = () => {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');

  const weeklyLeaderboard = [
    { id: '1', name: 'Emma', xp: 520, level: 13, questsCompleted: 8, avatar: null },
    { id: '2', name: 'Alexander', xp: 485, level: 12, questsCompleted: 7, avatar: null },
    { id: '3', name: 'Sarah', xp: 470, level: 11, questsCompleted: 9, avatar: null },
    { id: '4', name: 'Mike', xp: 440, level: 10, questsCompleted: 6, avatar: null },
    { id: '5', name: 'David', xp: 380, level: 9, questsCompleted: 5, avatar: null }
  ];

  const monthlyLeaderboard = [
    { id: '1', name: 'Alexander', xp: 2150, level: 12, questsCompleted: 28, avatar: null },
    { id: '2', name: 'Emma', xp: 2080, level: 13, questsCompleted: 32, avatar: null },
    { id: '3', name: 'Sarah', xp: 1950, level: 11, questsCompleted: 31, avatar: null },
    { id: '4', name: 'Mike', xp: 1820, level: 10, questsCompleted: 24, avatar: null },
    { id: '5', name: 'David', xp: 1650, level: 9, questsCompleted: 22, avatar: null }
  ];

  const currentLeaderboard = timePeriod === 'week' ? weeklyLeaderboard : monthlyLeaderboard;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-slate-400 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'border-yellow-500/50 bg-yellow-900/20';
      case 2: return 'border-gray-400/50 bg-gray-900/20';
      case 3: return 'border-amber-600/50 bg-amber-900/20';
      default: return 'border-slate-500/50 bg-slate-900/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-yellow-400">Party Leaderboard</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={timePeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setTimePeriod('week')}
            className="bg-yellow-600 hover:bg-yellow-700 text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Week
          </Button>
          <Button
            size="sm"
            variant={timePeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setTimePeriod('month')}
            className="bg-yellow-600 hover:bg-yellow-700 text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Month
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {currentLeaderboard.map((member, index) => {
          const rank = index + 1;
          
          return (
            <div key={member.id} className={`flex items-center gap-4 p-4 rounded-lg border ${getRankColor(rank)} transition-all hover:border-opacity-70`}>
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>
              
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">{member.name}</span>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/50 text-xs">
                    Level {member.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span>{member.questsCompleted} quests completed</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400">{member.xp}</div>
                <div className="text-xs text-slate-400">XP earned</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <div className="text-center text-slate-300 text-sm">
          <strong>Party Total:</strong> {currentLeaderboard.reduce((sum, member) => sum + member.xp, 0)} XP this {timePeriod}
        </div>
      </div>
    </div>
  );
};

export default PartyLeaderboard;
