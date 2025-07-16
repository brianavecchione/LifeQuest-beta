import React, { useState } from 'react';
import { Star, Trophy, Flag, Crown, CheckCircle2, Coins, MoreVertical, Edit, Trash2, Play, X, ChevronDown, ChevronUp, Calendar, Clock, AlertCircle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Quest } from '@/hooks/useQuests';
import { format } from 'date-fns';

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
  const [isExpanded, setIsExpanded] = useState(false);
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

  const getPriorityColor = (priority: Quest['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-400 border-red-400/50';
      case 'Medium': return 'text-yellow-400 border-yellow-400/50';
      case 'Low': return 'text-green-400 border-green-400/50';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all group">
      {/* Main quest card header - clickable to expand */}
      <div 
        className="p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {showCompleteIcon && quest.status === 'Completed' && (
              <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(quest.id, quest.status === 'Completed' ? 'Not started' : 'Completed');
              }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromFocus(quest.id);
                }}
                className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white p-2"
                title="Remove from Today's Focus"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 shrink-0 text-slate-400 hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>Quest Actions</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Button 
                    onClick={() => onEditQuest(quest)}
                    className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Quest
                  </Button>
                  <Button 
                    onClick={() => onDeleteQuest(quest)}
                    className="w-full justify-start bg-slate-700 hover:bg-red-600 text-red-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Quest
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {quest.status !== 'Completed' && quest.quest_type !== 'Daily' && quest.pomodoro_enabled && onBeginQuest && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBeginQuest(quest);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={activeTimerQuestId === quest.id}
              >
                <Play className="w-4 h-4 mr-1" />
                Begin Quest
              </Button>
            )}
            
            {/* Expand/Collapse indicator */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 shrink-0 text-slate-400 hover:text-white"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded details section */}
      {isExpanded && (
        <div className="border-t border-slate-600/50 p-4 bg-slate-800/30 animate-fade-in">
          <div className="space-y-4">
            {/* Description */}
            {quest.description && (
              <div>
                <h5 className="text-sm font-medium text-slate-300 mb-2">Description</h5>
                <p className="text-sm text-slate-400 leading-relaxed">{quest.description}</p>
              </div>
            )}

            {/* Quest Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              {quest.quest_type !== 'Daily' && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Priority:</span>
                  <Badge variant="outline" className={`${getPriorityColor(quest.priority)} border-current text-xs`}>
                    {quest.priority}
                  </Badge>
                </div>
              )}

              {/* Due Date */}
              {quest.due_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Due Date:</span>
                  <span className="text-sm text-slate-400">{formatDate(quest.due_date)}</span>
                </div>
              )}

              {/* Recurring Status */}
              {quest.quest_type === 'Daily' && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Recurring:</span>
                  <Badge variant="outline" className={`${quest.is_recurring ? 'text-blue-400 border-blue-400/50' : 'text-gray-400 border-gray-400/50'} text-xs`}>
                    {quest.is_recurring ? 'Yes' : 'One-time'}
                  </Badge>
                </div>
              )}

              {/* Pomodoro Enabled */}
              {quest.pomodoro_enabled && (
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Pomodoro:</span>
                  <Badge variant="outline" className="text-orange-400 border-orange-400/50 text-xs">
                    Enabled
                  </Badge>
                </div>
              )}
            </div>

            {/* Tags */}
            {quest.tags && quest.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quest.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-slate-400 border-slate-500/50 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Status */}
            {quest.completed_at && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">Completed:</span>
                <span className="text-sm text-slate-400">{formatDate(quest.completed_at)}</span>
              </div>
            )}

            {/* Creation Date */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Created: {formatDate(quest.created_at)}</span>
              {quest.updated_at !== quest.created_at && (
                <span className="ml-4">Updated: {formatDate(quest.updated_at)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestCard;