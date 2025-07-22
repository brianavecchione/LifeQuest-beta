import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpEarned: number;
  goldEarned: number;
}

const FocusMasterModal: React.FC<FocusMasterModalProps> = ({
  isOpen,
  onClose,
  xpEarned,
  goldEarned
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
      });

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 border-amber-600/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-amber-300 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            Focus Master!
            <Trophy className="w-8 h-8 text-amber-400" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Celebration Message */}
          <div className="text-center space-y-2">
            <div className="text-xl font-semibold text-amber-200">
              🎉 Congratulations! 🎉
            </div>
            <p className="text-amber-100 text-lg">
              You completed all your Focus Tasks today without skipping a beat!
            </p>
          </div>

          {/* Rewards Display */}
          <div className="bg-black/20 rounded-lg p-4 border border-amber-600/30">
            <div className="text-center space-y-2">
              <div className="text-amber-300 font-semibold">Bonus Rewards Earned:</div>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-bold">+{xpEarned} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-bold">+{goldEarned} Gold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center text-amber-200 text-sm">
            Keep up the excellent work! Consistency is the key to mastery.
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleClose}
              variant="brand-primary"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8"
            >
              Awesome!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FocusMasterModal;