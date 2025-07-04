import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Clock, Coffee, Trophy } from 'lucide-react';

interface Quest {
  id: string;
  name: string;
  xp: number;
  type: 'Daily' | 'Main' | 'Side' | 'Legendary';
}

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  quest: Quest | null;
  onTimerStart: (questId: string, duration: number) => void;
}

interface ActiveTimerProps {
  quest: Quest;
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

interface TimerCompleteModalProps {
  isOpen: boolean;
  quest: Quest | null;
  onComplete: () => void;
  onDismiss: () => void;
  bonusXp: number;
  bonusGold: number;
}

interface BreakTimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

interface ActiveBreakTimerProps {
  timeRemaining: number;
  onComplete: () => void;
  onCancel: () => void;
}

const PomodoroSetupModal: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  quest,
  onTimerStart
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const durations = [
    { minutes: 15, label: '15 min', description: 'Quick Sprint', color: 'bg-green-600' },
    { minutes: 25, label: '25 min', description: 'Classic Pomodoro', color: 'bg-blue-600' },
    { minutes: 45, label: '45 min', description: 'Deep Focus', color: 'bg-purple-600' }
  ];

  const handleStart = () => {
    if (selectedDuration && quest) {
      onTimerStart(quest.id, selectedDuration);
      onClose();
      setSelectedDuration(null);
    }
  };

  if (!quest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-amber-600/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Start Quest Timer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quest Info */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <h3 className="text-white font-medium mb-2">{quest.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                {quest.xp} XP
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                {quest.type}
              </Badge>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <h4 className="text-slate-300 font-medium mb-4">Choose your focus duration:</h4>
            <div className="space-y-3">
              {durations.map((duration) => (
                <button
                  key={duration.minutes}
                  onClick={() => setSelectedDuration(duration.minutes)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedDuration === duration.minutes
                      ? 'border-amber-400 bg-amber-400/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-white font-medium">{duration.label}</div>
                      <div className="text-slate-400 text-sm">{duration.description}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${duration.color}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bonus Info */}
          <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-600/30">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="font-medium">Pomodoro Bonus</span>
            </div>
            <p className="text-amber-300 text-sm">
              Complete this quest with the timer for +50% XP and bonus Gold!
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button 
              onClick={handleStart}
              disabled={!selectedDuration}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ActiveTimer: React.FC<ActiveTimerProps> = ({
  quest,
  timeRemaining,
  totalTime,
  isRunning,
  onPause,
  onResume,
  onCancel,
  onComplete
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete();
    }
  }, [timeRemaining, onComplete]);

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 rounded-xl p-4 border border-amber-600/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgb(64 64 64)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgb(245 158 11)"
                strokeWidth="2"
                strokeDasharray={`${progress}, 100`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          
          <div>
            <div className="text-amber-400 font-bold text-lg">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-amber-300 text-sm font-medium truncate max-w-48">
              {quest.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={isRunning ? onPause : onResume}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={onCancel}
            size="sm"
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const TimerCompleteModal: React.FC<TimerCompleteModalProps> = ({
  isOpen,
  quest,
  onComplete,
  onDismiss,
  bonusXp,
  bonusGold
}) => {
  if (!quest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onDismiss}>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-green-600/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
            🎉 Time's Up!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-center">
          <div className="bg-green-900/20 rounded-lg p-6 border border-green-600/30">
            <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Focus Session Complete!</h3>
            <p className="text-green-300 mb-4">You stayed focused on:</p>
            <p className="text-white font-medium text-lg">{quest.name}</p>
          </div>

          <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-600/30">
            <div className="flex items-center justify-center gap-4 text-amber-400">
              <div className="text-center">
                <div className="font-bold text-lg">+{quest.xp + bonusXp}</div>
                <div className="text-sm">XP</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">+{bonusGold}</div>
                <div className="text-sm">Gold</div>
              </div>
            </div>
            <p className="text-amber-300 text-sm mt-2">Pomodoro bonus included!</p>
          </div>

          <div className="space-y-3">
            <p className="text-slate-300">Would you like to mark this quest complete?</p>
            <div className="flex gap-3">
              <Button onClick={onDismiss} variant="outline" className="flex-1 border-slate-600 text-slate-300">
                Not Yet
              </Button>
              <Button onClick={onComplete} className="flex-1 bg-green-600 hover:bg-green-700">
                <Trophy className="w-4 h-4 mr-2" />
                Complete Quest
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BreakTimerModal: React.FC<BreakTimerModalProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => (
  <Dialog open={isOpen} onOpenChange={onDecline}>
    <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-600/30 text-white max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <Coffee className="w-6 h-6" />
          Take a Break?
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 text-center">
        <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-600/30">
          <Coffee className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Great work!</h3>
          <p className="text-blue-300">Would you like to take a 5-minute break?</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onDecline} variant="outline" className="flex-1 border-slate-600 text-slate-300">
            Skip Break
          </Button>
          <Button onClick={onAccept} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Coffee className="w-4 h-4 mr-2" />
            Start Break
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const ActiveBreakTimer: React.FC<ActiveBreakTimerProps> = ({
  timeRemaining,
  onComplete,
  onCancel
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = ((300 - timeRemaining) / 300) * 100; // 5 minutes = 300 seconds

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete();
    }
  }, [timeRemaining, onComplete]);

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-xl p-4 border border-blue-600/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgb(64 64 64)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgb(59 130 246)"
                strokeWidth="2"
                strokeDasharray={`${progress}, 100`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          
          <div>
            <div className="text-blue-400 font-bold text-lg">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-blue-300 text-sm font-medium">
              Break Time - Relax & Recharge
            </div>
          </div>
        </div>

        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
        >
          <Square className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export {
  PomodoroSetupModal,
  ActiveTimer,
  TimerCompleteModal,
  BreakTimerModal,
  ActiveBreakTimer
};