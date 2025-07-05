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
  onAddQuest?: (questType: Quest['type']) => void;
}

const QuestCategories: React.FC<QuestCategoriesProps> = ({ onAddToFocus, onAddQuest }) => {
  const { quests, toggleQuestStatus } = useQuests();
  const { addXP, addGold } = useUser();
  const { toast } = useToast();

  // Helper function to calculate base gold - moved to top to avoid hoisting issues
  const calculateBaseGold = (xp: number) => {
    return Math.floor(xp / 10) + 10;
  };

  // Filter states
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [xpRange, setXpRange] = useState<number[]>([1000]);
  const [goldRange, setGoldRange] = useState<number[]>([0, 200]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
    
    return priorityMatch && typeMatch && xpMatch && goldMatch && statusMatch;
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
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/70 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => toggleQuestStatus(quest.id)}
            className="shrink-0"
          >
            {quest.status === 'Completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium mb-2 ${quest.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'}`}>
              {quest.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-amber-400 border-amber-400/50 text-xs">
                {quest.xp} XP
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/50 text-xs">
                <Coins className="w-3 h-3 mr-1" />
                {calculateBaseGold(quest.xp)} Gold
              </Badge>
              <Badge className={`${getPriorityColor(quest.priority)} text-xs`}>
                {quest.priority}
              </Badge>
              <button
                onClick={() => toggleQuestStatus(quest.id)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(quest.status)}`}
              >
                {quest.status}
              </button>
            </div>
            
            {quest.tags && quest.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {quest.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs text-slate-400 bg-slate-600/50 px-2 py-1 rounded-full flex items-center gap-1">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-slate-800 border-slate-700 text-white z-50"
          >
            <DropdownMenuItem 
              onClick={() => onAddToFocus?.(quest.id)}
              className="hover:bg-slate-700 focus:bg-slate-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Add to Today's Focus
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700">
              Edit Quest
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 text-red-400">
              Delete Quest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

    const handleAddQuestClick = () => {
      onAddQuest?.(type);
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses} rounded-xl p-6 shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-white/80 text-sm">{categoryQuests.length} quests</p>
            </div>
          </div>
          <div
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-white/20 hover:bg-white/30 text-white border border-white/30 h-9 px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer select-none"
            onClick={handleAddQuestClick}
            onMouseDown={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddQuestClick();
              }
            }}
          >
            <Plus className="w-4 h-4" />
            Add Quest
          </div>
        </div>

        <div className="space-y-3">
          {categoryQuests.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No quests found</p>
              <p className="text-sm">Add a new quest to start your adventure!</p>
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
      {/* Filter Controls */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Filter Quests</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Priority Filter */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Priority</label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white z-50">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Quest Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white z-50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Daily">Dailies</SelectItem>
                <SelectItem value="Main">Main Quests</SelectItem>
                <SelectItem value="Side">Side Quests</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Not started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* XP Range Filter */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Max XP: {xpRange[0]}
            </label>
            <Slider
              value={xpRange}
              onValueChange={setXpRange}
              max={1000}
              min={10}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>10 XP</span>
              <span>1000 XP</span>
            </div>
          </div>

          {/* Gold Range Filter */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Gold: {goldRange[0]} - {goldRange[1]}
            </label>
            <Slider
              value={goldRange}
              onValueChange={setGoldRange}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0 Gold</span>
              <span>200 Gold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySection type="Daily" icon={Star} title="Daily Habits" />
        <CategorySection type="Main" icon={Trophy} title="Main Quests" />
        <CategorySection type="Side" icon={Flag} title="Side Quests" />
        <CategorySection type="Legendary" icon={Crown} title="Legendary Quests" />
      </div>
    </div>
  );
};

export default QuestCategories;