import React from 'react';
import { Star, Trophy, Flag, Crown, CheckCircle2, Coins, MoreVertical, Edit, Trash2, Play, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Quest } from '@/hooks/useQuests';

interface QuestCardProps {
  quest: Quest;
  showCompleteIcon?: boolean;
  showDeleteButton?: boolean;
  onStatusChange: (questId: string, newStatus: string) => void;
  onRemoveFromFocus?: (questId: string) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (quest: Quest) => void;
  onBeginQuest?: (quest: Quest) => void;
  activeTimerQuestId?: string;
  hideBadges?: Array<'gold' | 'type'>;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  showCompleteIcon = false,
  showDeleteButton = false,
  onStatusChange,
  onRemoveFromFocus,
  onEditQuest,
  onDeleteQuest,
  onBeginQuest,
  activeTimerQuestId,
  hideBadges = []
}) => {
  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-600 hover:bg-green-700';
      case 'In Progress': return 'bg-blue-600 hover:bg-blue-700';
      case 'Not started': return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getTypeIcon = (type: Quest['quest_type']) => {
    switch (type) {
      case 'Daily': return <Star className="w-4 h-4" />;
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['quest_type']) => {
    switch (type) {
      case 'Daily': return 'border-yellow-500/50 text-yellow-400';
      case 'Main': return 'border-red-500/50 text-red-400';
      case 'Side': return 'border-blue-500/50 text-blue-400';
      case 'Legendary': return 'border-purple-500/50 text-purple-400';
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showCompleteIcon && quest.status === 'Completed' && (
            <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
          )}
          <button
            onClick={() => onStatusChange(quest.id, quest.status === 'Completed' ? 'Not started' : 'Completed')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(quest.status)}`}
          >
            {quest.status}
          </button>
          
          <div className={`p-2 rounded-lg border ${getTypeColor(quest.quest_type)} bg-slate-800/50`}>
            {getTypeIcon(quest.quest_type)}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-medium ${quest.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'}`}>
              {quest.quest_name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                {quest.xp_reward} XP
              </Badge>
              {!hideBadges.includes('gold') && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                  <Coins className="w-3 h-3 mr-1" />
                  {quest.gold_reward} Gold
                </Badge>
              )}
              {!hideBadges.includes('type') && (
                <Badge variant="outline" className={`${getTypeColor(quest.quest_type)} border-current`}>
                  {quest.quest_type}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showDeleteButton && onRemoveFromFocus && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemoveFromFocus(quest.id)}
              className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white p-2"
              title="Remove from Today's Focus"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0 text-slate-400 hover:text-white">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              sideOffset={5}
              className="bg-slate-800 border-slate-700 text-white z-[9999]"
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DropdownMenuItem 
                onClick={() => onEditQuest(quest)}
                className="hover:bg-slate-700 focus:bg-slate-700 text-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Quest
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteQuest(quest)}
                className="hover:bg-slate-700 focus:bg-slate-700 text-red-400 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Quest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {quest.status !== 'Completed' && quest.quest_type !== 'Daily' && quest.pomodoro_enabled && onBeginQuest && (
            <Button
              size="sm"
              onClick={() => onBeginQuest(quest)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={activeTimerQuestId === quest.id}
            >
              <Play className="w-4 h-4 mr-1" />
              Begin Quest
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestCard;