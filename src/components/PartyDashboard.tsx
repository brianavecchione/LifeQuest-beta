
import React from 'react';
import { Crown, Users, TrendingUp, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const PartyDashboard = () => {
  const partyData = {
    name: "Dragon Slayers",
    description: "Elite adventurers conquering the toughest challenges together!",
    totalXp: 15420,
    xpToNext: 20000,
    questsCompleted: 127,
    members: [
      { id: '1', name: 'Alexander', level: 12, xp: 3420, isLeader: true, avatar: null },
      { id: '2', name: 'Sarah', level: 11, xp: 3180, isLeader: false, avatar: null },
      { id: '3', name: 'Mike', level: 10, xp: 2890, isLeader: false, avatar: null },
      { id: '4', name: 'Emma', level: 13, xp: 3930, isLeader: false, avatar: null },
      { id: '5', name: 'David', level: 9, xp: 2000, isLeader: false, avatar: null }
    ]
  };

  const progressPercentage = (partyData.totalXp / partyData.xpToNext) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-600/30 shadow-2xl">
      {/* Party Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          DS
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-purple-400 mb-1">{partyData.name}</h2>
          <p className="text-slate-300 text-sm">{partyData.description}</p>
        </div>
      </div>

      {/* Party Stats */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-medium">Party Progress</span>
          <span className="text-purple-400 font-bold">{partyData.totalXp}/{partyData.xpToNext} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-3 bg-slate-700">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
        </Progress>
      </div>

      {/* Party Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-purple-500/30">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-purple-400 mr-1" />
            <span className="text-purple-400 text-sm font-medium">Members</span>
          </div>
          <div className="text-xl font-bold text-white">{partyData.members.length}</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-green-500/30">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400 text-sm font-medium">Total XP</span>
          </div>
          <div className="text-xl font-bold text-white">{partyData.totalXp}</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-yellow-500/30">
          <div className="flex items-center justify-center mb-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 text-sm font-medium">Quests</span>
          </div>
          <div className="text-xl font-bold text-white">{partyData.questsCompleted}</div>
        </div>
      </div>

      {/* Member List */}
      <div>
        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Party Members
        </h3>
        <div className="space-y-3">
          {partyData.members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{member.name}</span>
                  {member.isLeader && (
                    <Crown className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-purple-400 border-purple-400/50 text-xs">
                    Level {member.level}
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs">
                    {member.xp} XP
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartyDashboard;
