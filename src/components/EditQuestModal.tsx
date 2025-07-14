import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Star, Trophy, Flag, Crown, CalendarIcon, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 
import { Quest } from '@/hooks/useQuests';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EditQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: Quest | null;
  onQuestUpdated: () => void;
}

const EditQuestModal: React.FC<EditQuestModalProps> = ({ 
  isOpen, 
  onClose, 
  quest,
  onQuestUpdated
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    quest_name: '',
    description: '',
    xp_reward: '',
    gold_reward: '',
    quest_type: 'Main' as Quest['quest_type'],
    priority: 'Medium' as Quest['priority'],
    tags: '',
    due_date: null as Date | null,
  });

  // Initialize form data when quest changes
  useEffect(() => {
    if (quest) {
      setFormData({
        quest_name: quest.quest_name,
        description: quest.description || '',
        xp_reward: quest.xp_reward.toString(),
        gold_reward: quest.gold_reward.toString(),
        quest_type: quest.quest_type,
        priority: quest.priority,
        tags: quest.tags ? quest.tags.join(', ') : '',
        due_date: quest.due_date ? new Date(quest.due_date) : null,
      });
    }
  }, [quest]);

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
    
    if (!quest || !user) return;

    if (!formData.quest_name.trim() || !formData.xp_reward || !formData.gold_reward) {
      toast({
        title: "Missing Information",
        description: "Please fill in the quest name, XP value, and Gold reward.",
        variant: "destructive"
      });
      return;
    }

    const xpValue = parseInt(formData.xp_reward);
    if (isNaN(xpValue) || xpValue < 1) {
      toast({
        title: "Invalid XP Value",
        description: "XP must be a positive number.",
        variant: "destructive"
      });
      return;
    }

    const goldValue = parseInt(formData.gold_reward);
    if (isNaN(goldValue) || goldValue < 0) {
      toast({
        title: "Invalid Gold Value",
        description: "Gold must be a non-negative number.",
        variant: "destructive"
      });
      return;
    }

    // Auto-assign due date for Daily quests to today
    const finalDueDate = formData.quest_type === 'Daily' 
      ? format(new Date(), 'yyyy-MM-dd')
      : formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : null;

    try {
      const { error } = await supabase
        .from('quests')
        .update({
          quest_name: formData.quest_name.trim(),
          description: formData.description.trim() || null,
          xp_reward: xpValue,
          gold_reward: goldValue,
          quest_type: formData.quest_type,
          priority: formData.quest_type === 'Daily' ? 'Medium' : formData.priority, // Default Medium for Daily quests
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : null,
          due_date: finalDueDate,
        })
        .eq('id', quest.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Quest Updated! ✏️',
        description: `${formData.quest_name} has been updated successfully.`,
      });

      onQuestUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating quest:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quest. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!quest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-400 text-xl flex items-center gap-2">
            <Edit className="w-6 h-6" />
            Edit Quest
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Update your quest details. Choose your quest type and set the XP reward!
          </DialogDescription>
        </DialogHeader>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quest Type */}
            <div>
              <Label className="text-slate-300 font-medium mb-2 block">Quest Type</Label>
              <Select 
                value={formData.quest_type} 
                onValueChange={(value: Quest['quest_type']) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    quest_type: value,
                    // Auto-set default XP for Daily quests if switching to Daily
                    xp_reward: value === 'Daily' && !prev.xp_reward ? '5' : prev.xp_reward
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* XP Value */}
            <div>
              <Label htmlFor="quest-xp" className="text-slate-300 font-medium">
                XP Reward *
              </Label>
              <Input
                id="quest-xp"
                type="number"
                value={formData.xp_reward}
                onChange={(e) => setFormData(prev => ({ ...prev, xp_reward: e.target.value }))}
                placeholder="e.g., 50"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                min="1"
                max="1000"
              />
            </div>

            {/* Gold Value */}
            <div>
              <Label htmlFor="quest-gold" className="text-slate-300 font-medium">
                Gold Reward *
              </Label>
              <Input
                id="quest-gold"
                type="number"
                value={formData.gold_reward}
                onChange={(e) => setFormData(prev => ({ ...prev, gold_reward: e.target.value }))}
                placeholder="e.g., 25"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                min="0"
                max="1000"
              />
            </div>

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
                      {formData.xp_reward || 0} XP
                    </Badge>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 text-xs">
                      {formData.gold_reward || 0} Gold
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestModal;