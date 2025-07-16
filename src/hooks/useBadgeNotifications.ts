import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useBadgeNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch unread notification count
  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('badge_notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching unread badge notifications:', error);
        return;
      }
      
      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching unread badge notifications:', error);
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .rpc('mark_badge_notifications_read', {
          p_user_id: user.id
        });
      
      if (error) {
        console.error('Error marking badge notifications as read:', error);
        return;
      }
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking badge notifications as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time listener for badge notifications
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchUnreadCount();

    // Set up real-time subscription
    const channel = supabase
      .channel('badge_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'badge_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New badge notification:', payload);
          // Only increment if the new notification is unread
          if (payload.new?.is_read === false) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'badge_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Badge notification updated:', payload);
          // Refresh count when notifications are marked as read
          fetchUnreadCount();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    unreadCount,
    isLoading,
    markAllAsRead,
    refreshCount: fetchUnreadCount
  };
};