import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flag, Crown, Target } from 'lucide-react';

interface Quest {
  id: string;
  name: string;
  status: 'Not started' | 'In Progress' | 'Completed';
  xp: number;
  type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
}

interface QuickDailySetupProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  onSetupComplete: (selectedQuests: string[]) => void;
}

const QuickDailySetup: React.FC<QuickDailySetupProps> = ({
  isOpen,
  onClose,
  quests,
  onSetupComplete
}) => {
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);

  // Filter out daily quests for the setup
  const focusableQuests = quests.filter(quest => 
    quest.type !== 'Daily' && quest.status !== 'Completed'
  );

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['type']) => {
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
      } else if (prev.length < 5) {
        return [...prev, questId];
      }
      return prev;
    });
  };

  const handleSetupComplete = () => {
    if (selectedQuests.length >= 3 && selectedQuests.length <= 5) {
      onSetupComplete(selectedQuests);
      onClose();
      setSelectedQuests([]);
    }
  };

  const isValidSelection = selectedQuests.length >= 3 && selectedQuests.length <= 5;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Set Your Focus for Today
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-lg">
            Pick 3–5 quests to complete first. You can add more after you finish these!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Selected Quests</span>
              <span className={`font-bold ${isValidSelection ? 'text-green-400' : 'text-amber-400'}`}>
                {selectedQuests.length}/5
              </span>
            </div>
            <div className="bg-slate-600 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isValidSelection ? 'bg-green-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min((selectedQuests.length / 5) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {selectedQuests.length < 3 
                ? `Select at least ${3 - selectedQuests.length} more quest${3 - selectedQuests.length !== 1 ? 's' : ''}`
                : selectedQuests.length <= 5 
                ? 'Perfect! You can select up to 5 quests total.'
                : 'Maximum of 5 quests reached'
              }
            </p>
          </div>

          {/* Quest Selection */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {focusableQuests.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No quests available for focus selection.</p>
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
                      disabled={!selectedQuests.includes(quest.id) && selectedQuests.length >= 5}
                      className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    
                    <div className={`p-2 rounded-lg border ${getTypeColor(quest.type)} bg-slate-800/50`}>
                      {getTypeIcon(quest.type)}
                    </div>
                    
                    <div className="flex-1">
                      <label 
                        htmlFor={quest.id}
                        className="text-white font-medium cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        {quest.name}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-amber-400 border-amber-400/50 text-xs">
                          {quest.xp} XP
                        </Badge>
                        <Badge variant="outline" className={`${getTypeColor(quest.type)} border-current text-xs`}>
                          {quest.type}
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
              disabled={!isValidSelection}
              className={`flex-1 ${
                isValidSelection 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              Set Today's Focus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickDailySetup;