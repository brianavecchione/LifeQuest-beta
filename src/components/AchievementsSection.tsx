import React, { useState, useEffect } from 'react';
import { Trophy, Target, Flame, TrendingUp, Users, Sparkles, Zap, Filter, Star } from 'lucide-react';
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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [showStreaks, setShowStreaks] = useState(false);

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

  // Filter achievements based on current filters
  const filteredAchievements = achievements.filter(achievement => {
    const statusMatch = filter === 'all' || 
      (filter === 'earned' && achievement.is_completed) ||
      (filter === 'locked' && !achievement.is_completed);

    return statusMatch;
  });

  const getCategoryFromTag = (tag: string): string => {
    const categoryMap: Record<string, string> = {
      'progress': 'Progress & Consistency',
      'leveling': 'Progress & Consistency',
      'consistency': 'Progress & Consistency',
      'habits': 'Quest & Learning',
      'quests': 'Quest & Learning',
      'completion': 'Quest & Learning',
      'social': 'Social & Party Play',
      'collaboration': 'Social & Party Play',
      'leadership': 'Social & Party Play',
      'focus': 'Focus & Planning',
      'planning': 'Focus & Planning',
      'organization': 'Focus & Planning',
      'fun': 'Fun & Surprise',
      'customization': 'Fun & Surprise',
      'beta': 'Fun & Surprise',
      'special': 'Fun & Surprise'
    };
    return categoryMap[tag] || 'General';
  };

  const categories = ['all', 'Progress & Consistency', 'Quest & Learning', 'Social & Party Play', 'Focus & Planning', 'Fun & Surprise'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Bronze': return 'bg-amber-700';
      case 'Silver': return 'bg-slate-500';
      case 'Gold': return 'bg-yellow-500';
      case 'Legendary': return 'bg-purple-600';
      default: return 'bg-slate-600';
    }
  };

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Legendary': return '👑';
      default: return '🏆';
    }
  };

  const getCategoryIcon = (tags: string[]) => {
    if (tags?.includes('progress') || tags?.includes('leveling')) return <TrendingUp className="w-4 h-4" />;
    if (tags?.includes('social') || tags?.includes('collaboration')) return <Users className="w-4 h-4" />;
    if (tags?.includes('focus') || tags?.includes('planning')) return <Target className="w-4 h-4" />;
    if (tags?.includes('fun') || tags?.includes('customization')) return <Sparkles className="w-4 h-4" />;
    if (tags?.includes('quests') || tags?.includes('habits')) return <Zap className="w-4 h-4" />;
    return <Trophy className="w-4 h-4" />;
  };

  const getCategoryName = (tags: string[]) => {
    if (tags?.includes('progress') || tags?.includes('leveling')) return 'Progress & Consistency';
    if (tags?.includes('social') || tags?.includes('collaboration')) return 'Social & Party Play';
    if (tags?.includes('focus') || tags?.includes('planning')) return 'Focus & Planning';
    if (tags?.includes('fun') || tags?.includes('customization')) return 'Fun & Surprise';
    if (tags?.includes('quests') || tags?.includes('habits')) return 'Quest & Learning';
    return 'General';
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

  const earnedCount = achievements.filter(a => a.is_completed).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-emerald-600/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold text-emerald-400">Achievements & Badges</h3>
            <Badge className="bg-emerald-600 text-white text-sm">
              {earnedCount}/{totalCount} Earned
            </Badge>
          </div>
          <button
            onClick={() => setShowStreaks(!showStreaks)}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            <Flame className="w-4 h-4 mr-1 inline" />
            {showStreaks ? 'Hide' : 'Show'} Streaks
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4 mb-6">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Status:
            </span>
            {['all', 'earned', 'locked'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

        </div>

        {/* Achievements Grid */}
        <div className="space-y-4">
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`rounded-lg p-4 border transition-all hover:scale-105 animate-fade-in ${
                    achievement.is_completed 
                      ? 'bg-emerald-900/30 border-emerald-500/50 hover:border-emerald-400/70' 
                      : 'bg-slate-700/30 border-slate-600/30 opacity-75 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {achievement.is_completed ? getRarityEmoji(achievement.quest_value) : '🔒'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(achievement.tags || [])}
                        <h3 className={`font-bold ${achievement.is_completed ? 'text-white' : 'text-slate-300'}`}>
                          {achievement.achievement_name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getRarityColor(achievement.quest_value)} text-white text-xs ${achievement.is_completed ? '' : 'opacity-75'}`}>
                          {achievement.quest_value}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {getCategoryName(achievement.tags || [])}
                        </span>
                        {achievement.is_completed && (
                          <Badge className="bg-emerald-600 text-white text-xs">
                            +{achievement.xp_reward} XP
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${achievement.is_completed ? 'text-slate-300' : 'text-slate-400'}`}>
                        {achievement.description}
                      </p>
                      {!achievement.is_completed && (
                        <>
                          <div className="bg-slate-600 rounded-full h-2 mb-1">
                            <div 
                              className="bg-amber-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (achievement.achievement_progress_current / achievement.achievement_progress_goal) * 100)}%` }}
                            />
                          </div>
                          <span className="text-amber-400 text-xs font-medium">
                            {achievement.achievement_progress_current}/{achievement.achievement_progress_goal}
                          </span>
                        </>
                      )}
                      {achievement.is_completed && achievement.earned_at && (
                        <p className="text-emerald-400 text-xs">
                          Earned {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-50" />
              <p className="text-amber-400 font-medium text-lg mb-2">
                {filter === 'earned' ? 'No badges earned yet' : 
                 filter === 'locked' ? 'No locked badges found' : 
                 'No achievements match your filters'}
              </p>
              <p className="text-amber-300 text-sm">
                {filter === 'earned' ? 'Complete quests and explore features to unlock your first badges!' :
                 'Try adjusting your filters to see more achievements.'}
              </p>
            </div>
          )}
        </div>

        {/* Streaks Section */}
        {showStreaks && (
          <div className="mt-8 pt-6 border-t border-slate-600/30">
            <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5" />
              Active Streaks
            </h4>
            {streaks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {streaks.map((streak) => (
                  <div 
                    key={streak.id} 
                    className={`rounded-lg p-4 border transition-all ${
                      streak.status === 'Active' 
                        ? 'bg-orange-900/30 border-orange-500/50' 
                        : 'bg-slate-700/50 border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${streak.status === 'Active' ? '' : 'opacity-50'}`}>
                        {getStreakIcon(streak.streak_name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{streak.streak_name}</h4>
                          {streak.status === 'Active' && (
                            <Badge className="bg-orange-600 text-white text-xs">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Flame className="w-10 h-10 text-orange-400 mx-auto mb-3 opacity-50" />
                <p className="text-orange-400 font-medium mb-1">No streaks started yet</p>
                <p className="text-orange-300 text-sm">Build consistency to unlock powerful streak bonuses!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsSection;