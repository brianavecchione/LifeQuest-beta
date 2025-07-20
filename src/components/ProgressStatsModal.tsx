import React from 'react';
import { Coins, CheckCircle2, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProgressStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: 'week' | 'month';
  goldEarned: number | null;
  questsCompleted: number | null;
  levelProgress: number | null;
}

const ProgressStatsModal = ({
  isOpen,
  onClose,
  period,
  goldEarned,
  questsCompleted,
  levelProgress
}: ProgressStatsModalProps) => {
  const periodLabel = period === 'week' ? 'Weekly' : 'Monthly';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-yellow-500/20 max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Your {periodLabel} Progress
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Gold Earned */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Gold</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {goldEarned === null ? '—' : goldEarned}
            </div>
            <div className="text-xs text-slate-400">
              {goldEarned === null ? 'Data not yet available' : `Earned This ${period === 'week' ? 'Week' : 'Month'}`}
            </div>
          </div>

          {/* Quests Completed */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Quests</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {questsCompleted === null ? '—' : questsCompleted}
            </div>
            <div className="text-xs text-slate-400">
              {questsCompleted === null ? 'Data not yet available' : `Completed This ${period === 'week' ? 'Week' : 'Month'}`}
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full border-2 border-purple-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
              <span className="text-purple-400 text-sm font-medium">Level</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {levelProgress === null ? '—' : `${levelProgress}%`}
            </div>
            <div className="text-xs text-slate-400 mb-2">
              {levelProgress === null 
                ? 'Data not yet available' 
                : levelProgress === 0
                ? `No progress this ${period}`
                : `Progress This ${period === 'week' ? 'Week' : 'Month'}`
              }
            </div>
            {levelProgress !== null && (
              <Progress 
                value={levelProgress} 
                className="h-2 bg-slate-600/50"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressStatsModal;