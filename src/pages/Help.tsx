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
                  Head to the Quests page and click "New Quest." Give your quest a name, pick a type (Daily, Main, Side, or Legendary), and set its priority. You can also add a short description or tags to keep things organized. When you're ready, hit "Create Quest" to add it to your journey!
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="quest-types" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What's the difference between quest types?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Each quest type serves a different purpose to help you organize your goals:<br/><br/>
                  <strong>Daily Quests:</strong> Habits or routines that repeat every day (e.g., stretch, journal)<br/>
                  <strong>Main Quests:</strong> Big projects or high-priority goals (e.g., finish a report)<br/>
                  <strong>Side Quests:</strong> Smaller tasks or optional to-dos (e.g., return a package)<br/>
                  <strong>Legendary Quests:</strong> Major life achievements or long-term milestones (e.g., publish a book)<br/><br/>
                  Using quest types helps you balance short-term actions with long-term aspirations.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Game Mechanics */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Game Mechanics</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="level-up" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I earn XP and gold?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  XP and gold are earned by completing quests based on their difficulty and priority. Each quest has a preset reward amount:<br/><br/>
                  • Easy + Low Priority = 5 XP, 2 Gold<br/>
                  • Easy + Medium Priority = 10 XP, 3 Gold<br/>
                  • Easy + High Priority = 15 XP, 4 Gold<br/>
                  • Moderate + Low Priority = 15 XP, 5 Gold<br/>
                  • Moderate + Medium Priority = 20 XP, 6 Gold<br/>
                  • Moderate + High Priority = 25 XP, 8 Gold<br/>
                  • Hard + Low Priority = 25 XP, 8 Gold<br/>
                  • Hard + Medium Priority = 30 XP, 10 Gold<br/>
                  • Hard + High Priority = 35 XP, 12 Gold<br/><br/>
                  You also earn 25 bonus XP and 10 gold for completing all of your daily focus tasks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="xp-system" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How does the leveling system work?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  LifeQuest uses a progressive XP system inspired by RPGs and incremental games. As you level up, the XP needed for the next level increases—encouraging consistent effort while making your journey feel more epic over time.<br/><br/>
                  For example:<br/>
                  • Level 1 requires 100 XP total<br/>
                  • Level 2: 300 XP total (200 XP after reaching level 1)<br/>
                  • Level 3: 600 XP total (300 XP after level 2)<br/>
                  • Level 4: 1,000 XP total<br/>
                  • Level 5: 1,500 XP total<br/><br/>
                  Each level requires more XP than the last. The formula we use is:<br/>
                  XP required to reach level n = 100 × (n × (n + 1)) ÷ 2<br/><br/>
                  This ensures leveling up feels progressively more rewarding and aligns with your growing consistency.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="gold-shop" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What can I buy with gold?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Gold is your personal reward currency! You earn it by completing quests, and you can spend it in the Gold Shop to create your own incentives—like a treat, a break, or a fun activity.<br/><br/>
                  In the future, you'll be able to unlock exclusive LifeQuest themes, features, and dashboard customizations using your gold. Keep an eye on updates as we roll out new ways to make your quest even more fun and meaningful.
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
                  Daily Quests reset automatically at midnight in your local time zone. Any incomplete dailies are archived, and fresh versions are generated for the new day.<br/><br/>
                  This system helps you maintain momentum by starting each day clean—and if you complete your habits regularly, you'll keep your streaks going strong.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="edit-delete" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Can I edit or delete quests?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Yes! Click on any quest to open its details. From there, you can:<br/>
                  • Edit the name, description, type, priority, and tags<br/>
                  • Delete it entirely if it's no longer needed<br/><br/>
                  Completed quests are archived and can't be edited—but you can always duplicate or recreate them.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="pomodoro" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What's the Pomodoro timer feature?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  The Pomodoro timer helps you stay focused by breaking your work into manageable sprints: 25 minutes of work + 5 minutes of rest.<br/><br/>
                  This method has been shown to reduce burnout and increase productivity by encouraging short, intentional focus sessions (Cirillo, 2006). You can enable the timer for any quest you want to track.
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
                  Parties are on the way! You'll soon be able to create or join a party on the Parties page using a party code.<br/>
                  Parties let you share your progress with others, cheer each other on, and compete on shared leaderboards. Whether you're working with friends or connecting with fellow adventurers, it's a great way to stay motivated and inspired.
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
                  Click the gear icon on your character card on the Today page to edit your avatar and display name. You can also find these settings under the Customization tab.<br/><br/>
                  We're working on even more options, including new avatar styles and dashboard themes. Some of these may be unlockable using gold, so keep collecting those rewards to personalize your LifeQuest world!
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="data-export" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Can I export my data?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Yes. Under the Settings page, go to Data Management, where you'll see the option to export your quest history as a CSV file.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="delete-account" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How do I delete my account?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  To delete your account, head to Settings and scroll to the bottom. You'll see an option to Delete Account.<br/><br/>
                  ⚠️ This action is permanent and cannot be undone, so please double-check before proceeding. It will erase all of your progress, quests, and user data.
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
                  Start by refreshing the page—this fixes most issues. If that doesn't help, check your internet connection and try logging out and back in.<br/><br/>
                  Still stuck? Reach out via our <a href="https://tally.so/r/wb1jM6" className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">support form</a> or email us at contact@getlifequest.com with a description of what's going wrong. We'll get it sorted as soon as possible.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="performance" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  The app is running slowly or freezing
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  If LifeQuest feels laggy or unresponsive, try these quick fixes:<br/>
                  • Close other tabs that may be using up memory<br/>
                  • Clear your browser's cache<br/>
                  • Try a different browser to see if performance improves<br/><br/>
                  Sometimes, certain browser extensions (like ad blockers) can interfere with app performance. Disabling them temporarily may help.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="bug-report" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  I found a bug - how do I report it?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Thank you for helping us improve LifeQuest! You can report bugs using our <a href="https://tally.so/r/wb1jM6" className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">support form</a> or by emailing contact@getlifequest.com.<br/><br/>
                  Please include as much detail as possible: what went wrong, what you expected to happen, and steps we can take to recreate the issue. We appreciate your help in making LifeQuest better for everyone.
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
                  Think of your tasks like a game quest log:<br/><br/>
                  <strong>Daily Quests</strong> are for habits you want to build—repeatable, easy wins.<br/>
                  <em>Example:</em> "Drink 8 glasses of water," "Stretch for 10 minutes," "Take morning meds."<br/><br/>
                  <strong>Main Quests</strong> are for important projects or milestones you're actively working toward.<br/>
                  <em>Example:</em> "Finish Q3 report," "Submit job application," "Write draft of research paper."<br/><br/>
                  <strong>Side Quests</strong> are optional or smaller tasks that support your day but aren't mission-critical.<br/>
                  <em>Example:</em> "Organize desktop," "Buy new notebook," "Reply to emails."<br/><br/>
                  <strong>Legendary Quests</strong> are your long-term, life-defining goals—the epic stuff.<br/>
                  <em>Example:</em> "Launch my startup," "Publish my book," "Run a half marathon."<br/><br/>
                  Use tags to group your quests by category: #Work, #Health, #Creative, #Learning, #Admin, etc. This lets you sort and filter based on your focus for the day.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="build-habits" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  What's the best way to build habits?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  The best way to build habits is to start small and stay consistent. Research shows that small actions—like one push-up or one sentence—are more likely to become lasting habits than big, overwhelming goals (Tiny Habits, 2019). LifeQuest's Daily Quests are designed around this idea: small, achievable actions that reinforce consistency over intensity.<br/><br/>
                  Instead of aiming for perfection, focus on showing up regularly. Neuroscience research shows that habits form through repetition (Graybiel, 2008), and other research emphasizes that missing a day isn't failure—quitting is (Atomic Habits, 2018). That's why the LifeQuest streak system helps you stay motivated without guilt-tripping you for missing a day.<br/><br/>
                  Finally, don't try to change everything at once. Studies on cognitive load and self-control show that focusing on just 2–3 habits at a time is far more effective (Sweller, 1988; Baumeister, 1998). LifeQuest encourages you to keep it simple, so you can build a sustainable rhythm and expand as habits become second nature.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="stay-motivated" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  How can I stay motivated long-term?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Staying motivated long-term works best when you combine meaningful incentives with visible progress. Setting personal rewards in the Gold Shop helps your brain associate effort with payoff, which increases follow-through. Even small rewards can trigger dopamine responses that reinforce behavior over time (Eisenberger & Cameron, 1996).<br/><br/>
                  Celebrating progress is also key. When you track wins—like completing streaks, leveling up, or earning badges—it creates a positive feedback loop that boosts momentum (Amabile & Kramer, 2011). LifeQuest is designed to make that progress feel visible and satisfying.<br/><br/>
                  For an added layer of accountability, join a party. Sharing goals with others increases follow-through, especially when you're encouraged by a supportive group (Bandura, 1977). Progress won't always be linear, but what matters most is the overall direction—and LifeQuest helps you keep that in view.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Privacy and Data Security */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Privacy and Data Security</h3>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="privacy" className="border border-slate-600 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left text-white hover:text-amber-300">
                  Privacy and data security
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-slate-300">
                  Your privacy is important to us. All your data is encrypted and securely stored. We never sell or share your personal information with third parties.<br/><br/>
                  For full transparency about how your data is handled and what rights you have, check out our <a href="https://getlifequest.com/privacy-policy" className="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. Your journey is yours alone—we're just here to help you track it safely.
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