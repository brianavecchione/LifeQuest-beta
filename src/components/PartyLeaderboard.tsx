
import React, { useState } from 'react';
import { Trophy, Medal, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePartyData } from '@/hooks/usePartyDataWrapper';

const PartyLeaderboard = () => {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');
  const { leaderboard, partyMembers, leaderboardLoading } = usePartyData();

  // Get member details for leaderboard display
  const getMemberDetails = (userId: string) => {
    return partyMembers.find(m => m.user_id === userId) || { username: 'Unknown', level: 1 };
  };

  // Sort leaderboard by XP earned
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp_earned - a.xp_earned);

  if (leaderboardLoading) {
    return (
      <div className="bg-component-background rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-yellow-400">Party Leaderboard</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

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
      case 1: return 'border-yellow-500/50 bg-yellow-500/10';
      case 2: return 'border-gray-400/50 bg-gray-400/10';
      case 3: return 'border-amber-600/50 bg-amber-600/10';
      default: return 'border-component-border bg-component-muted/50';
    }
  };

  return (
    <div className="bg-component-background rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
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

      {sortedLeaderboard.length > 0 ? (
        <>
          <div className="space-y-3">
            {sortedLeaderboard.map((member, index) => {
              const rank = index + 1;
              const memberDetails = getMemberDetails(member.user_id);
              
              return (
                <div key={member.id} className={`flex items-center gap-4 p-4 rounded-lg border ${getRankColor(rank)} transition-all hover:border-opacity-70`}>
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(rank)}
                  </div>
                  
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                      {memberDetails.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{memberDetails.username}</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400/50 text-xs">
                        Level {memberDetails.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span>{member.quests_completed} quests completed</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-400">{member.xp_earned}</div>
                    <div className="text-xs text-slate-400">XP earned</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <div className="text-center text-slate-300 text-sm">
              <strong>Party Total:</strong> {sortedLeaderboard.reduce((sum, member) => sum + member.xp_earned, 0)} XP this {timePeriod}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">No leaderboard data</p>
          <p className="text-slate-500 text-sm">Join a party to see member rankings here.</p>
        </div>
      )}
    </div>
  );
};

export default PartyLeaderboard;
