import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Flag, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  name: string;
  description?: string;
  status: 'Not started' | 'In Progress' | 'Completed';
  xp: number;
  type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  tags?: string[];
}

interface NewQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestCreated: (quest: Quest) => void;
  currentQuestCount?: number;
  maxQuests?: number;
  defaultType?: 'Daily' | 'Main' | 'Side' | 'Legendary';
}

const NewQuestModal: React.FC<NewQuestModalProps> = ({ 
  isOpen, 
  onClose, 
  onQuestCreated,
  currentQuestCount = 0,
  maxQuests = 5,
  defaultType = 'Main'
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    xp: '',
    type: defaultType as Quest['type'],
    priority: 'Medium' as Quest['priority'],
    tags: '',
  });

  // Update form when defaultType changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, type: defaultType }));
  }, [defaultType]);

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'Daily': return <Star className="w-4 h-4" />;
      case 'Main': return <Trophy className="w-4 h-4" />;
      case 'Side': return <Flag className="w-4 h-4" />;
      case 'Legendary': return <Crown className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'Daily': return 'border-yellow-500/50 text-yellow-400';
      case 'Main': return 'border-red-500/50 text-red-400';
      case 'Side': return 'border-blue-500/50 text-blue-400';
      case 'Legendary': return 'border-purple-500/50 text-purple-400';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.xp) {
      toast({
        title: "Missing Information",
        description: "Please fill in the quest name and XP value.",
        variant: "destructive"
      });
      return;
    }

    const xpValue = parseInt(formData.xp);
    if (isNaN(xpValue) || xpValue < 1) {
      toast({
        title: "Invalid XP Value",
        description: "XP must be a positive number.",
        variant: "destructive"
      });
      return;
    }

    const newQuest: Quest = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      status: 'Not started',
      xp: xpValue,
      type: formData.type,
      priority: formData.priority,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    };

    onQuestCreated(newQuest);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      xp: '',
      type: 'Main',
      priority: 'Medium',
      tags: '',
    });

    toast({
      title: "Quest Created! 🎯",
      description: `${newQuest.name} has been added to your quest log.`,
    });

    onClose();
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
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                value={formData.type} 
                onValueChange={(value: Quest['type']) => setFormData(prev => ({ ...prev, type: value }))}
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

            {/* Priority */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* XP Value */}
            <div>
              <Label htmlFor="quest-xp" className="text-slate-300 font-medium">
                XP Reward *
              </Label>
              <Input
                id="quest-xp"
                type="number"
                value={formData.xp}
                onChange={(e) => setFormData(prev => ({ ...prev, xp: e.target.value }))}
                placeholder="e.g., 50"
                className="bg-slate-700 border-slate-600 text-white mt-1"
                min="1"
                max="1000"
              />
              <p className="text-xs text-slate-400 mt-1">
                Suggested: Daily (10-30), Side (30-100), Main (100-300), Legendary (500+)
              </p>
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
              <p className="text-xs text-slate-400 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Quest Preview */}
          {formData.name && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Quest Preview:</h4>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getTypeColor(formData.type)} bg-slate-800/50`}>
                  {getTypeIcon(formData.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-white font-medium truncate">{formData.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-amber-400 border-amber-400/50 text-xs">
                      {formData.xp || 0} XP
                    </Badge>
                    <Badge className={`${formData.priority === 'High' ? 'bg-red-600' : formData.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'} text-white text-xs`}>
                      {formData.priority}
                    </Badge>
                    <Badge variant="outline" className={`${getTypeColor(formData.type)} border-current text-xs`}>
                      {formData.type}
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