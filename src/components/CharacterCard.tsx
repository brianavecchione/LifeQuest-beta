import React, { useState } from 'react';
import { Crown, TrendingUp, Star, Flame, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';
import { useStreaks } from '@/hooks/useStreaksWrapper';
import EditProfileModal from '@/components/EditProfileModal';

const CharacterCard = () => {
  const { user: character, isLoading } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { getBestStreak, loading: streaksLoading } = useStreaks();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const activeUser = isGuestMode ? guestUser : character;
  const xpProgress = activeUser.xp;
  const bestStreak = isGuestMode ? { current_streak: 5, streak_name: 'Daily Quests' } : getBestStreak();

  // Helper function to render avatar with frame - Enhanced for RPG style
  const renderAvatarWithFrame = (avatarData: string, frameClass?: string) => {
    const baseClasses = "w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-amber-400/60";
    const appliedFrameClass = frameClass && frameClass !== 'avatar-frame-none' && frameClass !== 'none' ? frameClass : '';
    
    if (avatarData && (avatarData.startsWith('data:') || avatarData.startsWith('http'))) {
      return (
        <img 
          src={avatarData} 
          alt={activeUser.name} 
          className={`${baseClasses} ${appliedFrameClass}`}
        />
      );
    } else {
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-4xl font-bold text-slate-900 ${appliedFrameClass}`}>
          {avatarData}
        </div>
      );
    }
  };

  // Show loading state if user data is still loading
  if (!isGuestMode && (isLoading || !character.name)) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-24 h-24 rounded-full bg-slate-700" />
          <div>
            <Skeleton className="h-8 w-32 mb-2 bg-slate-700" />
            <Skeleton className="h-6 w-24 bg-slate-700" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-24 bg-slate-700" />
              <Skeleton className="h-5 w-16 bg-slate-700" />
            </div>
            <Skeleton className="h-3 w-full bg-slate-700" />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Skeleton className="h-20 bg-slate-700" />
            <Skeleton className="h-20 bg-slate-700" />
            <Skeleton className="h-20 bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/40 shadow-2xl overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-purple-400/5 rounded-2xl"></div>
      <div className="absolute inset-0 ring-1 ring-inset ring-amber-400/20 rounded-2xl"></div>
      
      {/* Settings Button - Top Right Corner */}
      <div className="absolute top-4 right-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 hover:bg-amber-500/20 bg-slate-800/60 backdrop-blur-sm border border-amber-500/30"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Settings className="w-4 h-4 text-amber-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Character Avatar - Centered and Prominent */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-6">
          {/* Enhanced avatar with larger size and better frame display */}
          <div className="relative">
            {renderAvatarWithFrame(activeUser.avatar, activeUser.avatarFrame)}
            {/* Level badge - positioned on avatar */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center border-4 border-slate-800 shadow-xl">
              <span className="text-lg font-bold">{activeUser.level}</span>
            </div>
          </div>
        </div>

        {/* Character Info - Centered */}
        <div className="space-y-3 mb-6">
          <h2 className="text-3xl font-bold text-amber-400 tracking-wide">{activeUser.name}</h2>
          
          <div className="flex items-center justify-center gap-3 text-yellow-300">
            <Crown className="w-6 h-6" />
            <span className="text-xl font-semibold">Level {activeUser.level}</span>
          </div>
          
          <div className="text-slate-400 text-lg font-medium">
            <span>⚔️ Adventurer</span>
          </div>
        </div>

        {/* Level Progress Bar - Prominent Display */}
        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 font-medium text-sm">Level Progress</span>
            <span className="text-amber-400 font-bold text-sm">{Math.round(activeUser.xp)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={xpProgress} 
              className="h-4 bg-slate-700/80 border border-amber-500/30 shadow-inner" 
            />
            {/* Glow effect on progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full opacity-50"></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Level {activeUser.level}</span>
            <span>Level {activeUser.level + 1}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - RPG Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total XP Stat */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
          <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-red-500/40 hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-400 text-sm font-semibold tracking-wide">TOTAL XP</span>
            </div>
            <div className="text-2xl font-bold text-white">{activeUser.totalXp.toLocaleString()}</div>
          </div>
        </div>

        {/* Gold Stat */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
          <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-500/40 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-semibold tracking-wide">GOLD</span>
            </div>
            <div className="text-2xl font-bold text-white">{activeUser.gold.toLocaleString()}</div>
          </div>
        </div>

        {/* Streak Stat */}
        <div className="group relative sm:col-span-1 col-span-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                  <div className="relative bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-purple-500/40 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-center justify-center mb-2">
                      <Flame className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-purple-400 text-sm font-semibold tracking-wide">STREAK</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {streaksLoading ? '...' : `${bestStreak.current_streak}`}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {bestStreak.current_streak === 1 ? 'Day' : 'Days'}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-800 border-purple-500/30 max-w-xs">
                <p className="text-sm text-center">
                  {bestStreak.current_streak > 0 
                    ? `You've completed at least one quest every day for the past ${bestStreak.current_streak} ${bestStreak.current_streak === 1 ? 'day' : 'days'}! Keep it up, hero!`
                    : 'Complete a quest to start your adventure streak!'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default CharacterCard;