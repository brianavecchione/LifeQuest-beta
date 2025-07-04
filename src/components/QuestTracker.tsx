
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flag, Crown, Plus, Target, CheckCircle2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QuickDailySetup from './QuickDailySetup';

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
    },
    {
      id: '5',
      name: 'Drink 8 glasses of water',
      status: 'In Progress',
      xp: 25,
      type: 'Daily',
      priority: 'Medium'
    },
    {
      id: '6',
      name: 'Write in journal',
      status: 'Not started',
      xp: 20,
      type: 'Daily',
      priority: 'Low'
    }
  ]);

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [todaysFocus, setTodaysFocus] = useState<string[]>([]);
  const [showAddMoreQuests, setShowAddMoreQuests] = useState(false);

  // Check if all focused quests are completed
  useEffect(() => {
    if (todaysFocus.length > 0) {
      const focusedQuests = quests.filter(q => todaysFocus.includes(q.id));
      const allCompleted = focusedQuests.every(q => q.status === 'Completed');
      setShowAddMoreQuests(allCompleted);
    }
  }, [quests, todaysFocus]);

  // Separate quests by type
  const dailyQuests = quests.filter(quest => quest.type === 'Daily');
  const focusQuests = quests.filter(quest => 
    todaysFocus.includes(quest.id) && quest.type !== 'Daily'
  );
  const otherQuests = quests.filter(quest => 
    quest.type !== 'Daily' && !todaysFocus.includes(quest.id)
  );

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

  const handleDailySetup = (selectedQuestIds: string[]) => {
    setTodaysFocus(selectedQuestIds);
  };

  const renderQuestCard = (quest: Quest, showCompleteIcon = false) => (
    <div key={quest.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showCompleteIcon && quest.status === 'Completed' && (
            <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
          )}
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
  );

  return (
    <div className="space-y-6">
      {/* Today's Focus Section */}
      {todaysFocus.length > 0 && (
        <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-xl p-6 border border-amber-600/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-400">Today's Focus</h3>
            </div>
            {showAddMoreQuests && (
              <Button 
                size="sm" 
                onClick={() => setIsSetupModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 animate-pulse"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add More Quests
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {focusQuests.map((quest) => renderQuestCard(quest, true))}
          </div>
          
          {showAddMoreQuests && (
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-600/30 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium">🎉 Focus Complete!</p>
              <p className="text-green-300 text-sm">Great job finishing your daily focus. Ready for more?</p>
            </div>
          )}
        </div>
      )}

      {/* Main Quest Tracker */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-emerald-400">All Quests</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsSetupModalOpen(true)}
              className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
            >
              <Target className="w-4 h-4 mr-1" />
              Quick Daily Setup
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-1" />
              New Quest
            </Button>
          </div>
        </div>

        {/* Other Quests (non-daily, non-focused) */}
        {otherQuests.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-lg font-semibold text-slate-300">Main & Side Quests</h4>
            {otherQuests.map((quest) => renderQuestCard(quest))}
          </div>
        )}

        {/* Daily Quests Sidebar */}
        {dailyQuests.length > 0 && (
          <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-600/30">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-semibold text-yellow-400">Daily Habits</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dailyQuests.map((quest) => renderQuestCard(quest))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center text-slate-400 text-sm">
          Total XP Available: <span className="text-amber-400 font-bold">
            {quests.reduce((total, quest) => total + quest.xp, 0)}
          </span>
        </div>
      </div>

      {/* Quick Daily Setup Modal */}
      <QuickDailySetup
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        quests={quests}
        onSetupComplete={handleDailySetup}
      />
    </div>
  );
};

export default QuestTracker;
