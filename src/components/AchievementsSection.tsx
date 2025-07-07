
import React, { useState, useEffect } from 'react';
import { Trophy, Target, Flame, Calendar, Clock, Star, TrendingUp, Users, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Achievement {
  id: string;
  achievement_name: string;
  description: string;
  achievement_progress_current: number;
  achievement_progress_goal: number;
  is_completed: boolean;
  quest_value: 'Bronze' | 'Silver' | 'Gold' | 'Legendary';
  xp_reward: number;
  gold_reward: number;
  earned_at: string | null;
  tags: string[] | null;
}

interface Streak {
  id: string;
  streak_name: string;
  description: string;
  current_streak: number;
  best_streak: number;
  status: 'Active' | 'Inactive';
}

const AchievementsSection = () => {
  const { user: authUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'achievements' | 'streaks'>('achievements');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      initializeUserAchievements();
    }
  }, [authUser]);

  const initializeUserAchievements = async () => {
    try {
      // First check if user has any achievements
      const { data: existingAchievements } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', authUser?.id)
        .limit(1);

      // If no achievements exist, seed them
      if (!existingAchievements || existingAchievements.length === 0) {
        console.log('No achievements found, seeding...');
        const { error: seedError } = await supabase.rpc('seed_comprehensive_badges', {
          p_user_id: authUser?.id
        });
        
        if (seedError) {
          console.error('Error seeding achievements:', seedError);
        } else {
          console.log('Achievements seeded successfully');
        }
      }

      // Check if user has any streaks
      const { data: existingStreaks } = await supabase
        .from('streaks')
        .select('id')
        .eq('user_id', authUser?.id)
        .limit(1);

      // If no streaks exist, seed them
      if (!existingStreaks || existingStreaks.length === 0) {
        console.log('No streaks found, seeding...');
        const { error: streakError } = await supabase.rpc('seed_basic_streaks', {
          p_user_id: authUser?.id
        });
        
        if (streakError) {
          console.error('Error seeding streaks:', streakError);
        } else {
          console.log('Streaks seeded successfully');
        }
      }

      // Fetch achievements and streaks
      await Promise.all([fetchAchievements(), fetchStreaks()]);
    } catch (error) {
      console.error('Error initializing achievements:', error);
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', authUser?.id)
        .order('is_completed', { ascending: false })
        .order('quest_value', { ascending: true });

      if (error) throw error;
      console.log('Achievements fetched:', data);
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchStreaks = async () => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', authUser?.id)
        .order('status', { ascending: false })
        .order('current_streak', { ascending: false });

      if (error) throw error;
      setStreaks(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streaks:', error);
      setLoading(false);
    }
  };

  const getCompletionStatus = (current: number, goal: number, isCompleted: boolean) => {
    if (isCompleted) return 'Completed';
    if (current > 0) return 'In Progress';
    return 'Not Started';
  };

  const getAchievementIcon = (name: string, tier: string) => {
    const icons: Record<string, string> = {
      'Quest Initiate': '🏆',
      'Focus Master': '🎯',
      'Quest Collector': '📚',
      'Legendary Hero': '👑',
      'Streak Champion': '🔥',
      'Social Butterfly': '🦋'
    };
    return icons[name] || (tier === 'Legendary' ? '👑' : tier === 'Gold' ? '🥇' : tier === 'Silver' ? '🥈' : '🥉');
  };

  const getStreakIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Daily Habit Streak': '🔥',
      'Reading Streak': '📖',
      'Exercise Streak': '💪'
    };
    return icons[name] || '⭐';
  };

  if (loading) {
    return <div className="text-center text-slate-300">Loading achievements...</div>;
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Bronze': return 'bg-amber-700';
      case 'Silver': return 'bg-slate-500';
      case 'Gold': return 'bg-yellow-500';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-emerald-400">Achievements & Streaks</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab('achievements')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'achievements' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Target className="w-4 h-4 mr-1 inline" />
              Achievements
            </button>
            <button
              onClick={() => setCurrentTab('streaks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'streaks' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Flame className="w-4 h-4 mr-1 inline" />
              Streaks
            </button>
          </div>
        </div>

        {currentTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <div key={achievement.id} className={`rounded-lg p-4 border transition-all ${
                  achievement.is_completed 
                    ? 'bg-emerald-900/30 border-emerald-500/50' 
                    : 'bg-slate-700/50 border-slate-600/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${achievement.is_completed ? '' : 'opacity-50'}`}>
                      {getAchievementIcon(achievement.achievement_name, achievement.quest_value)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold">{achievement.achievement_name}</h4>
                        <Badge className={`${getRarityColor(achievement.quest_value)} text-white`}>
                          {achievement.quest_value}
                        </Badge>
                        {achievement.is_completed && (
                          <Badge className="bg-emerald-600 text-white">
                            +{achievement.xp_reward} XP
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-slate-400">
                          {getCompletionStatus(achievement.achievement_progress_current, achievement.achievement_progress_goal, achievement.is_completed)}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{achievement.description}</p>
                      {achievement.tags && achievement.tags.length > 0 && (
                        <div className="flex gap-1 mb-2 flex-wrap">
                          {achievement.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Progress value={(achievement.achievement_progress_current / achievement.achievement_progress_goal) * 100} className="flex-1 h-2" />
                        <span className="text-slate-400 text-sm">
                          {achievement.achievement_progress_current}/{achievement.achievement_progress_goal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-50" />
                <p className="text-emerald-400 font-medium text-lg mb-2">No achievements earned yet</p>
                <p className="text-emerald-300 text-sm">Complete quests to unlock them!</p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'streaks' && (
          <div className="space-y-4">
            {streaks.length > 0 ? (
              streaks.map((streak, index) => (
                <div key={streak.id} className={`rounded-lg p-4 border transition-all ${
                  streak.status === 'Active' 
                    ? 'bg-orange-900/30 border-orange-500/50' 
                    : 'bg-slate-700/50 border-slate-600/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${streak.status === 'Active' ? '' : 'opacity-50'}`}>
                      {getStreakIcon(streak.streak_name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold">{streak.streak_name}</h4>
                        {streak.status === 'Active' && (
                          <Badge className="bg-orange-600 text-white">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{streak.description}</p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-400 font-medium">
                            Current: {streak.current_streak}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">
                            Best: {streak.best_streak}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4 opacity-50" />
                <p className="text-orange-400 font-medium text-lg mb-2">You haven't started any streaks</p>
                <p className="text-orange-300 text-sm">Build consistency to unlock powerful streak bonuses!</p>
              </div>
            )}
          </div>
        )}

        {/* Badge System - Integrated */}
        <div className="mt-8 space-y-6">
          {/* Earned Badges */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
              🏆 Earned Badges ({achievements.filter(a => a.is_completed).length})
            </h4>
            
            {achievements.filter(a => a.is_completed).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {achievements.filter(a => a.is_completed).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="bg-slate-700/50 border-slate-600/50 hover:border-green-500/50 rounded-lg p-4 border transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getRarityEmoji(achievement.quest_value)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(achievement.tags || [])}
                          <h3 className="font-bold text-white">
                            {achievement.achievement_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getRarityColor(achievement.quest_value)} text-white text-xs`}>
                            {achievement.quest_value}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {getCategoryName(achievement.tags || [])}
                          </span>
                        </div>
                        <p className="text-sm mb-2 text-slate-300">
                          {achievement.description}
                        </p>
                        {achievement.earned_at && (
                          <p className="text-green-400 text-xs">
                            Earned {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="w-10 h-10 text-green-400 mx-auto mb-3 opacity-50" />
                <p className="text-green-400 font-medium mb-1">No badges earned yet</p>
                <p className="text-green-300 text-sm">Complete quests and explore features to unlock your first badges!</p>
              </div>
            )}
          </div>

          {/* Available Badges */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              🔒 Available Badges ({achievements.filter(a => !a.is_completed).length})
            </h4>
            
            {achievements.filter(a => !a.is_completed).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {achievements.filter(a => !a.is_completed).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="bg-slate-700/30 border-slate-600/30 opacity-75 rounded-lg p-4 border transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        🔒
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(achievement.tags || [])}
                          <h3 className="font-bold text-slate-300">
                            {achievement.achievement_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getRarityColor(achievement.quest_value)} text-white text-xs opacity-75`}>
                            {achievement.quest_value}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {getCategoryName(achievement.tags || [])}
                          </span>
                        </div>
                        <p className="text-sm mb-2 text-slate-400">
                          {achievement.description}
                        </p>
                        <div className="bg-slate-600 rounded-full h-2 mb-1">
                          <div 
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (achievement.achievement_progress_current / achievement.achievement_progress_goal) * 100)}%` }}
                          />
                        </div>
                        <span className="text-amber-400 text-xs font-medium">
                          {achievement.achievement_progress_current}/{achievement.achievement_progress_goal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-50" />
                <p className="text-amber-400 font-medium mb-1">All badges earned!</p>
                <p className="text-amber-300 text-sm">You've completed every challenge - amazing work!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Helper functions for badge rendering
  function getRarityEmoji(rarity: string) {
    switch (rarity) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Legendary': return '👑';
      default: return '🏆';
    }
  }

  function getCategoryIcon(tags: string[]) {
    if (tags?.includes('progress') || tags?.includes('leveling')) return <TrendingUp className="w-4 h-4" />;
    if (tags?.includes('social') || tags?.includes('collaboration')) return <Users className="w-4 h-4" />;
    if (tags?.includes('focus') || tags?.includes('planning')) return <Target className="w-4 h-4" />;
    if (tags?.includes('fun') || tags?.includes('customization')) return <Sparkles className="w-4 h-4" />;
    if (tags?.includes('quests') || tags?.includes('habits')) return <Zap className="w-4 h-4" />;
    return <Trophy className="w-4 h-4" />;
  }

  function getCategoryName(tags: string[]) {
    if (tags?.includes('progress') || tags?.includes('leveling')) return 'Progress & Consistency';
    if (tags?.includes('social') || tags?.includes('collaboration')) return 'Social & Party Play';
    if (tags?.includes('focus') || tags?.includes('planning')) return 'Focus & Planning';
    if (tags?.includes('fun') || tags?.includes('customization')) return 'Fun & Surprise';
    if (tags?.includes('quests') || tags?.includes('habits')) return 'Quest & Learning';
    return 'General';
  }
};

export default AchievementsSection;
