import React from 'react';
import { Crown, TrendingUp, Star, Flame, Settings, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';
import { useStreaks } from '@/hooks/useStreaksWrapper';

const CharacterCard = () => {
  const { user: character, isLoading } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  const { getBestStreak, loading: streaksLoading } = useStreaks();
  
  const activeUser = isGuestMode ? guestUser : character;
  const xpProgress = activeUser.xp;
  const bestStreak = isGuestMode ? { current_streak: 5, streak_name: 'Daily Quests' } : getBestStreak();

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
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 shadow-2xl">
      {/* Header with Character Portrait and Basic Info */}
      <div className="flex items-center gap-4 mb-6">
        {activeUser.avatar && (activeUser.avatar.startsWith('data:') || activeUser.avatar.startsWith('http')) ? (
          <div className="relative">
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-amber-400/50"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {activeUser.level}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg border-4 border-amber-400/50">
              {activeUser.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {activeUser.level}
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-amber-400 mb-1">{activeUser.name}</h2>
          <div className="flex items-center gap-2 text-yellow-300 mb-2">
            <Crown className="w-5 h-5" />
            <span className="text-lg font-semibold">Level {activeUser.level}</span>
          </div>
          <div className="text-sm text-slate-400">
            <span>Adventurer</span> {/* Placeholder for class/archetype */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="p-2 hover:bg-amber-500/20">
                  <Settings className="w-4 h-4 text-amber-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>View Stats</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="p-2 hover:bg-amber-500/20">
                  <User className="w-4 h-4 text-amber-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-medium">Level Progress</span>
          <span className="text-amber-400 font-bold">{Math.round(activeUser.xp)}%</span>
        </div>
        <Progress 
          value={xpProgress} 
          className="h-3 bg-slate-700 border border-amber-500/20" 
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Level {activeUser.level}</span>
          <span>Level {activeUser.level + 1}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-red-500/30 hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
            <span className="text-red-400 text-sm font-medium">Total XP</span>
          </div>
          <div className="text-xl font-bold text-white">{activeUser.totalXp}</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center justify-center mb-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 text-sm font-medium">Gold</span>
          </div>
          <div className="text-xl font-bold text-white">{activeUser.gold}</div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-help">
                <div className="flex items-center justify-center mb-1">
                  <Flame className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-purple-400 text-sm font-medium">Streak</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {streaksLoading ? '...' : `${bestStreak.current_streak} ${bestStreak.current_streak === 1 ? 'Day' : 'Days'}`}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-800 border-purple-500/30">
              <p className="text-sm">
                {bestStreak.current_streak > 0 
                  ? `You've completed at least one quest every day for the past ${bestStreak.current_streak} ${bestStreak.current_streak === 1 ? 'day' : 'days'}!`
                  : 'Complete a quest to start your streak!'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CharacterCard;