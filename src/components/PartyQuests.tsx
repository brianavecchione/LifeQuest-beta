
import React from 'react';
import { Target, CheckCircle, Clock, Crown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PartyQuests = () => {
  // Empty array - all data should come from database
  const partyQuests: any[] = [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'active': return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Target className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/50 bg-green-900/20';
      case 'active': return 'border-blue-500/50 bg-blue-900/20';
      default: return 'border-slate-500/50 bg-slate-900/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-blue-400">Party Quests</h3>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Create Quest
        </Button>
      </div>

      {partyQuests.length > 0 ? (
        <div className="space-y-4">
          {partyQuests.map((quest) => {
            const progressPercentage = (quest.progress / quest.target) * 100;
            
            return (
              <div key={quest.id} className={`p-4 rounded-lg border ${getStatusColor(quest.status)} transition-all hover:border-opacity-70`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(quest.status)}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{quest.name}</h4>
                      <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                        {quest.xpReward} XP
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3">{quest.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-sm">Progress</span>
                        <span className="text-blue-400 font-medium text-sm">{quest.progress}/{quest.target}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 bg-slate-700">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                      </Progress>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Crown className="w-3 h-3" />
                        <span>Assigned by {quest.assignedBy}</span>
                      </div>
                      
                      {quest.completedBy.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">Completed by:</span>
                          <div className="flex -space-x-1">
                            {quest.completedBy.slice(0, 3).map((name, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800"
                                title={name}
                              >
                                {name.charAt(0)}
                              </div>
                            ))}
                            {quest.completedBy.length > 3 && (
                              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
                                +{quest.completedBy.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">No active party quests</p>
          <p className="text-slate-500 text-sm">Join a party to see collaborative quests here.</p>
        </div>
      )}
    </div>
  );
};

export default PartyQuests;
