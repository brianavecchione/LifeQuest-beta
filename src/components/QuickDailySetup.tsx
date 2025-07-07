import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flag, Crown, Target } from 'lucide-react';

import { useQuests, Quest } from '@/hooks/useQuests';

interface QuickDailySetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: (selectedQuests: string[]) => void;
  currentFocusQuests: string[]; // Track current focus tasks
}

const QuickDailySetup: React.FC<QuickDailySetupProps> = ({
  isOpen,
  onClose,
  onSetupComplete,
  currentFocusQuests
}) => {
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const { quests } = useQuests();

  // Filter to show Main, Side, and Legendary quests (not completed and not already in focus)
  const focusableQuests = quests.filter(quest => 
    ['Main', 'Side', 'Legendary'].includes(quest.quest_type) && 
    quest.status !== 'Completed' &&
    !currentFocusQuests.includes(quest.id) // Exclude quests already in Today's Focus
  );

  const currentFocusCount = currentFocusQuests.length;
  const maxFocusQuests = 5;
  const minFocusQuests = 3;
  const spotsAvailable = maxFocusQuests - currentFocusCount;
  const needToSelect = Math.max(0, minFocusQuests - currentFocusCount);

  const getTypeIcon = (type: Quest['quest_type']) => {
    switch (type) {
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['quest_type']) => {
    switch (type) {
      case 'Main': return 'border-red-500/50 text-red-400';
      case 'Side': return 'border-blue-500/50 text-blue-400';
      case 'Legendary': return 'border-purple-500/50 text-purple-400';
      default: return 'border-slate-500/50 text-slate-400';
    }
  };

  const handleQuestToggle = (questId: string) => {
    setSelectedQuests(prev => {
      if (prev.includes(questId)) {
        return prev.filter(id => id !== questId);
      } else if (prev.length < spotsAvailable) {
        return [...prev, questId];
      }
      return prev;
    });
  };

  const handleSetupComplete = () => {
    if (selectedQuests.length >= needToSelect) {
      onSetupComplete(selectedQuests);
      onClose();
      setSelectedQuests([]);
    }
  };

  const isValidSelection = selectedQuests.length >= needToSelect;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Set Your Focus for Today
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-lg">
            {spotsAvailable === 0 ? (
              <>Your Today's Focus is full. Remove a task before adding a new one!</>
            ) : needToSelect > 0 ? (
              <>Pick {needToSelect}–{spotsAvailable} more quests to reach your daily focus minimum.</>
            ) : (
              <>Pick up to {spotsAvailable} more quests to add to your focus.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Focus Progress</span>
              <span className={`font-bold ${isValidSelection ? 'text-green-400' : 'text-amber-400'}`}>
                {currentFocusCount + selectedQuests.length}/{maxFocusQuests}
              </span>
            </div>
            <div className="bg-slate-600 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isValidSelection ? 'bg-green-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(((currentFocusCount + selectedQuests.length) / maxFocusQuests) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {spotsAvailable === 0 ? (
                'Your focus is full! Remove tasks to add new ones.'
              ) : needToSelect > 0 ? (
                `Select at least ${needToSelect - selectedQuests.length} more quest${(needToSelect - selectedQuests.length) !== 1 ? 's' : ''} to reach minimum`
              ) : selectedQuests.length === 0 ? (
                `You can add up to ${spotsAvailable} more quests to your focus.`
              ) : (
                `Perfect! You can add up to ${spotsAvailable - selectedQuests.length} more quests.`
              )}
            </p>
          </div>

          {/* Quest Selection */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {spotsAvailable === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-amber-400 font-medium">Your Today's Focus is full!</p>
                <p className="text-sm">Remove a task before adding a new one.</p>
              </div>
            ) : focusableQuests.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No additional quests available for focus selection.</p>
                <p className="text-sm">Create some Main or Side quests first!</p>
              </div>
            ) : (
              focusableQuests.map((quest) => (
                <div key={quest.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={quest.id}
                      checked={selectedQuests.includes(quest.id)}
                      onCheckedChange={() => handleQuestToggle(quest.id)}
                      disabled={!selectedQuests.includes(quest.id) && selectedQuests.length >= spotsAvailable}
                      className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    
                    <div className={`p-2 rounded-lg border ${getTypeColor(quest.quest_type)} bg-slate-800/50`}>
                      {getTypeIcon(quest.quest_type)}
                    </div>
                    
                    <div className="flex-1">
                      <label 
                        htmlFor={quest.id}
                        className="text-white font-medium cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        {quest.quest_name}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-amber-400 border-amber-400/50 text-xs">
                          {quest.xp_reward} XP
                        </Badge>
                        <Badge variant="outline" className={`${getTypeColor(quest.quest_type)} border-current text-xs`}>
                          {quest.quest_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline" 
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Skip for Now
            </Button>
            <Button 
              onClick={handleSetupComplete}
              disabled={!isValidSelection || spotsAvailable === 0}
              className={`flex-1 ${
                isValidSelection && spotsAvailable > 0
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {spotsAvailable === 0 ? 'Focus is Full' : 'Add to Today\'s Focus'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickDailySetup;