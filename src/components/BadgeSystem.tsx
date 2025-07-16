
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy, Target, Users, Zap, Sparkles, TrendingUp } from 'lucide-react';

const BadgeSystem = () => {
  const { achievements, loading } = useAchievements();
  
  if (loading) {
    return <div className="text-center text-muted-foreground">Loading achievements...</div>;
  }

  const earnedBadges = achievements.filter(achievement => achievement.is_completed);
  const unearnedBadges = achievements.filter(achievement => !achievement.is_completed);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Bronze': return 'bg-orange-600';
      case 'Silver': return 'bg-gray-500';
      case 'Gold': return 'bg-yellow-600';
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

  const organizeByCategory = (badges: typeof achievements) => {
    const categories = {
      'Progress & Consistency': badges.filter(b => b.tags?.some(tag => ['progress', 'leveling', 'consistency'].includes(tag))),
      'Quest & Learning': badges.filter(b => b.tags?.some(tag => ['quests', 'habits', 'completion'].includes(tag))),
      'Social & Party Play': badges.filter(b => b.tags?.some(tag => ['social', 'collaboration', 'leadership'].includes(tag))),
      'Focus & Planning': badges.filter(b => b.tags?.some(tag => ['focus', 'planning', 'organization'].includes(tag))),
      'Fun & Surprise': badges.filter(b => b.tags?.some(tag => ['fun', 'customization', 'beta', 'special'].includes(tag))),
    };
    return categories;
  };

  const earnedCategories = organizeByCategory(earnedBadges);
  const unearnedCategories = organizeByCategory(unearnedBadges);

  const renderBadgeCard = (achievement: any, isEarned: boolean) => (
    <div 
      key={achievement.id} 
      className={`${isEarned ? 'bg-slate-700/50 border-slate-600/50 hover:border-green-500/50' : 'bg-slate-700/30 border-slate-600/30 opacity-75'} rounded-lg p-4 border transition-all`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">
          {isEarned ? getRarityEmoji(achievement.quest_value) : '🔒'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getCategoryIcon(achievement.tags || [])}
            <h3 className={`font-bold ${isEarned ? 'text-white' : 'text-slate-300'}`}>
              {achievement.achievement_name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getRarityColor(achievement.quest_value)} text-white text-xs ${isEarned ? '' : 'opacity-75'}`}>
              {achievement.quest_value}
            </Badge>
            <span className="text-xs text-slate-400">
              {getCategoryName(achievement.tags || [])}
            </span>
          </div>
          <p className={`text-sm mb-2 ${isEarned ? 'text-slate-300' : 'text-slate-400'}`}>
            {achievement.description}
          </p>
          
          {/* Reward Display - Always show XP and Gold for all states */}
          <div className={`flex items-center gap-2 mb-2 text-xs font-medium ${
            isEarned ? 'text-emerald-300' : 'text-slate-400'
          }`}>
            <span className="flex items-center gap-1">
              ⚡ +{achievement.xp_reward} XP
            </span>
            <span className="text-slate-500">·</span>
            <span className="flex items-center gap-1">
              🪙 +{achievement.gold_reward} Gold
            </span>
          </div>
          
          {!isEarned && (
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
          {isEarned && achievement.earned_at && (
            <p className="text-green-400 text-xs">
              Earned {new Date(achievement.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Earned Badges by Category */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-green-600/30 shadow-2xl">
        <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
          🏆 Earned Badges ({earnedBadges.length})
        </h2>
        
        {earnedBadges.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(earnedCategories).map(([categoryName, categoryBadges]) => (
              categoryBadges.length > 0 && (
                <div key={categoryName} className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2">
                    {getCategoryIcon(categoryBadges[0]?.tags || [])}
                    {categoryName} ({categoryBadges.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {categoryBadges.map((achievement) => renderBadgeCard(achievement, true))}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4 opacity-50" />
            <p className="text-green-400 font-medium text-lg mb-2">No badges earned yet</p>
            <p className="text-green-300 text-sm">Complete quests and explore features to unlock your first badges!</p>
          </div>
        )}
      </div>

      {/* Unearned Badges by Category */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-amber-600/30 shadow-2xl">
        <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
          🔒 Available Badges ({unearnedBadges.length})
        </h2>
        
        {unearnedBadges.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(unearnedCategories).map(([categoryName, categoryBadges]) => (
              categoryBadges.length > 0 && (
                <div key={categoryName} className="space-y-3">
                  <h3 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
                    {getCategoryIcon(categoryBadges[0]?.tags || [])}
                    {categoryName} ({categoryBadges.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {categoryBadges.map((achievement) => renderBadgeCard(achievement, false))}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-50" />
            <p className="text-amber-400 font-medium text-lg mb-2">All badges earned!</p>
            <p className="text-amber-300 text-sm">You've completed every challenge - amazing work!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeSystem;
