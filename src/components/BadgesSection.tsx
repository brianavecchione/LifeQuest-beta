import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Coins, Zap, Lock, Star } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievementsWrapper';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  achievement_name: string;
  description: string;
  achievement_progress_current: number;
  achievement_progress_goal: number;
  is_completed: boolean;
  is_unlockable: boolean;
  quest_value?: 'Bronze' | 'Silver' | 'Gold' | 'Legendary';
  xp_reward?: number;
  gold_reward?: number;
  earned_at?: string;
  claimed_at?: string;
  tags?: string[];
}

const BadgesSection = () => {
  const { achievements, loading, claimAchievement } = useAchievements();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('earned');

  // Function to get achievement state
  const getAchievementState = (achievement: Achievement) => {
    if (achievement.is_completed) return 'earned';
    if (achievement.is_unlockable) return 'unlockable';
    return 'locked';
  };

  // Filter achievements based on current filter
  const filteredAchievements = achievements.filter(achievement => {
    const state = getAchievementState(achievement);
    switch (filter) {
      case 'earned':
        return state === 'earned';
      case 'locked':
        return state === 'locked' || state === 'unlockable';
      default:
        return true;
    }
  });

  // Sort achievements: earned first, then unlockable, then locked
  const sortedAchievements = filteredAchievements.sort((a, b) => {
    const stateA = getAchievementState(a);
    const stateB = getAchievementState(b);
    
    const stateOrder = { earned: 0, unlockable: 1, locked: 2 };
    return stateOrder[stateA] - stateOrder[stateB];
  });

  // Get rarity color
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Bronze': return 'text-amber-600 bg-amber-100 border-amber-300';
      case 'Silver': return 'text-slate-600 bg-slate-100 border-slate-300';
      case 'Gold': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Legendary': return 'text-purple-600 bg-purple-100 border-purple-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  // Get rarity emoji
  const getRarityEmoji = (rarity?: string) => {
    switch (rarity) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Legendary': return '👑';
      default: return '🏅';
    }
  };

  // Handle badge claiming
  const handleClaimBadge = async (achievementId: string) => {
    try {
      const result = await claimAchievement(achievementId);
      if (result.success && result.achievement) {
        toast({
          title: "Achievement Claimed! 🎉",
          description: `You've earned the "${result.achievement.achievement_name}" badge!`,
          duration: 5000,
        });

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Error claiming achievement:', error);
      toast({
        title: "Error",
        description: "Failed to claim achievement. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900 border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-400 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-400">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'earned' | 'locked')}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="earned" className="data-[state=active]:bg-green-600">Earned</TabsTrigger>
            <TabsTrigger value="locked" className="data-[state=active]:bg-slate-600">Locked</TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-4">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#64748b #334155' }}>
              {sortedAchievements.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No achievements found for this filter.
                </div>
              ) : (
                sortedAchievements.map((achievement) => {
                  const state = getAchievementState(achievement);
                  const isLocked = state === 'locked';
                  const isEarned = state === 'earned';
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`bg-slate-800/50 rounded-lg p-4 border transition-all duration-200 ${
                        isLocked 
                          ? 'border-slate-600 opacity-60' 
                          : isEarned
                          ? 'border-green-500/50 shadow-green-500/20 shadow-lg'
                          : 'border-yellow-500/50 shadow-yellow-500/20 shadow-lg hover:shadow-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${isLocked ? 'grayscale' : ''}`}>
                          {isLocked ? <Lock className="w-6 h-6 text-slate-500" /> : getRarityEmoji(achievement.quest_value)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                              {achievement.achievement_name}
                            </h3>
                            {achievement.quest_value && (
                              <Badge variant="secondary" className={getRarityColor(achievement.quest_value)}>
                                {achievement.quest_value}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`text-sm ${isLocked ? 'text-slate-600' : 'text-slate-300'}`}>
                            {achievement.description}
                          </p>
                          
                          {/* Progress bar for incomplete achievements */}
                          {!isEarned && achievement.achievement_progress_goal > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>Progress</span>
                                <span>{achievement.achievement_progress_current}/{achievement.achievement_progress_goal}</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    isLocked ? 'bg-slate-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                  }`}
                                  style={{ 
                                    width: `${Math.min((achievement.achievement_progress_current / achievement.achievement_progress_goal) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Rewards */}
                          {(achievement.xp_reward || achievement.gold_reward) && (
                            <div className="flex items-center gap-4 text-sm">
                              {achievement.xp_reward && (
                                <div className={`flex items-center gap-1 ${isLocked ? 'text-slate-600' : 'text-blue-400'}`}>
                                  <Zap className="w-4 h-4" />
                                  <span>{achievement.xp_reward} XP</span>
                                </div>
                              )}
                              {achievement.gold_reward && (
                                <div className={`flex items-center gap-1 ${isLocked ? 'text-slate-600' : 'text-yellow-400'}`}>
                                  <Coins className="w-4 h-4" />
                                  <span>{achievement.gold_reward} Gold</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Date earned */}
                          {isEarned && achievement.earned_at && (
                            <div className="flex items-center gap-1 text-xs text-green-400">
                              <Calendar className="w-3 h-3" />
                              <span>Earned {new Date(achievement.earned_at).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {/* Claim button for completed but unclaimed achievements */}
                          {isEarned && !achievement.claimed_at && (
                            <Button
                              onClick={() => handleClaimBadge(achievement.id)}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                              size="sm"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Claim Badge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BadgesSection;