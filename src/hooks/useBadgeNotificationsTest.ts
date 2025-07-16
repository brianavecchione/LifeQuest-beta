import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useBadgeNotificationsTest = () => {
  const { user } = useAuth();

  // Function to manually trigger badge eligibility recalculation
  const triggerBadgeEligibilityCheck = async () => {
    if (!user) return;

    try {
      // This will trigger the badge progress calculation which may unlock new badges
      const { error } = await supabase
        .rpc('recalculate_badge_progress', {
          p_user_id: user.id
        });

      if (error) {
        console.error('Error triggering badge eligibility check:', error);
        return;
      }

      console.log('Badge eligibility check triggered successfully');
    } catch (error) {
      console.error('Error triggering badge eligibility check:', error);
    }
  };

  // Function to manually unlock a badge for testing
  const unlockTestBadge = async (badgeName: string) => {
    if (!user) return;

    try {
      // First, find the badge
      const { data: badge, error: fetchError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_name', badgeName)
        .single();

      if (fetchError || !badge) {
        console.error('Error finding badge:', fetchError);
        return;
      }

      // Mark it as unlockable (this will trigger the notification)
      const { error: updateError } = await supabase
        .from('achievements')
        .update({ 
          is_unlockable: true,
          achievement_progress_current: badge.achievement_progress_goal
        })
        .eq('id', badge.id);

      if (updateError) {
        console.error('Error unlocking test badge:', updateError);
        return;
      }

      console.log(`Test badge "${badgeName}" unlocked successfully`);
    } catch (error) {
      console.error('Error unlocking test badge:', error);
    }
  };

  return {
    triggerBadgeEligibilityCheck,
    unlockTestBadge
  };
};