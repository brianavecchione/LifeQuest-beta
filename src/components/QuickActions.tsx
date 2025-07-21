import React from 'react';
import { Trophy, Target, Plus, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuickActionsProps {
  pomodoroCount: number;
  onSetupModalOpen: () => void;
  onNewQuestModalOpen: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  pomodoroCount,
  onSetupModalOpen,
  onNewQuestModalOpen
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Trophy className="w-6 h-6 text-emerald-400" />
        <h3 className="text-xl font-bold text-emerald-400">Tracked Quests</h3>
        {pomodoroCount > 0 && (
          <Badge className="bg-amber-600 text-white ml-2">
            <Coins className="w-3 h-3 mr-1" />
            {pomodoroCount} Pomodoros
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onSetupModalOpen}
          className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white"
        >
          <Target className="w-4 h-4 mr-1" />
          Add to Daily Focus
        </Button>
        <Button 
          size="sm" 
          onClick={onNewQuestModalOpen}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Quest
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;