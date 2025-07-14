import { useGuest } from '@/contexts/GuestContext';

// Mock party data for guest mode
const createGuestPartyData = () => ({
  party: {
    party_id: 'guest-party-1',
    party_name: 'The Productivity Warriors',
    party_description: 'A group of motivated individuals working towards better habits and goals',
    party_leader_id: 'guest',
    party_members: ['guest', 'alice-123', 'bob-456', 'charlie-789'],
    party_goal_xp: 2000,
    total_xp: 1450,
    total_quests_completed: 28,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  
  members: [
    {
      id: 'guest-member-1',
      user_id: 'guest',
      party_id: 'guest-party-1',
      username: 'Guest Adventurer',
      level: 5,
      xp: 485,
      role: 'Leader' as const,
      is_active: true,
      joined_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'guest-member-2',
      user_id: 'alice-123',
      party_id: 'guest-party-1',
      username: 'Alice the Achiever',
      level: 4,
      xp: 380,
      role: 'Member' as const,
      is_active: true,
      joined_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'guest-member-3',
      user_id: 'bob-456',
      party_id: 'guest-party-1',
      username: 'Bob the Builder',
      level: 3,
      xp: 315,
      role: 'Member' as const,
      is_active: true,
      joined_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'guest-member-4',
      user_id: 'charlie-789',
      party_id: 'guest-party-1',
      username: 'Charlie Challenger',
      level: 6,
      xp: 270,
      role: 'Co-Leader' as const,
      is_active: false,
      joined_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  
  quests: [
    {
      party_quest_id: 'guest-pquest-1',
      party_id: 'guest-party-1',
      quest_name: 'Collective Meditation Week',
      quest_description: 'Everyone in the party meditates for at least 10 minutes daily for 7 days',
      assigned_by_user_id: 'guest',
      assigned_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'In Progress' as const,
      progress_numerator: 18,
      progress_denominator: 28, // 4 members × 7 days
      xp_reward: 100,
      completed_by: ['guest', 'alice-123'],
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      party_quest_id: 'guest-pquest-2',
      party_id: 'guest-party-1',
      quest_name: 'Team Fitness Challenge',
      quest_description: 'Complete 50 collective workout sessions as a team',
      assigned_by_user_id: 'charlie-789',
      assigned_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed' as const,
      progress_numerator: 50,
      progress_denominator: 50,
      xp_reward: 150,
      completed_by: ['guest', 'alice-123', 'bob-456', 'charlie-789'],
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  
  chatMessages: [
    {
      message_id: 'guest-msg-1',
      party_id: 'guest-party-1',
      user_id: 'alice-123',
      message: "Hey everyone! Great work on the fitness challenge! 💪",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      message_id: 'guest-msg-2',
      party_id: 'guest-party-1',
      user_id: 'guest',
      message: "Thanks Alice! Ready for the meditation week? 🧘‍♀️",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 minutes ago
    },
    {
      message_id: 'guest-msg-3',
      party_id: 'guest-party-1',
      user_id: 'bob-456',
      message: "Absolutely! Let's maintain our momentum 🔥",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    },
    {
      message_id: 'guest-msg-4',
      party_id: 'guest-party-1',
      user_id: 'charlie-789',
      message: "Sorry I've been inactive lately, but cheering you all on! 👏",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    },
  ],
  
  leaderboard: [
    {
      id: 'guest-leader-1',
      party_id: 'guest-party-1',
      user_id: 'guest',
      xp_earned: 485,
      quests_completed: 8,
      time_range: 'Week' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'guest-leader-2',
      party_id: 'guest-party-1',
      user_id: 'alice-123',
      xp_earned: 380,
      quests_completed: 7,
      time_range: 'Week' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'guest-leader-3',
      party_id: 'guest-party-1',
      user_id: 'bob-456',
      xp_earned: 315,
      quests_completed: 6,
      time_range: 'Week' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'guest-leader-4',
      party_id: 'guest-party-1',
      user_id: 'charlie-789',
      xp_earned: 270,
      quests_completed: 7,
      time_range: 'Week' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export const usePartyData = () => {
  const { isGuestMode } = useGuest();

  if (isGuestMode) {
    const guestData = createGuestPartyData();
    return {
      // Party management
      userParty: guestData.party,
      isInParty: true,
      loading: false,
      createParty: () => Promise.resolve(),
      joinParty: () => Promise.resolve(),
      leaveParty: () => Promise.resolve(),
      
      // Party members
      partyMembers: guestData.members,
      membersLoading: false,
      
      // Party quests
      partyQuests: guestData.quests,
      questsLoading: false,
      createPartyQuest: () => Promise.resolve(),
      updateQuestProgress: () => Promise.resolve(),
      
      // Party chat
      chatMessages: guestData.chatMessages,
      chatLoading: false,
      sendMessage: () => Promise.resolve(),
      
      // Party leaderboard
      leaderboard: guestData.leaderboard,
      leaderboardLoading: false,
      
      // Utility functions
      refetchAll: () => Promise.resolve(),
    };
  }

  // For real users, return empty/loading states since we don't have the real hooks implemented
  return {
    userParty: null,
    isInParty: false,
    loading: false, // Set to false to avoid loading states in guest preview
    createParty: () => Promise.resolve(),
    joinParty: () => Promise.resolve(),
    leaveParty: () => Promise.resolve(),
    partyMembers: [],
    membersLoading: false,
    partyQuests: [],
    questsLoading: false,
    createPartyQuest: () => Promise.resolve(),
    updateQuestProgress: () => Promise.resolve(),
    chatMessages: [],
    chatLoading: false,
    sendMessage: () => Promise.resolve(),
    leaderboard: [],
    leaderboardLoading: false,
    refetchAll: () => Promise.resolve(),
  };
};