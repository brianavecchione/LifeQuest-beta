import React, { useState } from 'react';
import { Crown, TrendingUp, Star, Flame, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';
import { useStreaks } from '@/hooks/useStreaksWrapper';
import EditProfileModal from '@/components/EditProfileModal';
import AnimatedValue from '@/components/AnimatedValue';

const CharacterCard = React.memo(() => {
  const { user: character, isLoading } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { balance } = useUserBalance();
  const { getBestStreak, loading: streaksLoading } = useStreaks();
  
  // Add debugging for streak issue
  React.useEffect(() => {
    console.log('🚨 STREAK DEBUG - CharacterCard mounted');
    console.log('🚨 STREAK DEBUG - getBestStreak:', getBestStreak);
    console.log('🚨 STREAK DEBUG - streaksLoading:', streaksLoading);
    const currentStreak = getBestStreak();
    console.log('🚨 STREAK DEBUG - Current streak data:', currentStreak);
  }, [getBestStreak, streaksLoading]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Memoize user data to prevent unnecessary re-renders
  const activeUser = React.useMemo(() => 
    isGuestMode ? guestUser : character, 
    [isGuestMode, guestUser, character]
  );
  
  // Get gold balance from useUserBalance hook
  const goldBalance = isGuestMode ? guestUser.gold : (balance?.current_gold_balance || 0);
  
  const xpProgress = React.useMemo(() => 
    activeUser?.xp || 0, 
    [activeUser?.xp]
  );
  
  const bestStreak = React.useMemo(() => 
    isGuestMode ? { current_streak: 5, streak_name: 'Daily Quests' } : getBestStreak(),
    [isGuestMode, getBestStreak]
  );

  // Helper function to render avatar with frame (increased size further)
  const renderAvatarWithFrame = (avatarData: string, frameClass?: string) => {
    const baseClasses = "w-28 h-28 rounded-full object-cover shadow-lg border-4 border-amber-400/50"; // Reduced by ~12% from w-32 h-32
    const appliedFrameClass = frameClass && frameClass !== 'avatar-frame-none' ? frameClass : '';
    
    if (avatarData && (avatarData.startsWith('data:') || avatarData.startsWith('http'))) {
      return (
        <img 
          src={avatarData} 
          alt={activeUser?.name || 'Avatar'} 
          className={`${baseClasses} ${appliedFrameClass}`}
        />
      );
    } else {
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-5xl font-bold text-slate-900 ${appliedFrameClass}`}>
          {avatarData}
        </div>
      );
    }
  };

  // Show loading state if user data is still loading or if activeUser is not properly set
  if (!isGuestMode && (isLoading || !character?.name)) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 shadow-2xl">
        {/* Loading state - centered layout */}
        <div className="flex flex-col items-center mb-6">
          <Skeleton className="w-28 h-28 rounded-full bg-slate-700 mb-4" />
          <Skeleton className="h-8 w-32 mb-2 bg-slate-700" />
          <Skeleton className="h-6 w-24 mb-1 bg-slate-700" />
          <Skeleton className="h-5 w-20 bg-slate-700" />
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

  // If no activeUser data available, show a fallback
  if (!isGuestMode && (!activeUser || !activeUser.name)) {
    console.log('🚨 CharacterCard: No activeUser data available', { activeUser, isGuestMode, guestUser });
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 shadow-2xl">
        <div className="text-center text-slate-400">
          <p>Character data not available</p>
          <p className="text-xs mt-2">Guest Mode: {isGuestMode ? 'Yes' : 'No'}</p>
          <p className="text-xs">Has Guest User: {guestUser ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  // In guest mode, use guestUser directly to avoid circular reference issues
  const displayUser = isGuestMode ? guestUser : activeUser;

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 pb-4 border border-amber-500/30 shadow-2xl relative h-full flex flex-col transition-all duration-300 ease-in-out">{/* Added smooth transition */}
      {/* Edit Button - Top Right */}
      <div className="absolute top-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2 hover:bg-amber-500/20"
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

      {/* Centered Avatar and Character Info */}
      <div className="flex flex-col items-center mb-4"> {/* Reduced margin from mb-6 to mb-4 */}
        {/* Avatar with Level Badge */}
        <div className="relative mb-3"> {/* Reduced margin from mb-4 to mb-3 */}
          {renderAvatarWithFrame(
            (isGuestMode ? displayUser?.avatar : displayUser?.avatarUrl) || displayUser?.name?.charAt(0) || 'A', 
            displayUser?.avatarFrame
          )}
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-slate-800"> {/* Reduced badge size from w-12 h-12 to w-10 h-10, text from text-xl to text-lg */}
            {displayUser?.level || 1}
          </div>
        </div>
        
        {/* Character Name, Level, and Title - Stacked Vertically */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-400 mb-1">{displayUser?.name || 'Adventurer'}</h2> {/* Reduced margin from mb-2 to mb-1 */}
          <div className="flex items-center justify-center gap-2 text-yellow-300 mb-1"> {/* Reduced margin from mb-2 to mb-1 */}
            <Crown className="w-5 h-5" />
            <span className="text-xl font-semibold">Level {displayUser?.level || 1}</span>
          </div>
          <div className="text-base text-slate-300 font-medium">
            <span>Adventurer</span> {/* Placeholder for class/archetype */}
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-4"> {/* Reduced margin from mb-6 to mb-4 */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-medium">Level Progress</span>
          <span className="text-amber-400 font-bold">
            <AnimatedValue value={displayUser?.xp || 0} format={(val) => `${Math.round(val)}%`} />
          </span>
        </div>
        <div className="relative">
          <Progress 
            value={displayUser?.xp || 0} 
            className="h-3 bg-slate-700 border border-amber-500/20 transition-all duration-500 ease-out" 
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Level {displayUser?.level || 1}</span>
          <span>Level {(displayUser?.level || 1) + 1}</span>
        </div>
      </div>

      {/* Stats Grid - Push to bottom with flex-grow */}
      <div className="grid grid-cols-3 gap-3 mt-auto"> {/* Added mt-auto to push to bottom */}
        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-red-500/30 hover:border-red-500/50 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
            <span className="text-red-400 text-sm font-medium">Total XP</span>
          </div>
          <div className="text-lg font-bold text-white">
            <AnimatedValue value={displayUser?.totalXp || 0} />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-center mb-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 text-sm font-medium">Gold</span>
          </div>
          <div className="text-lg font-bold text-white">
            <AnimatedValue value={goldBalance} />
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 ease-in-out cursor-help">
                <div className="flex items-center justify-center mb-1">
                  <Flame className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-purple-400 text-sm font-medium">Streak</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {streaksLoading ? '...' : (
                    <AnimatedValue 
                      value={bestStreak?.current_streak || 0} 
                      format={(val) => `${Math.round(val)} ${Math.round(val) === 1 ? 'Day' : 'Days'}`}
                    />
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-800 border-purple-500/30">
              <p className="text-sm">
                {(bestStreak?.current_streak || 0) > 0 
                  ? `You've completed at least one quest every day for the past ${bestStreak?.current_streak || 0} ${(bestStreak?.current_streak || 0) === 1 ? 'day' : 'days'}!`
                  : 'Complete a quest to start your streak!'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
});

export default CharacterCard;