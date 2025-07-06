import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    priorityFilter: string;
    typeFilter: string;
    statusFilter: string;
    xpRange: number[];
    goldRange: number[];
    dueDateFilter: string;
  };
  onApplyFilters: (filters: {
    priorityFilter: string;
    typeFilter: string;
    statusFilter: string;
    xpRange: number[];
    goldRange: number[];
    dueDateFilter: string;
  }) => void;
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  // Local state for modal filters (so changes aren't applied until user clicks Apply)
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local state when modal opens with current filters
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      priorityFilter: 'all',
      typeFilter: 'all',
      statusFilter: 'all',
      xpRange: [1000],
      goldRange: [0, 200],
      dueDateFilter: 'all'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-xl flex items-center gap-2">
            <Filter className="w-6 h-6" />
            Filter Quests
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Refine your quest list by adjusting the filters below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <div className="min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-2 block">Priority</label>
              <Select 
                value={localFilters.priorityFilter} 
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, priorityFilter: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50 h-9 sm:h-auto text-sm">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white z-[60]">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-2 block">Quest Type</label>
              <Select 
                value={localFilters.typeFilter} 
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, typeFilter: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50 h-9 sm:h-auto text-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white z-[60]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Daily">Dailies</SelectItem>
                  <SelectItem value="Main">Main Quests</SelectItem>
                  <SelectItem value="Side">Side Quests</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-2 block">Status</label>
              <Select 
                value={localFilters.statusFilter} 
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, statusFilter: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50 h-9 sm:h-auto text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white z-[60]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Not started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date Filter */}
            <div className="min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-2 block">Due Date</label>
              <Select 
                value={localFilters.dueDateFilter} 
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, dueDateFilter: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white z-50 h-9 sm:h-auto text-sm">
                  <SelectValue placeholder="All Due Dates" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white z-[60]">
                  <SelectItem value="all">All Due Dates</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="dueToday">Due Today</SelectItem>
                  <SelectItem value="dueThisWeek">Due This Week</SelectItem>
                  <SelectItem value="noDueDate">No Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* XP Range Filter */}
            <div className="min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-2 block">
                Max XP: {localFilters.xpRange[0]}
              </label>
              <Slider
                value={localFilters.xpRange}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, xpRange: value }))}
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
            <div className="min-w-0">
              <label className="text-xs sm:text-sm font-medium text-slate-300 mb-2 block">
                Gold: {localFilters.goldRange[0]} - {localFilters.goldRange[1]}
              </label>
              <Slider
                value={localFilters.goldRange}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, goldRange: value }))}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;