import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Quest } from '@/hooks/useQuests';
import QuestCard from './QuestCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DailyHabitsProps {
  quests: Quest[];
  onStatusChange: (questId: string, newStatus: string) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (quest: Quest) => void;
}

const DailyHabits: React.FC<DailyHabitsProps> = ({
  quests,
  onStatusChange,
  onEditQuest,
  onDeleteQuest
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const allDailies = quests.filter(quest => quest.quest_type === 'Daily');
  
  const incompleteHabits = allDailies.filter(q => q.status !== 'Completed');
  const completedHabits = allDailies.filter(q => q.status === 'Completed');
  
  const completedCount = completedHabits.length;
  const totalCount = allDailies.length;

  if (allDailies.length === 0) {
    return (
      <div className="bg-component-background rounded-lg p-4 border border-yellow-600/30 text-center">
        <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-50" />
        <p className="text-yellow-400 font-medium">No Daily Habits Created Yet</p>
        <p className="text-muted-foreground text-sm">Create some daily habits to build consistency!</p>
      </div>
    );
  }

  return (
    <div className="bg-component-background rounded-lg p-4 border border-yellow-600/30">
      <div 
        className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-yellow-600/10 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Calendar className="w-5 h-5 text-yellow-400" />
        <h4 className="text-lg font-bold text-yellow-400 flex-1">Daily Habits</h4>
        <span className="text-muted-foreground text-sm">
          ({completedCount}/{totalCount})
        </span>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-yellow-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-yellow-400" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="space-y-3">
          {/* Incomplete Habits */}
          {incompleteHabits.map((quest) => (
            <QuestCard 
              key={quest.id}
              quest={quest}
              showCompleteIcon={true}
              onStatusChange={onStatusChange}
              onEditQuest={onEditQuest}
              onDeleteQuest={onDeleteQuest}
              hideBadges={['gold', 'type']}
            />
          ))}
          
          {/* Completed Habits - Collapsible Section */}
          {completedHabits.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="completed-habits" className="border-green-600/30">
                <AccordionTrigger className="text-green-400 hover:text-green-300 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed ({completedHabits.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-3">
                  {completedHabits.map((quest) => (
                    <QuestCard 
                      key={quest.id}
                      quest={quest}
                      showCompleteIcon={true}
                      onStatusChange={onStatusChange}
                      onEditQuest={onEditQuest}
                      onDeleteQuest={onDeleteQuest}
                      hideBadges={['gold', 'type']}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyHabits;