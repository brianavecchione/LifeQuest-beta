import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Trophy, Flag, Crown, CalendarIcon, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 
import { Quest, useQuests } from '@/hooks/useQuests';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestCount?: number;
  maxQuests?: number;
  defaultQuestType?: Quest['quest_type'];
}

const NewQuestModal: React.FC<NewQuestModalProps> = ({ 
  isOpen, 
  onClose, 
  currentQuestCount = 0,
  maxQuests = 5,
  defaultQuestType
}) => {
  const { toast } = useToast();
  const { createQuest } = useQuests();
  const [formData, setFormData] = useState({
    quest_name: '',
    description: '',
    quest_type: defaultQuestType || 'Main' as Quest['quest_type'],
    priority: 'Medium' as Quest['priority'],
    difficulty: 'Moderate' as Quest['difficulty'],
    tags: '',
    due_date: null as Date | null,
    pomodoro_enabled: false,
    is_recurring: false,
    recurrence_type: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    weekly_days: [] as number[],
    monthly_day: 1,
  });

  // Helper function to calculate rewards based on difficulty and priority
  const calculateRewards = (difficulty: Quest['difficulty'], priority: Quest['priority']) => {
    const rewardMatrix = {
      Easy: { Low: { xp: 5, gold: 2 }, Medium: { xp: 10, gold: 3 }, High: { xp: 15, gold: 4 } },
      Moderate: { Low: { xp: 15, gold: 5 }, Medium: { xp: 20, gold: 6 }, High: { xp: 25, gold: 8 } },
      Hard: { Low: { xp: 25, gold: 8 }, Medium: { xp: 30, gold: 10 }, High: { xp: 35, gold: 12 } }
    };
    return rewardMatrix[difficulty][priority];
  };

  // Calculate current rewards
  const currentRewards = formData.quest_type === 'Daily' 
    ? { xp: 5, gold: 0 } 
    : calculateRewards(formData.difficulty, formData.priority);

  // Update form state when defaultQuestType changes
  useEffect(() => {
    if (defaultQuestType && isOpen) {
      setFormData(prev => ({
        ...prev,
        quest_type: defaultQuestType,
      }));
    }
  }, [defaultQuestType, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.quest_name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the quest name.",
        variant: "destructive"
      });
      return;
    }

    // Calculate XP and Gold rewards based on quest type
    const { xp, gold } = formData.quest_type === 'Daily' 
      ? { xp: 5, gold: 0 } 
      : calculateRewards(formData.difficulty, formData.priority);

    // Auto-assign due date for Daily quests to today
    const finalDueDate = formData.quest_type === 'Daily' 
      ? format(new Date(), 'yyyy-MM-dd')
      : formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : undefined;

    // Build recurrence config
    let recurrenceConfig = null;
    if (formData.recurrence_type === 'weekly' && formData.weekly_days.length > 0) {
      recurrenceConfig = { days_of_week: formData.weekly_days };
    } else if (formData.recurrence_type === 'monthly') {
      recurrenceConfig = { day_of_month: formData.monthly_day };
    }

    const questData = {
      quest_name: formData.quest_name.trim(),
      description: formData.description.trim() || undefined,
      status: 'Not started' as const,
      xp_reward: xp,
      gold_reward: gold,
      quest_type: formData.quest_type,
      priority: formData.quest_type === 'Daily' ? 'Medium' : formData.priority, // Default Medium for Daily quests
      difficulty: formData.difficulty,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      due_date: finalDueDate,
      pomodoro_enabled: formData.pomodoro_enabled,
      is_recurring: formData.quest_type === 'Daily' ? formData.is_recurring : false,
      recurrence_type: formData.recurrence_type,
      recurrence_config: recurrenceConfig,
    };

    const success = await createQuest(questData);
    if (success) {
      // Reset form with proper defaults
      setFormData({
        quest_name: '',
        description: '',
        quest_type: defaultQuestType || 'Main',
        priority: 'Medium',
        difficulty: 'Moderate',
        tags: '',
        due_date: null,
        pomodoro_enabled: false,
        is_recurring: false,
        recurrence_type: 'none',
        weekly_days: [],
        monthly_day: 1,
      });

      onClose();
      // The quest list will automatically update because createQuest updates the state
    }
  };

  const isAtLimit = currentQuestCount >= maxQuests;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-xl flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Create New Quest
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Add a new quest to your adventure log. Choose your quest type and set the XP reward!
          </DialogDescription>
        </DialogHeader>

        {isAtLimit && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <p className="text-yellow-400 text-sm">
              ⚠️ You have {currentQuestCount} active non-daily quests. Consider completing some before adding more, 
              or this quest will be added to your quest categories for selection later.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quest Name */}
          <div>
            <Label htmlFor="quest-name" className="text-slate-300 font-medium">
              Quest Name *
            </Label>
            <Input
              id="quest-name"
              value={formData.quest_name}
              onChange={(e) => setFormData(prev => ({ ...prev, quest_name: e.target.value }))}
              placeholder="e.g., Complete project proposal"
              className="bg-slate-700 border-slate-600 text-white mt-1"
              maxLength={100}
            />
          </div>

          {/* Quest Description */}
          <div>
            <Label htmlFor="quest-description" className="text-slate-300 font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="quest-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details about this quest..."
              className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[80px]"
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quest Type */}
            <div>
              <Label className="text-slate-300 font-medium mb-2 block">Quest Type</Label>
              <Select 
                value={formData.quest_type} 
                onValueChange={(value: Quest['quest_type']) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    quest_type: value,
                  }));
                }}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Daily">Daily Habit</SelectItem>
                  <SelectItem value="Main">Main Quest</SelectItem>
                  <SelectItem value="Side">Side Quest</SelectItem>
                  <SelectItem value="Legendary">Legendary Quest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority - Hidden for Daily quests */}
            {formData.quest_type !== 'Daily' && (
              <div>
                <Label className="text-slate-300 font-medium mb-2 block">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: Quest['priority']) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Difficulty */}
            <div>
              <Label className="text-slate-300 font-medium mb-2 block">Difficulty</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value: Quest['difficulty']) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reward Display Section */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <h4 className="text-slate-300 font-medium text-sm mb-2">Calculated Rewards:</h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-600/20 px-2 py-1 rounded border border-amber-600/30">
                <span className="text-amber-400 text-sm">⚡</span>
                <span className="text-amber-400 font-medium text-sm">{currentRewards.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-600/20 px-2 py-1 rounded border border-yellow-600/30">
                <span className="text-yellow-400 text-sm">🪙</span>
                <span className="text-yellow-400 font-medium text-sm">{currentRewards.gold} Gold</span>
              </div>
              {formData.quest_type === 'Daily' ? (
                <p className="text-yellow-400 text-xs">Fixed rewards for Daily quests</p>
              ) : (
                <p className="text-slate-400 text-xs">Based on {formData.difficulty} difficulty + {formData.priority} priority</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tags */}
            <div>
              <Label htmlFor="quest-tags" className="text-slate-300 font-medium">
                Tags (Optional)
              </Label>
              <Input
                id="quest-tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., work, health, learning"
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
              <p className="text-xs text-slate-400 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Due Date - Hidden for Daily quests (auto-assigned) */}
            {formData.quest_type !== 'Daily' && (
              <div>
                <Label className="text-slate-300 font-medium mb-2 block">
                  Due Date (Optional)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                        !formData.due_date && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, "PPP") : <span>Pick a due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date || undefined}
                      onSelect={(date) => setFormData(prev => ({ ...prev, due_date: date || null }))}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-slate-400 mt-1">
                  Optional deadline for quest completion
                </p>
              </div>
            )}
            {formData.quest_type === 'Daily' && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm font-medium">📅 Daily Quest Auto-Schedule</p>
                <p className="text-yellow-300/80 text-xs mt-1">
                  Due date automatically set to today and will reset daily
                </p>
              </div>
            )}
          </div>

          {/* Recurrence Options */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 font-medium text-sm flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Repeat
                </Label>
                <p className="text-slate-400 text-xs mt-1">
                  This quest will reappear automatically on selected days and reward XP/gold each time it's completed.
                </p>
              </div>
              
              <Select 
                value={formData.recurrence_type} 
                onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => {
                  setFormData(prev => ({ 
                    ...prev, 
                    recurrence_type: value,
                    weekly_days: value === 'weekly' ? prev.weekly_days : [],
                    monthly_day: value === 'monthly' ? prev.monthly_day : 1
                  }));
                }}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              {/* Weekly Days Selection */}
              {formData.recurrence_type === 'weekly' && (
                <div>
                  <Label className="text-slate-300 font-medium text-sm mb-2 block">
                    Days of Week
                  </Label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex flex-col items-center">
                        <Checkbox
                          id={`day-${index}`}
                          checked={formData.weekly_days.includes(index + 1)}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              weekly_days: checked 
                                ? [...prev.weekly_days, index + 1].sort()
                                : prev.weekly_days.filter(d => d !== index + 1)
                            }));
                          }}
                          className="border-slate-600"
                        />
                        <label htmlFor={`day-${index}`} className="text-xs text-slate-400 mt-1 cursor-pointer">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Day Selection */}
              {formData.recurrence_type === 'monthly' && (
                <div>
                  <Label htmlFor="monthly-day" className="text-slate-300 font-medium text-sm">
                    Day of Month
                  </Label>
                  <Input
                    id="monthly-day"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.monthly_day}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      monthly_day: Math.max(1, Math.min(31, parseInt(e.target.value) || 1))
                    }))}
                    className="bg-slate-700 border-slate-600 text-white mt-1 w-20"
                  />
                  <p className="text-slate-400 text-xs mt-1">
                    Quest will repeat on the {formData.monthly_day}
                    {formData.monthly_day === 1 ? 'st' : 
                     formData.monthly_day === 2 ? 'nd' : 
                     formData.monthly_day === 3 ? 'rd' : 'th'} of each month
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Recurring Toggle - Legacy support for Daily quests */}
          {formData.quest_type === 'Daily' && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="is-recurring" className="text-slate-300 font-medium text-sm">
                    Is this a recurring habit? 🔄
                  </Label>
                  <p className="text-slate-400 text-xs mt-1">
                    Recurring habits reset daily. One-time tasks stay completed once done.
                  </p>
                </div>
                <Switch
                  id="is-recurring"
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_recurring: checked }))}
                  className="ml-3"
                />
              </div>
            </div>
          )}

          {/* Pomodoro Timer Option */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="pomodoro-enabled" className="text-slate-300 font-medium text-sm">
                  Enable Pomodoro Timer? 🍅
                </Label>
                <p className="text-slate-400 text-xs mt-1">
                  Add focused work sessions with breaks to this quest
                </p>
              </div>
              <Switch
                id="pomodoro-enabled"
                checked={formData.pomodoro_enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pomodoro_enabled: checked }))}
                className="ml-3"
              />
            </div>
          </div>

          {/* Quest Preview */}
          {formData.quest_name && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Quest Preview:</h4>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getTypeColor(formData.quest_type)} bg-slate-800/50`}>
                  {getTypeIcon(formData.quest_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-white font-medium truncate">{formData.quest_name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-amber-400 border-amber-400/50 text-xs">
                      {currentRewards.xp} XP
                    </Badge>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 text-xs">
                      {currentRewards.gold} Gold
                    </Badge>
                    {formData.quest_type !== 'Daily' && (
                      <Badge className={`${formData.priority === 'High' ? 'bg-red-600' : formData.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white text-xs`}>
                        {formData.priority}
                      </Badge>
                    )}
                    <Badge variant="outline" className={`${getTypeColor(formData.quest_type)} border-current text-xs`}>
                      {formData.quest_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              Create Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewQuestModal;