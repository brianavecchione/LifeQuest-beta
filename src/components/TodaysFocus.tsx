import React from 'react';
import { Target, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quest } from '@/hooks/useQuests';
import QuestCard from './QuestCard';

interface TodaysFocusProps {
  todaysFocus: string[];
  quests: Quest[];
  showAddMoreQuests: boolean;
  onSetupModalOpen: () => void;
  onStatusChange: (questId: string, newStatus: string) => void;
  onRemoveFromFocus: (questId: string) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (quest: Quest) => void;
  onBeginQuest: (quest: Quest) => void;
  activeTimerQuestId?: string;
}

const TodaysFocus: React.FC<TodaysFocusProps> = ({
  todaysFocus,
  quests,
  showAddMoreQuests,
  onSetupModalOpen,
  onStatusChange,
  onRemoveFromFocus,
  onEditQuest,
  onDeleteQuest,
  onBeginQuest,
  activeTimerQuestId
}) => {
  const focusQuests = quests.filter(quest => 
    todaysFocus.includes(quest.id) && quest.quest_type !== 'Daily'
  ).sort((a, b) => {
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    if (a.status !== 'Completed' && b.status === 'Completed') return -1;
    return 0;
  });

  if (todaysFocus.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-6 border border-amber-600/30 text-center mb-6">
        <Target className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-50" />
        <h4 className="text-lg font-semibold text-amber-400 mb-2">You haven't added any quests yet</h4>
        <p className="text-slate-300 mb-4">
          Use the 'New Quest' button to start your adventure!
        </p>
        <Button 
          onClick={onSetupModalOpen}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Target className="w-4 h-4 mr-2" />
          Quick Daily Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-lg p-6 border border-amber-600/50 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-amber-400" />
          <h4 className="text-lg font-bold text-amber-400">Today's Focus</h4>
        </div>
        {(showAddMoreQuests || todaysFocus.length < 5) && (
          <Button 
            size="sm" 
            onClick={onSetupModalOpen}
            className={showAddMoreQuests ? "bg-green-600 hover:bg-green-700 animate-pulse" : "bg-amber-600 hover:bg-amber-700"}
          >
            <Plus className="w-4 h-4 mr-1" />
            {showAddMoreQuests ? 'Add More Quests' : 'Add Quest'}
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {focusQuests.map((quest) => (
          <QuestCard 
            key={quest.id}
            quest={quest}
            showCompleteIcon={true}
            showDeleteButton={true}
            onStatusChange={onStatusChange}
            onRemoveFromFocus={onRemoveFromFocus}
            onEditQuest={onEditQuest}
            onDeleteQuest={onDeleteQuest}
            onBeginQuest={onBeginQuest}
            activeTimerQuestId={activeTimerQuestId}
          />
        ))}
      </div>
      
      {showAddMoreQuests && (
        <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-600/30 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-medium">🎉 Focus Complete!</p>
          <p className="text-green-300 text-sm">Great job finishing your daily focus. Ready for more?</p>
        </div>
      )}
    </div>
  );
};

export default TodaysFocus;