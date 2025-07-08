import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ArchivedQuest {
  id: string;
  user_id: string;
  original_quest_id: string;
  quest_name: string;
  description?: string;
  quest_type: 'Daily' | 'Main' | 'Side' | 'Legendary';
  priority: 'Low' | 'Medium' | 'High';
  xp_reward: number;
  gold_reward: number;
  tags?: string[];
  completed_date: string;
  completed_at: string;
  archived_at: string;
  was_in_focus: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  total_quests: number;
  total_xp: number;
  total_gold: number;
  daily_quests: number;
  main_quests: number;
  side_quests: number;
  legendary_quests: number;
  focus_quests: number;
  quests_by_day: Record<string, number>;
}

export const useArchivedQuests = () => {
  const [archivedQuests, setArchivedQuests] = useState<ArchivedQuest[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch archived quests for a specific date range
  const fetchArchivedQuests = async (startDate?: string, endDate?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('archived_quests')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });

      if (startDate) {
        query = query.gte('completed_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('completed_date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArchivedQuests(data || []);
    } catch (error) {
      console.error('Error fetching archived quests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch archived quests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get weekly summary for a specific week
  const getWeeklySummary = async (weekStart: string): Promise<WeeklySummary | null> => {
    if (!user) return null;

    try {
      const weekStartDate = new Date(weekStart);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      
      const weekStartStr = weekStartDate.toISOString().split('T')[0];
      const weekEndStr = weekEndDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('archived_quests')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', weekStartStr)
        .lte('completed_date', weekEndStr);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          week_start: weekStartStr,
          week_end: weekEndStr,
          total_quests: 0,
          total_xp: 0,
          total_gold: 0,
          daily_quests: 0,
          main_quests: 0,
          side_quests: 0,
          legendary_quests: 0,
          focus_quests: 0,
          quests_by_day: {}
        };
      }

      // Calculate summary statistics
      const summary: WeeklySummary = {
        week_start: weekStartStr,
        week_end: weekEndStr,
        total_quests: data.length,
        total_xp: data.reduce((sum, quest) => sum + quest.xp_reward, 0),
        total_gold: data.reduce((sum, quest) => sum + quest.gold_reward, 0),
        daily_quests: data.filter(q => q.quest_type === 'Daily').length,
        main_quests: data.filter(q => q.quest_type === 'Main').length,
        side_quests: data.filter(q => q.quest_type === 'Side').length,
        legendary_quests: data.filter(q => q.quest_type === 'Legendary').length,
        focus_quests: data.filter(q => q.was_in_focus).length,
        quests_by_day: {}
      };

      // Group by day
      data.forEach(quest => {
        const day = quest.completed_date;
        summary.quests_by_day[day] = (summary.quests_by_day[day] || 0) + 1;
      });

      return summary;
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate weekly summary. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Get all weeks that have archived quests
  const getAvailableWeeks = async (): Promise<string[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('archived_quests')
        .select('completed_date')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) return [];

      // Group dates into weeks (Monday as start of week)
      const weeks = new Set<string>();
      data.forEach(quest => {
        const date = new Date(quest.completed_date);
        const dayOfWeek = date.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
        const mondayDate = new Date(date);
        mondayDate.setDate(date.getDate() + mondayOffset);
        weeks.add(mondayDate.toISOString().split('T')[0]);
      });

      return Array.from(weeks).sort((a, b) => b.localeCompare(a)); // Most recent first
    } catch (error) {
      console.error('Error getting available weeks:', error);
      return [];
    }
  };

  // Export quests to JSON (future feature)
  const exportQuests = (quests: ArchivedQuest[] = archivedQuests) => {
    const dataStr = JSON.stringify(quests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifequest-archive-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Your quest archive has been downloaded.',
    });
  };

  return {
    archivedQuests,
    loading,
    fetchArchivedQuests,
    getWeeklySummary,
    getAvailableWeeks,
    exportQuests,
  };
};