import React, { useEffect } from 'react';
import AchievementsSection from '@/components/AchievementsSection';
import { useBadgeNotifications } from '@/hooks/useBadgeNotifications';

const Achievements = () => {
  const { markAllAsRead } = useBadgeNotifications();
  
  // Mark all badge notifications as read when user visits achievements page
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      {/* Fantasy background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('hsl(var(--app-pattern))')}'.replace('#', '')} fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            🏅 Achievements
          </h1>
          <p className="text-xl text-muted-foreground">
            Badges and Streaks
          </p>
        </div>

        {/* Achievements and Streaks with Integrated Badges */}
        <div className="mb-12">
          <AchievementsSection />
        </div>
      </div>
    </div>
  );
};

export default Achievements;