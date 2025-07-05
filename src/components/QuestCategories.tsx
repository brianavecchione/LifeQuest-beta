import React, { useState, useEffect } from 'react';
import { Star, Trophy, Flag, Crown, Plus, Filter, Target, CheckCircle2, Circle, MoreVertical, Tag, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuests, Quest } from '@/contexts/QuestContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface QuestCategoriesProps {
  onAddToFocus?: (questId: string) => void;
  searchQuery?: string;
  filters?: {
    priorityFilter: string;
    typeFilter: string;
    statusFilter: string;
    xpRange: number[];
    goldRange: number[];
  };
}

const QuestCategories: React.FC<QuestCategoriesProps> = ({ 
  onAddToFocus, 
  searchQuery = '',
  filters = {
    priorityFilter: 'all',
    typeFilter: 'all',
    statusFilter: 'all',
    xpRange: [1000],
    goldRange: [0, 200]
  }
}) => {
  const { quests, toggleQuestStatus } = useQuests();
  const { addXP, addGold } = useUser();
  const { toast } = useToast();

  // Helper function to calculate base gold - moved to top to avoid hoisting issues
  const calculateBaseGold = (xp: number) => {
    return Math.floor(xp / 10) + 10;
  };

  // Filter states - now received as props
  const { priorityFilter, typeFilter, statusFilter, xpRange, goldRange } = filters;
  const [previousQuests, setPreviousQuests] = useState<Quest[]>([]);

  // Track quest completions and award XP and Gold
  useEffect(() => {
    if (previousQuests.length > 0) {
      quests.forEach(currentQuest => {
        const previousQuest = previousQuests.find(p => p.id === currentQuest.id);
        
        // If quest just changed to Completed, award XP and gold
        if (previousQuest && 
            previousQuest.status !== 'Completed' && 
            currentQuest.status === 'Completed') {
          
          const baseGold = calculateBaseGold(currentQuest.xp);
          
          addXP(currentQuest.xp);
          addGold(baseGold);
          
          toast({
            title: "Quest Complete! 🎉",
            description: `Earned ${currentQuest.xp} XP and ${baseGold} Gold!`,
          });
        }
      });
    }
    
    // Update previous quests for next comparison
    setPreviousQuests([...quests]);
  }, [quests, previousQuests, addXP, addGold, toast]);

  // Filtered quests
  const filteredQuests = quests.filter(quest => {
    const priorityMatch = priorityFilter === 'all' || quest.priority === priorityFilter;
    const typeMatch = typeFilter === 'all' || quest.type === typeFilter;
    const xpMatch = quest.xp <= xpRange[0];
    const questGold = calculateBaseGold(quest.xp);
    const goldMatch = questGold >= goldRange[0] && questGold <= goldRange[1];
    const statusMatch = statusFilter === 'all' || quest.status === statusFilter;
    
    // Search functionality - case insensitive, partial matches
    const searchMatch = searchQuery.trim() === '' || 
      quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quest.tags && quest.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    return priorityMatch && typeMatch && xpMatch && goldMatch && statusMatch && searchMatch;
  });

  // Group filtered quests by type
  const groupedQuests = {
    Daily: filteredQuests.filter(q => q.type === 'Daily'),
    Main: filteredQuests.filter(q => q.type === 'Main'),
    Side: filteredQuests.filter(q => q.type === 'Side'),
    Legendary: filteredQuests.filter(q => q.type === 'Legendary')
  };


  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-600 hover:bg-green-700';
      case 'In Progress': return 'bg-blue-600 hover:bg-blue-700';
      case 'Not started': return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getPriorityColor = (priority: Quest['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Low': return 'bg-green-600 text-white';
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

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'Daily': return 'from-yellow-600 to-amber-600 border-yellow-500/50';
      case 'Main': return 'from-red-600 to-rose-600 border-red-500/50';
      case 'Side': return 'from-blue-600 to-cyan-600 border-blue-500/50';
      case 'Legendary': return 'from-purple-600 to-violet-600 border-purple-500/50';
      default: return 'from-slate-600 to-slate-700 border-slate-500/50';
    }
  };

  const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => (
    <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={() => toggleQuestStatus(quest.id)}
          className="shrink-0 mt-0.5"
        >
          {quest.status === 'Completed' ? (
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          ) : (
            <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-blue-400 transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-medium text-sm sm:text-base leading-tight ${quest.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'}`}>
              {quest.name}
            </h4>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 shrink-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-slate-800 border-slate-700 text-white z-50"
              >
                <DropdownMenuItem 
                  onClick={() => onAddToFocus?.(quest.id)}
                  className="hover:bg-slate-700 focus:bg-slate-700 text-sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Add to Today's Focus
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 text-sm">
                  Edit Quest
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 text-red-400 text-sm">
                  Delete Quest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="text-amber-400 border-amber-400/50 text-xs px-1.5 py-0.5">
              {quest.xp} XP
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/50 text-xs px-1.5 py-0.5">
              <Coins className="w-3 h-3 mr-1" />
              {calculateBaseGold(quest.xp)} Gold
            </Badge>
            <Badge className={`${getPriorityColor(quest.priority)} text-xs px-1.5 py-0.5`}>
              {quest.priority}
            </Badge>
            <button
              onClick={() => toggleQuestStatus(quest.id)}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(quest.status)} whitespace-nowrap`}
            >
              {quest.status}
            </button>
          </div>
          
          {quest.tags && quest.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {quest.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs text-slate-400 bg-slate-600/50 px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                  <Tag className="w-3 h-3" />
                  #{tag}
                </span>
              ))}
              {quest.tags.length > 2 && (
                <span className="text-xs text-slate-400">+{quest.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CategorySection: React.FC<{ 
    type: keyof typeof groupedQuests; 
    icon: React.ComponentType<any>;
    title: string;
  }> = ({ type, icon: Icon, title }) => {
    const categoryQuests = groupedQuests[type];
    const colorClasses = getCategoryColor(type);

    return (
      <div className={`bg-gradient-to-br ${colorClasses} rounded-xl p-4 sm:p-6 shadow-2xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg shrink-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h3>
              <p className="text-white/80 text-xs sm:text-sm">{categoryQuests.length} quests</p>
            </div>
          </div>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 shrink-0 h-8 sm:h-9 text-xs sm:text-sm px-3">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Add Quest</span>
          </Button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {categoryQuests.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-white/60">
              <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="font-medium mb-2 text-sm sm:text-base">
                {searchQuery.trim() !== '' ? 'No matching quests found' : 'No quests found'}
              </p>
              <p className="text-xs sm:text-sm px-4">
                {searchQuery.trim() !== '' 
                  ? `Try adjusting your search term "${searchQuery}" or filters`
                  : 'Add a new quest to start your adventure!'
                }
              </p>
            </div>
          ) : (
            categoryQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Quest Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <CategorySection type="Daily" icon={Star} title="Daily Habits" />
        <CategorySection type="Main" icon={Trophy} title="Main Quests" />
        <CategorySection type="Side" icon={Flag} title="Side Quests" />
        <CategorySection type="Legendary" icon={Crown} title="Legendary Quests" />
      </div>
    </div>
  );
};

export default QuestCategories;