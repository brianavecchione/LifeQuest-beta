// Test utility for daily quest reset functionality
// This helps verify that all edge cases are handled correctly

export interface QuestResetTestCase {
  quest_name: string;
  status: 'Not started' | 'In Progress' | 'Completed';
  due_date: string | null;
  completed_at: string | null;
  shouldReset: boolean;
  reason: string;
}

export const createResetTestCases = (today: string, yesterday: string): QuestResetTestCase[] => [
  {
    quest_name: "Normal completed quest from yesterday",
    status: "Completed",
    due_date: yesterday,
    completed_at: yesterday,
    shouldReset: true,
    reason: "Completed quest with due_date before today"
  },
  {
    quest_name: "Legacy completed quest with NULL due_date",
    status: "Completed", 
    due_date: null,
    completed_at: yesterday,
    shouldReset: true,
    reason: "Completed quest with NULL due_date (legacy)"
  },
  {
    quest_name: "In progress quest from yesterday",
    status: "In Progress",
    due_date: yesterday,
    completed_at: null,
    shouldReset: true,
    reason: "Incomplete quest from previous day"
  },
  {
    quest_name: "Today's completed quest",
    status: "Completed",
    due_date: today,
    completed_at: today,
    shouldReset: false,
    reason: "Already completed today - should not reset"
  },
  {
    quest_name: "Today's not started quest",
    status: "Not started",
    due_date: today,
    completed_at: null,
    shouldReset: false,
    reason: "Already in correct state for today"
  },
  {
    quest_name: "Today's in progress quest",
    status: "In Progress",
    due_date: today,
    completed_at: null,
    shouldReset: false,
    reason: "Currently being worked on today"
  }
];

export const shouldQuestReset = (
  quest: Pick<QuestResetTestCase, 'status' | 'due_date'>,
  today: string
): boolean => {
  // New comprehensive reset logic:
  // 1. Completed quests with due_date before today
  // 2. Completed quests with NULL due_date (legacy)
  // 3. In Progress quests with due_date before today
  
  if (quest.status === 'Completed') {
    // Reset if due_date is null (legacy) or before today
    return quest.due_date === null || quest.due_date < today;
  }
  
  if (quest.status === 'In Progress') {
    // Reset if due_date is before today (incomplete from previous day)
    return quest.due_date !== null && quest.due_date < today;
  }
  
  // 'Not started' quests don't need reset
  return false;
};

export const testResetLogic = (today: string = '2025-07-08'): void => {
  const yesterday = '2025-07-07';
  const testCases = createResetTestCases(today, yesterday);
  
  console.log('🧪 Testing Daily Quest Reset Logic');
  console.log(`Today: ${today}, Yesterday: ${yesterday}`);
  console.log('');
  
  testCases.forEach((testCase, index) => {
    const shouldReset = shouldQuestReset(testCase, today);
    const passed = shouldReset === testCase.shouldReset;
    
    console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} ${testCase.quest_name}`);
    console.log(`  Status: ${testCase.status}, Due: ${testCase.due_date || 'NULL'}`);
    console.log(`  Expected: ${testCase.shouldReset ? 'RESET' : 'NO RESET'} (${testCase.reason})`);
    console.log(`  Actual: ${shouldReset ? 'RESET' : 'NO RESET'}`);
    
    if (!passed) {
      console.log('  ❌ TEST FAILED!');
    }
    console.log('');
  });
};

// Test the specific "Take medication" case
export const testMedicationCase = (): void => {
  const medicationQuest = {
    quest_name: "Take medication",
    status: "Completed" as const,
    due_date: null,
    completed_at: "2025-07-07 16:19:58.442063+00"
  };
  
  const today = '2025-07-08';
  const shouldReset = shouldQuestReset(medicationQuest, today);
  
  console.log('🔍 Testing "Take medication" Quest');
  console.log(`Quest: ${medicationQuest.quest_name}`);
  console.log(`Status: ${medicationQuest.status}`);
  console.log(`Due Date: ${medicationQuest.due_date || 'NULL'}`);
  console.log(`Should Reset: ${shouldReset ? '✅ YES' : '❌ NO'}`);
  console.log(`Reason: ${shouldReset ? 'Completed quest with NULL due_date' : 'Logic error!'}`);
};