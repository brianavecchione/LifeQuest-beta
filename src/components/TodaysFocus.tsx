import React from 'react';
import { Target, Plus, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quest } from '@/hooks/useQuests';
import QuestCard from './QuestCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  );
  
  const incompleteQuests = focusQuests.filter(q => q.status !== 'Completed');
  const completedQuests = focusQuests.filter(q => q.status === 'Completed');

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
          <span className="text-slate-400 text-sm">
            ({incompleteQuests.length} active)
          </span>
        </div>
        {(showAddMoreQuests || incompleteQuests.length < 5) && (
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
        {/* Incomplete Quests */}
        {incompleteQuests.map((quest) => (
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
        
        {/* Completed Quests - Collapsible Section */}
        {completedQuests.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="completed-quests" className="border-green-600/30">
              <AccordionTrigger className="text-green-400 hover:text-green-300 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed ({completedQuests.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-3">
                {completedQuests.map((quest) => (
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
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