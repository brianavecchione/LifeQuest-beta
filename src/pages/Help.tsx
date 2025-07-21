import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AISidekick from '@/components/AISidekick';

const Help = () => {
  const { openWalkthrough } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Solid Background Overlay */}
      <div className="fixed inset-0 bg-slate-900" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-36 pb-12 min-h-screen text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Help & FAQ
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Everything you need to know about using LifeQuest to level up your productivity and build better habits.
          </p>
          
          {/* Getting Started Walkthrough Button */}
          <div className="mt-6">
            <Button
              onClick={openWalkthrough}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Getting Started Walkthrough
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          {/* Getting Started */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Getting Started</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="first-quest" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I create my first quest?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Click the "+" button on your dashboard or navigate to the Quests page. Fill in your quest name, choose a type (Daily, Main, Side, or Legendary), set priority, and add any description or tags you'd like. Then click "Create Quest" to add it to your adventure!
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="quest-types" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What's the difference between quest types?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  <strong>Daily:</strong> Recurring tasks that reset each day (habits, routines)<br/>
                  <strong>Main:</strong> Important, high-priority goals and projects<br/>
                  <strong>Side:</strong> Smaller tasks and optional objectives<br/>
                  <strong>Legendary:</strong> Major life goals and significant achievements
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="level-up" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I level up and earn XP?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Complete quests to earn XP! Different quest types and priorities give different amounts of XP. Daily quests give 10-25 XP, Side quests 15-35 XP, Main quests 25-60 XP, and Legendary quests 50-150 XP. As you accumulate XP, you'll automatically level up.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Game Mechanics */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Game Mechanics</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="xp-system" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How does the XP and leveling system work?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  XP requirements increase as you level up using the formula: Level × 100. So Level 2 needs 200 total XP, Level 3 needs 300 total XP, etc. Your progress bar shows how close you are to your next level.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="gold-shop" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What can I buy with gold?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Visit the Gold Shop to purchase rewards, themes, and customization options. You can buy personal rewards (treats, breaks, activities) or LifeQuest themes and features. Gold is earned by completing quests alongside XP.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="achievements" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do achievements and badges work?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Achievements unlock automatically as you hit milestones (completing quests, maintaining streaks, reaching levels). Check your Achievements page to see progress and claim rewards. Some achievements are hidden until discovered!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Task & Habit Management */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Task & Habit Management</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="daily-reset" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do daily quests reset?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Daily quests automatically reset at midnight in your local timezone. Incomplete daily quests are archived, and fresh copies are created for the new day. Your streaks are maintained if you complete them regularly.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="edit-delete" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Can I edit or delete quests?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Yes! Click on any quest to open the details modal, then use the edit or delete buttons. You can modify the name, description, priority, type, and tags. Completed quests are archived and can't be edited.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="pomodoro" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What's the Pomodoro timer feature?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Enable the Pomodoro timer on any quest to use focused work sessions. The timer follows the traditional 25-minute work / 5-minute break cycle, helping you maintain focus and track time spent on tasks.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Parties & Social */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Parties & Social</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="party-join" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I create or join a party?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Go to the Parties page to create a new party or join an existing one with a party code. Parties allow you to share goals, compete on leaderboards, and support each other's progress.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="party-quests" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What are party quests?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Party quests are shared objectives that all party members can contribute to. They promote collaboration and group accountability. Party leaders can create quests for the entire group.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="leaderboard" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How does the party leaderboard work?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  The leaderboard tracks XP earned and quests completed by party members over weekly and monthly periods. It's designed to encourage friendly competition and celebrate everyone's progress.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Account & Settings */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Account & Settings</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="customization" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I customize my avatar and theme?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Visit the Customization page to change your character name, avatar style, and background theme. Some themes may require gold to unlock, adding to the progression system.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="data-export" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Can I export my data?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Currently, data export isn't available, but we're working on this feature. Your progress is safely stored and backed up in our secure database.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="delete-account" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I delete my account?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Go to Settings and scroll to the bottom to find the "Delete Account" option. This action is permanent and will remove all your data, so please consider carefully before proceeding.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Troubleshooting & Bugs */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Troubleshooting & Bugs</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="save-issues" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  My quests aren't saving or loading properly
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Try refreshing the page first. If problems persist, check your internet connection and try logging out and back in. Contact support if issues continue.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="performance" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  The app is running slowly or freezing
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Close other browser tabs, clear your browser cache, or try using a different browser. Some browser extensions can also interfere with the app's performance.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="bug-report" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  I found a bug - how do I report it?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  We appreciate bug reports! Please email us at contact@getlifequest.com with details about what happened, what you expected, and steps to reproduce the issue.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Tips & Best Practices */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Tips & Best Practices</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="organize-quests" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How should I organize my quests?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Use Daily quests for habits, Main quests for important projects, Side quests for smaller tasks, and Legendary quests for major life goals. Use tags to categorize by area (work, health, learning, etc.).
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="build-habits" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What's the best way to build habits?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Start small with Daily quests for habits you want to build. Be consistent rather than perfect - the streak system rewards regular completion. Focus on 2-3 key habits at a time rather than overwhelming yourself.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="stay-motivated" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How can I stay motivated long-term?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Set meaningful rewards in the Gold Shop, celebrate achievements, and consider joining a party for social accountability. Remember that progress isn't always linear - focus on overall trends rather than daily perfection.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* References */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">References</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="scientific" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Scientific foundations
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  LifeQuest is built on research from behavioral psychology, particularly the work on operant conditioning, habit formation, and gamification principles that leverage our brain's reward systems.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="adhd-design" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  ADHD-friendly design
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Our interface incorporates design principles specifically helpful for ADHD and executive function challenges: clear visual hierarchy, minimal cognitive load, immediate feedback, and customizable organization systems.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="privacy" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Privacy and data security
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Your data is encrypted and stored securely. We never share personal information with third parties. See our Privacy Policy for complete details on data handling and your rights.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* AI Sidekick */}
        <div className="mt-12">
          <AISidekick />
        </div>
      </div>
    </div>
  );
};

export default Help;