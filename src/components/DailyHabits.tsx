import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Quest } from '@/hooks/useQuests';
import QuestCard from './QuestCard';

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
  const sortedDailies = [...allDailies].sort((a, b) => {
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    if (a.status !== 'Completed' && b.status === 'Completed') return -1;
    return 0;
  });

  const completedCount = sortedDailies.filter(q => q.status === 'Completed').length;
  const totalCount = sortedDailies.length;

  if (sortedDailies.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-600/30 text-center">
        <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-50" />
        <p className="text-yellow-400 font-medium">No Daily Habits Created Yet</p>
        <p className="text-yellow-300/70 text-sm">Create some daily habits to build consistency!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-600/30">
      <div 
        className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-yellow-600/10 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Calendar className="w-5 h-5 text-yellow-400" />
        <h4 className="text-lg font-bold text-yellow-400 flex-1">Daily Habits</h4>
        <span className="text-yellow-300/70 text-sm">
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
          {sortedDailies.map((quest) => (
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
        </div>
      )}
    </div>
  );
};

export default DailyHabits;