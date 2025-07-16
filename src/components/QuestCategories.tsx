import React, { useState, useEffect } from 'react';
import { Star, Trophy, Flag, Crown, Plus, Filter, Target, CheckCircle2, Circle, MoreVertical, Tag, Coins, Calendar, AlertTriangle, Edit, Trash2, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useQuests, Quest } from '@/hooks/useQuestsWrapper';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, isBefore, isAfter, endOfWeek, startOfDay } from 'date-fns';
import EditQuestModal from './EditQuestModal';
import QuestCard from './QuestCard';

interface QuestCategoriesProps {
  onAddToFocus?: (questId: string) => void;
  searchQuery?: string;
  filters?: {
    priorityFilter: string;
    typeFilter: string;
    statusFilter: string;
    xpRange: number[];
    goldRange: number[];
    dueDateFilter: string;
  };
  onOpenNewQuestModal?: (questType?: Quest['quest_type']) => void;
  maxFocusQuests?: number;
}

const QuestCategories: React.FC<QuestCategoriesProps> = ({ 
  onAddToFocus, 
  searchQuery = '',
  filters = {
    priorityFilter: 'all',
    typeFilter: 'all',
    statusFilter: 'all',
    xpRange: [1000],
    goldRange: [0, 200],
    dueDateFilter: 'all'
  },
  onOpenNewQuestModal,
  maxFocusQuests = 5
}) => {
  const { quests, loading, updateQuestStatus, deleteQuest, refetchQuests } = useQuests();
  const { toast } = useToast();
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [deletingQuest, setDeletingQuest] = useState<Quest | null>(null);

  console.log('QuestCategories - quests:', quests, 'loading:', loading);

  // Helper function to calculate base gold - moved to top to avoid hoisting issues
  const calculateBaseGold = (xp: number) => {
    return Math.floor(xp / 10) + 10;
  };

  // Helper function to check if quest is overdue
  const isQuestOverdue = (quest: Quest) => {
    if (!quest.due_date || quest.status === 'Completed') return false;
    
    // Daily quests don't show due date indicators, so they're never considered overdue
    if (quest.quest_type === 'Daily') return false;
    
    // Parse the due date as a local date (not UTC)
    const [year, month, day] = quest.due_date.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day); // month is 0-indexed
    const today = startOfDay(new Date());
    
    return isBefore(dueDate, today);
  };

  // Helper function to filter by due date
  const matchesDueDateFilter = (quest: Quest, dueDateFilter: string) => {
    if (dueDateFilter === 'all') return true;
    
    const today = new Date();
    const hasNoDueDate = !quest.due_date;
    
    switch (dueDateFilter) {
      case 'noDueDate':
        return hasNoDueDate;
      case 'overdue':
        return !hasNoDueDate && isQuestOverdue(quest);
      case 'dueToday':
        if (hasNoDueDate) return false;
        const [year, month, day] = quest.due_date.split('-').map(Number);
        const questDueDate = new Date(year, month - 1, day);
        return isToday(questDueDate);
      case 'dueThisWeek':
        if (hasNoDueDate) return false;
        const [weekYear, weekMonth, weekDay] = quest.due_date.split('-').map(Number);
        const weekDueDate = new Date(weekYear, weekMonth - 1, weekDay);
        const weekEnd = endOfWeek(today);
        return !isBefore(weekDueDate, today) && !isAfter(weekDueDate, weekEnd);
      default:
        return true;
    }
  };

  // Filter states - now received as props
  const { priorityFilter, typeFilter, statusFilter, xpRange, goldRange, dueDateFilter } = filters;
  const [previousQuests, setPreviousQuests] = useState<Quest[]>([]);
  
  // Track Today's Focus quests
  const [todaysFocusQuests, setTodaysFocusQuests] = useState<string[]>([]);

  // Load Today's Focus on mount and listen for updates
  useEffect(() => {
    const loadTodaysFocus = () => {
      const savedFocus = localStorage.getItem('lifequest-todays-focus');
      const currentFocus = savedFocus ? JSON.parse(savedFocus) : [];
      setTodaysFocusQuests(currentFocus);
    };

    // Load initial data
    loadTodaysFocus();

    // Listen for focus updates
    const handleFocusUpdate = () => {
      loadTodaysFocus();
    };

    window.addEventListener('todaysFocusUpdated', handleFocusUpdate);

    return () => {
      window.removeEventListener('todaysFocusUpdated', handleFocusUpdate);
    };
  }, []);

  // Track quest completions and award XP and Gold - handled by database triggers now
  useEffect(() => {
    // Update previous quests for next comparison
    setPreviousQuests([...quests]);
  }, [quests]);

  // Filtered quests
  const filteredQuests = quests.filter(quest => {
    // Skip priority filtering for Daily quests since they don't use priority system
    const priorityMatch = quest.quest_type === 'Daily' || priorityFilter === 'all' || quest.priority === priorityFilter;
    const typeMatch = typeFilter === 'all' || quest.quest_type === typeFilter;
    const xpMatch = quest.xp_reward <= xpRange[0];
    const questGold = quest.gold_reward;
    const goldMatch = questGold >= goldRange[0] && questGold <= goldRange[1];
    const statusMatch = statusFilter === 'all' || quest.status === statusFilter;
    const dueDateMatch = matchesDueDateFilter(quest, dueDateFilter);
    
    // Search functionality - case insensitive, partial matches
    const searchMatch = searchQuery.trim() === '' || 
      quest.quest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quest.tags && quest.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    return priorityMatch && typeMatch && xpMatch && goldMatch && statusMatch && dueDateMatch && searchMatch;
  });

  // Group filtered quests by type and sort completed to bottom
  const sortQuestsByCompletion = (questArray: Quest[]) => {
    return [...questArray].sort((a, b) => {
      // Completed quests go to bottom
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;
      // Within same completion status, maintain creation order (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const groupedQuests = {
    Daily: sortQuestsByCompletion(filteredQuests.filter(q => q.quest_type === 'Daily')),
    Main: sortQuestsByCompletion(filteredQuests.filter(q => q.quest_type === 'Main')),
    Side: sortQuestsByCompletion(filteredQuests.filter(q => q.quest_type === 'Side')),
    Legendary: sortQuestsByCompletion(filteredQuests.filter(q => q.quest_type === 'Legendary'))
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

  const getTypeIcon = (type: Quest['quest_type']) => {
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

  const handleAddToFocus = (questId: string) => {
    // Get current focus count from localStorage AND verify quests still exist
    const savedFocus = localStorage.getItem('lifequest-todays-focus');
    const currentFocusIds = savedFocus ? JSON.parse(savedFocus) : [];
    
    // Filter to only include quest IDs that still exist in the current quest list
    const validFocusIds = currentFocusIds.filter(id => 
      quests.some(quest => quest.id === id)
    );
    
    // Filter to only count ACTIVE (incomplete) focus quests for the limit check
    const activeFocusIds = validFocusIds.filter(id => {
      const quest = quests.find(q => q.id === id);
      return quest && quest.status !== 'Completed';
    });
    
    // If the localStorage list doesn't match valid quests, clean it up
    if (validFocusIds.length !== currentFocusIds.length) {
      localStorage.setItem('lifequest-todays-focus', JSON.stringify(validFocusIds));
      window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
      console.log(`Cleaned up focus list: removed ${currentFocusIds.length - validFocusIds.length} invalid quest IDs`);
    }
    
    // Only count active (incomplete) quests for the focus limit
    if (activeFocusIds.length >= maxFocusQuests) {
      toast({
        title: "Focus List Full",
        description: `You can only have ${maxFocusQuests} active quests in your Today's Focus. Complete some first!`,
        variant: "destructive"
      });
      return;
    }

    if (validFocusIds.includes(questId)) {
      toast({
        title: "Already Added",
        description: "This quest is already in your Today's Focus!",
        variant: "destructive"
      });
      return;
    }

    // Add quest to focus list
    const newFocus = [...validFocusIds, questId];
    localStorage.setItem('lifequest-todays-focus', JSON.stringify(newFocus));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('todaysFocusUpdated'));
    
    if (onAddToFocus) {
      onAddToFocus(questId);
    }

    toast({
      title: "Added to Today's Focus! 🎯",
      description: "This quest will appear in your daily focus on the Today page.",
    });
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
  };

  const handleDeleteQuest = async () => {
    if (!deletingQuest) return;
    
    const success = await deleteQuest(deletingQuest.id);
    if (success) {
      setDeletingQuest(null);
    }
  };


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
          <Button 
            size="sm" 
            onClick={() => onOpenNewQuestModal?.(type)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 shrink-0 h-8 sm:h-9 text-xs sm:text-sm px-3"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Add Quest</span>
          </Button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {categoryQuests.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-white/60">
              <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="font-medium mb-2 text-sm sm:text-base">
                {searchQuery.trim() !== '' ? 'No matching quests found' : 
                  type === 'Daily' ? 'No daily habits tracked yet' :
                  type === 'Main' ? 'No main quests created yet' :
                  type === 'Side' ? 'No side quests available' :
                  'No legendary quests unlocked yet'
                }
              </p>
              <p className="text-xs sm:text-sm px-4">
                {searchQuery.trim() !== '' 
                  ? `Try adjusting your search term "${searchQuery}" or filters`
                  : type === 'Daily' ? 'Add a habit to build your streaks!' :
                    'Use the "Add Quest" button to start your adventure!'
                }
              </p>
            </div>
          ) : (
            categoryQuests.map((quest) => (
              <QuestCard 
                key={quest.id} 
                quest={quest}
                onStatusChange={updateQuestStatus}
                onEditQuest={setEditingQuest}
                onDeleteQuest={setDeletingQuest}
                hideBadges={['type']}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-center py-8 text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your quests...</p>
        </div>
      ) : (
        <>
          {/* Quest Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <CategorySection type="Daily" icon={Star} title="Daily Habits" />
            <CategorySection type="Main" icon={Trophy} title="Main Quests" />
            <CategorySection type="Side" icon={Flag} title="Side Quests" />
            <CategorySection type="Legendary" icon={Crown} title="Legendary Quests" />
          </div>
        </>
      )}

      {/* Edit Quest Modal */}
      <EditQuestModal
        isOpen={!!editingQuest}
        onClose={() => setEditingQuest(null)}
        quest={editingQuest}
        onQuestUpdated={refetchQuests}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuest} onOpenChange={() => setDeletingQuest(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Quest</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to delete "{deletingQuest?.quest_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteQuest}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Quest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestCategories;