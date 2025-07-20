import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Settings, Target, Trophy, Crown, Palette, Users } from 'lucide-react';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalkthroughModal: React.FC<WalkthroughModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to LifeQuest!",
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg text-slate-300">
            Your journey begins here. Let's walk you through the basics so you can start turning your real-life goals into epic quests.
          </p>
        </div>
      )
    },
    {
      title: "Choose Your Character",
      icon: <Settings className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Click the gear icon on the Today page to pick your avatar and username—this is how you'll appear in the LifeQuest world.
          </p>
          <p className="text-slate-400 text-sm">
            Don't worry, you can always change it later!
          </p>
        </div>
      )
    },
    {
      title: "Add Your First Quests",
      icon: <Target className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Go to the Quests page and click "New Quest" to get started. Use the quest types to organize your goals:
          </p>
          <div className="space-y-2 pl-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-300"><strong>Daily Quests</strong> for habits (e.g., meditate, stretch)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-300"><strong>Main Quests</strong> for bigger tasks or projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-300"><strong>Side Quests</strong> for small to-dos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-slate-300"><strong>Legendary Quests</strong> for long-term life goals</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set Today's Focus",
      icon: <Target className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            On the Today page, use Quick Daily Setup to choose your 3–5 top priorities. Completing these earns bonus XP and Gold.
          </p>
        </div>
      )
    },
    {
      title: "Earn XP and Gold",
      icon: <Trophy className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Complete quests to gain XP (experience points) and Gold.
          </p>
          <div className="space-y-2 pl-4">
            <p className="text-slate-300">• <strong>XP</strong> helps you level up</p>
            <p className="text-slate-300">• <strong>Gold</strong> can be spent in the Gold Shop (under the Inventory tab) on custom rewards you create</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-300 text-sm">
              <strong>Example:</strong> "Finish weekly report" → +10 XP, +10 Gold
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            Customize your rewards to stay motivated and make your progress more rewarding.
          </p>
        </div>
      )
    },
    {
      title: "Track Your Progress",
      icon: <Trophy className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Visit the Achievements page to track your streaks, earn badges, and see your stats grow as you level up.
          </p>
        </div>
      )
    },
    {
      title: "Customize Your World",
      icon: <Palette className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2 pl-4">
            <p className="text-slate-300">• Upload a custom background under Customization in your profile dropdown</p>
            <p className="text-slate-300">• Tap the headphone icon in the bottom-right to play the LifeQuest soundtrack—or use your own while you quest</p>
          </div>
        </div>
      )
    },
    {
      title: "Join the Community",
      icon: <Users className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Join Our{' '}
            <a 
              href="https://discord.com/invite/bETS24vqr6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline"
            >
              Discord
            </a>
            {' '}to chat with fellow adventurers, share your goals, and get inspired.
          </p>
        </div>
      )
    },
    {
      title: "Ready to start your quest?",
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-slate-300">
            Head to the Today tab to start your quest. You can always revisit this tutorial in the Help & FAQ section.
          </p>
          <p className="text-xl font-bold text-amber-400">
            Let the adventure begin!
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900/95 border-slate-700 text-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-amber-400 flex items-center gap-3">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-slate-400 hover:text-white"
            >
              Skip
            </Button>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-amber-400'
                    : index < currentStep
                    ? 'bg-amber-600'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="py-6 min-h-[200px]">
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <span className="text-sm text-slate-400">
            {currentStep + 1} of {steps.length}
          </span>

          <Button
            onClick={nextStep}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Start Quest
                <Crown className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalkthroughModal;