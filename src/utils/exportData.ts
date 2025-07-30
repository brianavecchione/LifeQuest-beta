import { supabase } from '@/integrations/supabase/client';
import { Quest } from '@/hooks/useQuests';

interface ExportQuestData {
  quest_name: string;
  description?: string;
  quest_type: string;
  priority: string;
  difficulty: string;
  xp_reward: number;
  gold_reward: number;
  status: string;
  tags?: string;
  due_date?: string;
  created_at: string;
  completed_at?: string;
  date_completed?: string;
  is_recurring: boolean;
  source: 'Active' | 'Archived';
}

export const exportQuestData = async (userId: string): Promise<void> => {
  try {
    // Fetch active/current quests
    const { data: activeQuests, error: activeError } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId);

    if (activeError) throw activeError;

    // Fetch archived quests
    const { data: archivedQuests, error: archivedError } = await supabase
      .from('archived_quests')
      .select('*')
      .eq('user_id', userId);

    if (archivedError) throw archivedError;

    // Combine and format data
    const allQuestData: ExportQuestData[] = [];

    // Process active quests
    if (activeQuests) {
      activeQuests.forEach(quest => {
        allQuestData.push({
          quest_name: quest.quest_name,
          description: quest.description || '',
          quest_type: quest.quest_type,
          priority: quest.priority,
          difficulty: quest.difficulty,
          xp_reward: quest.xp_reward,
          gold_reward: quest.gold_reward,
          status: quest.status,
          tags: quest.tags ? quest.tags.join('; ') : '',
          due_date: quest.due_date || '',
          created_at: new Date(quest.created_at).toLocaleDateString(),
          completed_at: quest.completed_at ? new Date(quest.completed_at).toLocaleDateString() : '',
          date_completed: quest.completed_at ? new Date(quest.completed_at).toLocaleDateString() : '',
          is_recurring: quest.is_recurring || false,
          source: 'Active'
        });
      });
    }

    // Process archived quests
    if (archivedQuests) {
      archivedQuests.forEach(quest => {
        allQuestData.push({
          quest_name: quest.quest_name,
          description: quest.description || '',
          quest_type: quest.quest_type,
          priority: quest.priority,
          difficulty: 'Moderate', // Archived quests might not have difficulty
          xp_reward: quest.xp_reward,
          gold_reward: quest.gold_reward,
          status: 'Completed',
          tags: quest.tags ? quest.tags.join('; ') : '',
          due_date: '',
          created_at: new Date(quest.completed_date).toLocaleDateString(),
          completed_at: new Date(quest.completed_at).toLocaleDateString(),
          date_completed: new Date(quest.completed_date).toLocaleDateString(),
          is_recurring: false,
          source: 'Archived'
        });
      });
    }

    // Sort by completion date (most recent first)
    allQuestData.sort((a, b) => {
      const dateA = new Date(a.completed_at || a.created_at);
      const dateB = new Date(b.completed_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    // Convert to CSV
    const csvContent = generateCSV(allQuestData);
    
    // Download CSV file
    downloadCSV(csvContent, `lifequest-data-export-${new Date().toISOString().split('T')[0]}.csv`);
    
  } catch (error) {
    console.error('Error exporting quest data:', error);
    throw error;
  }
};

const generateCSV = (data: ExportQuestData[]): string => {
  const headers = [
    'Quest Name',
    'Description',
    'Quest Type',
    'Priority',
    'Difficulty',
    'XP Reward',
    'Gold Reward',
    'Status',
    'Tags',
    'Due Date',
    'Date Created',
    'Date Completed',
    'Is Recurring',
    'Source'
  ];

  const csvRows = [headers.join(',')];

  data.forEach(quest => {
    const row = [
      `"${quest.quest_name.replace(/"/g, '""')}"`,
      `"${(quest.description || '').replace(/"/g, '""')}"`,
      quest.quest_type,
      quest.priority,
      quest.difficulty,
      quest.xp_reward.toString(),
      quest.gold_reward.toString(),
      quest.status,
      `"${(quest.tags || '').toString().replace(/"/g, '""')}"`,
      quest.due_date || '',
      quest.created_at,
      quest.completed_at || '',
      quest.is_recurring.toString(),
      quest.source
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const getExportStats = async (userId: string): Promise<{
  totalQuests: number;
  completedQuests: number;
  activeQuests: number;
  archivedQuests: number;
}> => {
  try {
    // Get active quests count
    const { count: activeCount } = await supabase
      .from('quests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get completed active quests count
    const { count: completedActiveCount } = await supabase
      .from('quests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'Completed');

    // Get archived quests count
    const { count: archivedCount } = await supabase
      .from('archived_quests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      totalQuests: (activeCount || 0) + (archivedCount || 0),
      completedQuests: (completedActiveCount || 0) + (archivedCount || 0),
      activeQuests: activeCount || 0,
      archivedQuests: archivedCount || 0,
    };
  } catch (error) {
    console.error('Error getting export stats:', error);
    return {
      totalQuests: 0,
      completedQuests: 0,
      activeQuests: 0,
      archivedQuests: 0,
    };
  }
};