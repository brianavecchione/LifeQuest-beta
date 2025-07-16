
import React from 'react';
import { Crown, Users, TrendingUp, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { usePartyData } from '@/hooks/usePartyDataWrapper';

const PartyDashboard = () => {
  const { userParty, partyMembers, isInParty, loading } = usePartyData();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-600/30 shadow-2xl text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading party data...</p>
      </div>
    );
  }

  if (!isInParty || !userParty) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-600/30 shadow-2xl text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-muted-foreground mb-2">No Party Yet</h2>
        <p className="text-muted-foreground">Join or create a party to start collaborating with other adventurers!</p>
      </div>
    );
  }

  const progressPercentage = (userParty.total_xp / userParty.party_goal_xp) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-600/30 shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-400 mb-1">{userParty.party_name}</h2>
          <p className="text-slate-300">{userParty.party_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Party Progress */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-medium">Party Goal Progress</span>
              <span className="text-purple-400 font-bold">{userParty.total_xp}/{userParty.party_goal_xp} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-slate-700">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </Progress>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-purple-500/30">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-purple-400 text-sm font-medium">Total XP</span>
              </div>
              <div className="text-lg font-bold text-white">{userParty.total_xp}</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-green-500/30">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm font-medium">Quests</span>
              </div>
              <div className="text-lg font-bold text-white">{userParty.total_quests_completed}</div>
            </div>
          </div>
        </div>

        {/* Party Members */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-slate-300" />
            <span className="text-slate-300 font-medium">Active Members ({partyMembers.filter(m => m.is_active).length})</span>
          </div>
          <div className="space-y-2">
            {partyMembers.slice(0, 4).map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm">
                    {member.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{member.username}</span>
                    {member.role === 'Leader' && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                    {!member.is_active && (
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-500">Inactive</Badge>
                    )}
                  </div>
                  <div className="text-slate-400 text-xs">Level {member.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-400">{member.xp}</div>
                  <div className="text-xs text-slate-400">XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyDashboard;
