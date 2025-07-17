import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AISidekick from "@/components/AISidekick";

const Help = () => {
  return (
    <div className="text-white">
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-36 pb-12">{/* Added more padding at the top */}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            LifeQuest Help & FAQ
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Everything you need to know about transforming your goals into epic quests and building better habits.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Getting Started */}
            <AccordionItem value="getting-started" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Getting Started
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What is LifeQuest and how does it work?</h3>
                  <p className="text-slate-300 mb-4">
                    LifeQuest is a science-backed gamified productivity platform that transforms your real-life goals into quests. As you complete tasks, you earn XP, gold, and badges—leveling up your character and building better routines along the way.
                  </p>
                  <p className="text-slate-300 mb-4">LifeQuest is grounded in behavioral science:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Gamification activates your brain's reward system, using XP, streaks, and badges to encourage habit formation through small, achievable wins [1].</li>
                    <li>Daily Focus tasks are limited to 3–5, aligning with working memory limits and reducing executive overload [2].</li>
                    <li>Visual categories, filters, and clear feedback loops support attention and follow-through, especially for neurodivergent users [3].</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How do I set up my first quest or habit?</h3>
                  <p className="text-slate-300">
                    Go to the Quests page and click "Add Quest." To make it recurring, select the "Daily" option. You can also designate it as a Focus Task for extra rewards.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What's the difference between Quests, Daily Habits, and Focus Tasks?</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li><strong>Quests:</strong> One-time or recurring goals/tasks.</li>
                    <li><strong>Daily Habits:</strong> Recurring actions like "take vitamins." Always reward 5 XP and 0 gold.</li>
                    <li><strong>Focus Tasks:</strong> Your 3–5 most important goals for the day. Completing these earns bonus XP and gold and promotes intentionality and follow-through.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Why only 3–5 Focus Tasks?</h3>
                  <p className="text-slate-300">
                    This limit is based on cognitive science: most people can only hold about 4 items in working memory at once [2]. Keeping it simple improves consistency and reduces overwhelm.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Game Mechanics */}
            <AccordionItem value="game-mechanics" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Game Mechanics
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How do I earn XP and gold?</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>XP comes from completing any quest or habit.</li>
                    <li>Gold is earned through quests (but not habits) and can be used to customize your experience.</li>
                  </ul>
                  <p className="text-slate-300 mt-2">
                    Rewards provide immediate feedback, which reinforces habit formation through dopamine signaling [1].
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What happens when I level up?</h3>
                  <p className="text-slate-300">
                    Leveling up unlocks new cosmetic rewards, titles, and (soon) access to exclusive quests and community features.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What are badges and how do I unlock them?</h3>
                  <p className="text-slate-300">
                    Badges are awarded when you hit milestones like completing 50 quests or keeping a 7-day streak. These milestones help reinforce progress through goal-setting theory [4].
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What's the Daily Focus and how is it different from other tasks?</h3>
                  <p className="text-slate-300">
                    Your Daily Focus is a curated list of 3–5 key tasks you commit to finishing today. Completing them earns bonus rewards and promotes intentional behavior, avoiding decision fatigue and boosting motivation [5].
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How does the streak system work?</h3>
                  <p className="text-slate-300">
                    Complete at least one Daily Habit or Quest per day to keep your streak alive. Missing a day resets it. Some streaks track across habits or challenges.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Task & Habit Management */}
            <AccordionItem value="task-management" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Task & Habit Management
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How do I make a task recurring?</h3>
                  <p className="text-slate-300">
                    Select "Daily" when creating a quest. It will reappear automatically each day.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What happens to unfinished tasks?</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Quests remain in your backlog.</li>
                    <li>Daily Habits reset at midnight.</li>
                    <li>Focus Tasks reset daily—you'll need to reselect them tomorrow.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Can I delete or archive quests?</h3>
                  <p className="text-slate-300">
                    Yes. Click the three dots on any quest card and select "Delete." (Archiving is coming soon.)
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Can I prioritize or reorder tasks?</h3>
                  <p className="text-slate-300">
                    You can assign XP and gold to reflect priority, but drag-and-drop reordering is not yet available.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Parties & Social */}
            <AccordionItem value="parties-social" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Parties & Social
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What are parties and how do I join one?</h3>
                  <p className="text-slate-300 mb-3">
                    Parties (coming soon) are small groups for shared accountability. You'll be able to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Create or join parties</li>
                    <li>Take on group quests</li>
                    <li>Track shared progress and milestones</li>
                  </ul>
                  <p className="text-slate-300 mt-3">
                    Cooperative systems boost motivation, especially for neurodivergent users, by creating social accountability and shared celebration [6].
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What's shared and what stays private?</h3>
                  <p className="text-slate-300">
                    Only shared quest progress, XP, and streaks are visible to your party. Personal task lists and notes stay private.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Account & Settings */}
            <AccordionItem value="account-settings" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Account & Settings
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How do I reset my password?</h3>
                  <p className="text-slate-300">
                    Click "Forgot password?" on the login page.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Can I export my data?</h3>
                  <p className="text-slate-300">
                    Not yet—but we're working on data export (CSV/JSON) support.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How do I delete my account?</h3>
                  <p className="text-slate-300">
                    Go to Profile → Settings → Delete Account. This action is irreversible.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Troubleshooting & Bugs */}
            <AccordionItem value="troubleshooting" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Troubleshooting & Bugs
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Why isn't my XP updating?</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Habits always give fixed XP (5 XP)</li>
                    <li>Some sync delays may occur—try refreshing</li>
                    <li>Still not working? Contact support.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Why did my completed task reappear?</h3>
                  <p className="text-slate-300">
                    It may not have synced before the daily reset. If this happens repeatedly, let us know.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How do I report a bug?</h3>
                  <p className="text-slate-300">
                    Use the "Contact Support" form or click "Email Us" in the footer.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Do you have a roadmap?</h3>
                  <p className="text-slate-300 mb-3">Yes! Upcoming features include:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Shops and badges</li>
                    <li>Social parties</li>
                    <li>Advanced customization</li>
                  </ul>
                  <p className="text-slate-300 mt-3">Subscribe to our newsletter for updates.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Tips & Best Practices */}
            <AccordionItem value="tips-practices" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                Tips & Best Practices
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">What's the best way to build a habit with LifeQuest?</h3>
                  <p className="text-slate-300 mb-3">Start small. Use the Quick Daily Setup to:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Choose 3-5 habits to begin</li>
                    <li>Anchor habits to existing cues (e.g., "after brushing teeth")</li>
                    <li>Build momentum through streaks and rewards</li>
                  </ul>
                  <p className="text-slate-300 mt-3">
                    This mirrors proven strategies from habit stacking and cue-based repetition [7].
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">How can I stay motivated if I miss a few days?</h3>
                  <p className="text-slate-300">
                    You don't lose XP—LifeQuest is about consistency, not perfection. Pick up where you left off.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-3">Can I use LifeQuest to support my mental health?</h3>
                  <p className="text-slate-300 mb-3">Yes. LifeQuest was designed with mental health in mind:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                    <li>Daily Focus supports executive function by limiting overwhelm</li>
                    <li>Visual categorization and filters help with clarity and goal salience</li>
                    <li>Reward feedback loops enhance motivation and self-esteem</li>
                    <li>Cognitive offloading (e.g., Dailies sidebar) reduces mental clutter and anxiety [8]</li>
                  </ul>
                  <p className="text-slate-300 mt-3">
                    It's especially helpful for individuals with ADHD, anxiety, executive dysfunction, or decision fatigue, as it applies behavioral strategies like task chunking, cognitive offloading, and structured reinforcement to support follow-through and reduce overwhelm.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* References */}
            <AccordionItem value="references" className="border border-slate-700 rounded-lg bg-slate-800/90 backdrop-blur-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-white">
                References
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Aarts, H. et al. (2010). Habits as knowledge structures.</li>
                  <li>Cowan, N. (2001). The magical number 4 in short-term memory.</li>
                  <li>Martinussen et al. (2005). Working memory deficits in ADHD.</li>
                  <li>Locke & Latham (2002). Goal-setting theory.</li>
                  <li>Baumeister et al. (1998). Ego depletion and decision fatigue.</li>
                  <li>Barkley & Brown (2011). Social motivation and cooperative tasks in ADHD.</li>
                  <li>Clear, J. (2018). Atomic Habits.</li>
                  <li>Risko & Gilbert (2016). Cognitive offloading.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* AI Sidekick */}
      <AISidekick />
    </div>
  );
};

export default Help;