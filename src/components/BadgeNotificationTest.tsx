import React from 'react';
import { Button } from '@/components/ui/button';
import { useBadgeNotificationsTest } from '@/hooks/useBadgeNotificationsTest';
import { useBadgeNotifications } from '@/hooks/useBadgeNotifications';
import { Bell, Trophy, Target, Award } from 'lucide-react';

const BadgeNotificationTest = () => {
  const { triggerBadgeEligibilityCheck, unlockTestBadge } = useBadgeNotificationsTest();
  const { unreadCount, markAllAsRead } = useBadgeNotifications();

  const handleUnlockFirstSteps = () => {
    unlockTestBadge('First Steps');
  };

  const handleUnlockQuestCollector = () => {
    unlockTestBadge('Quest Collector');
  };

  const handleUnlockLevelUp = () => {
    unlockTestBadge('Level Up!');
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 border border-purple-600/30 shadow-2xl mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-purple-400">Badge Notification Test</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium">Unread Notifications:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-400">{unreadCount}</span>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={handleUnlockFirstSteps}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Unlock "First Steps"
          </Button>
          
          <Button
            onClick={handleUnlockQuestCollector}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Unlock "Quest Collector"
          </Button>
          
          <Button
            onClick={handleUnlockLevelUp}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Unlock "Level Up!"
          </Button>
          
          <Button
            onClick={triggerBadgeEligibilityCheck}
            className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Check Badge Eligibility
          </Button>
        </div>

        <div className="text-xs text-slate-400 mt-3">
          <p>💡 <strong>How to test:</strong></p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Click one of the "Unlock" buttons to simulate earning a badge</li>
            <li>Watch for the red notification dot to appear on the Achievements tab</li>
            <li>Click the Achievements tab to clear the notification</li>
            <li>Use "Check Badge Eligibility" to recalculate based on your actual progress</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotificationTest;