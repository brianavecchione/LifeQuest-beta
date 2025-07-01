
import React, { useState } from 'react';
import { Trophy, Star, Flag, Crown, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Quest {
  id: string;
  name: string;
  status: 'Not started' | 'In Progress' | 'Completed';
  xp: number;
  type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
}

const QuestTracker = () => {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      name: 'Complete morning workout',
      status: 'Completed',
      xp: 50,
      type: 'Daily',
      priority: 'High'
    },
    {
      id: '2',
      name: 'Finish project proposal',
      status: 'In Progress',
      xp: 150,
      type: 'Main',
      priority: 'High'
    },
    {
      id: '3',
      name: 'Read 30 pages',
      status: 'Not started',
      xp: 30,
      type: 'Side',
      priority: 'Medium'
    },
    {
      id: '4',
      name: 'Launch new product',
      status: 'In Progress',
      xp: 500,
      type: 'Legendary',
      priority: 'High'
    }
  ]);

  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-600 hover:bg-green-700';
      case 'In Progress': return 'bg-blue-600 hover:bg-blue-700';
      case 'Not started': return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'Daily': return <Star className="w-4 h-4" />;
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'Daily': return 'border-yellow-500/50 text-yellow-400';
      case 'Main': return 'border-red-500/50 text-red-400';
      case 'Side': return 'border-blue-500/50 text-blue-400';
      case 'Legendary': return 'border-purple-500/50 text-purple-400';
    }
  };

  const getPriorityColor = (priority: Quest['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
    }
  };

  const toggleQuestStatus = (questId: string) => {
    setQuests(quests.map(quest => {
      if (quest.id === questId) {
        const statusOrder: Quest['status'][] = ['Not started', 'In Progress', 'Completed'];
        const currentIndex = statusOrder.indexOf(quest.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...quest, status: statusOrder[nextIndex] };
      }
      return quest;
    }));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold text-emerald-400">Tracked Quests</h3>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1" />
          New Quest
        </Button>
      </div>

      <div className="space-y-3">
        {quests.map((quest) => (
          <div key={quest.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleQuestStatus(quest.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(quest.status)}`}
                >
                  {quest.status}
                </button>
                
                <div className={`p-2 rounded-lg border ${getTypeColor(quest.type)} bg-slate-800/50`}>
                  {getTypeIcon(quest.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium">{quest.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                      {quest.xp} XP
                    </Badge>
                    <Badge variant="outline" className={`${getTypeColor(quest.type)} border-current`}>
                      {quest.type}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(quest.priority)}`} title={`${quest.priority} Priority`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-slate-400 text-sm">
        Total XP Available: <span className="text-amber-400 font-bold">730</span>
      </div>
    </div>
  );
};

export default QuestTracker;
