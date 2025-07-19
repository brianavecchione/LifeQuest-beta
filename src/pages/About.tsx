import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="text-white">
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-36 pb-12">{/* Added more padding at the top */}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            About LifeQuest
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            A gamified productivity platform designed to transform your daily goals into epic adventures.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-slate-300">
          <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-6">Meet the Founder</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img 
                  src="/lovable-uploads/3414ac74-8342-4b27-9146-5d7cf3c9b215.png" 
                  alt="Briana Vecchione, Founder of LifeQuest" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-amber-400/30"
                />
              </div>
              <div className="flex-1">
                <p className="mb-4">
                  Hi, I'm Briana. I'm a researcher in computer and information science with a deep interest in how technology can support personal growth, mental health, and wellness.
                </p>
                <p className="mb-4">
                  I built LifeQuest because I couldn't find a productivity tool that actually worked for me—so I made one. I wanted something that kept me motivated with real-world rewards, offered an immersive environment, and didn't feel overwhelming or cluttered with features I didn't need. LifeQuest is a blend of my academic background and research interests with my creative passions: games, software development, behavioral design, storytelling, and self-exploration.
                </p>
                <p className="mb-4">
                  LifeQuest is my "side quest," so to speak. By day, I'm a full-time researcher studying the sociotechnical impacts of AI systems. I hold a PhD in computer and information science from Cornell University, and my work has been supported by organizations like Google, Facebook, Microsoft, the National Science Foundation, the MacArthur Foundation, the Mozilla Foundation, and the Notre Dame–IBM Tech Ethics Lab.
                </p>
                <p>
                  You can learn more about my research at{" "}
                  <a href="https://brianavecchione.org" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline">
                    brianavecchione.org
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Built on Science</h2>
            <p className="mb-4">
              LifeQuest is grounded in behavioral psychology, gamification research, and neuroscience. Every mechanic is designed with intention—to support follow-through, reduce friction, and make progress feel rewarding. Our approach incorporates insights from leading research:
            </p>
            <ul className="list-disc list-inside space-y-3 ml-4 mb-6">
              <li>
                <strong>Dopamine-based reward loops:</strong> Reinforcing small wins triggers the brain's reward system, increasing motivation and habit strength over time
                <span className="text-slate-400"> (Berridge & Robinson, 2016; NIH/NIDA)</span>
              </li>
              <li>
                <strong>Progressive achievement structures:</strong> Goal-setting theory shows that clear, incremental goals significantly improve task performance
                <span className="text-slate-400"> (Locke & Latham, 2002, American Psychologist)</span>
              </li>
              <li>
                <strong>Cognitive offloading and visual organization:</strong> Externalizing information—like with categorized quest types and filters—helps reduce cognitive load and decision fatigue
                <span className="text-slate-400"> (Risko & Gilbert, 2016, Trends in Cognitive Sciences)</span>
              </li>
              <li>
                <strong>Working memory-informed task design:</strong> We limit focus tasks based on the understanding that most people can only hold about 4±1 items in working memory at once
                <span className="text-slate-400"> (Cowan, 2001, Behavioral and Brain Sciences)</span>
              </li>
              <li>
                <strong>Habit formation through environmental cues and repetition:</strong> Anchoring behaviors to cues and rewarding consistency helps embed long-term habits
                <span className="text-slate-400"> (Fogg, 2019, Tiny Habits; Lally et al., 2010, European Journal of Social Psychology)</span>
              </li>
              <li>
                <strong>Autonomy and customization:</strong> Allowing users to shape their own experience (via theme, focus, and soundtrack) increases engagement and intrinsic motivation
                <span className="text-slate-400"> (Ryan & Deci, 2000, Self-Determination Theory)</span>
              </li>
              <li>
                <strong>Gamified motivational design:</strong> Badges, streaks, and rewards can boost user engagement when used with care and tied to meaningful goals
                <span className="text-slate-400"> (Hamari et al., 2014, Computers in Human Behavior)</span>
              </li>
            </ul>
            <p className="mb-6">
              LifeQuest combines these principles into a playful system that supports both structure and self-discovery. It's not about forcing productivity—it's about designing an environment where progress becomes natural.
            </p>
            
            <div className="border-t border-slate-600 pt-4">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">References</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400">
                <li>
                  Berridge, K. C., & Robinson, T. E. (2016). 
                  <a href="https://psycnet.apa.org/manuscript/2016-59374-007.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    Liking, wanting, and the incentive-sensitization theory of addiction
                  </a> - NIH/NIDA
                </li>
                <li>
                  Locke, E. A., & Latham, G. P. (2002). 
                  <a href="https://psycnet.apa.org/record/2002-15790-003" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    Building a practically useful theory of goal setting and task motivation: A 35-year odyssey
                  </a> - American Psychologist
                </li>
                <li>
                  Risko, E. F., & Gilbert, S. J. (2016). 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/27542527/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    Cognitive offloading
                  </a> - Trends in Cognitive Sciences
                </li>
                <li>
                  Cowan, N. (2001). 
                  <a href="https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/magical-number-4-in-shortterm-memory-a-reconsideration-of-mental-storage-capacity/44023F1147D4A1D44BDC0AD226838496" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    The magical number 4 in short-term memory: A reconsideration of mental storage capacity
                  </a> - Behavioral and Brain Sciences
                </li>
                <li>
                  Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). 
                  <a href="https://onlinelibrary.wiley.com/doi/10.1002/ejsp.674" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    How are habits formed: Modelling habit formation in the real world
                  </a> - European Journal of Social Psychology
                </li>
                <li>
                  Fogg, B. J. (2019). 
                  <a href="https://tinyhabits.com/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    Tiny Habits: The Small Changes That Change Everything
                  </a> - Book
                </li>
                <li>
                  Ryan, R. M., & Deci, E. L. (2000). 
                  <a href="https://psycnet.apa.org/record/2000-13324-007" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being
                  </a> - American Psychologist
                </li>
                <li>
                  Hamari, J., Koivisto, J., & Sarsa, H. (2014). 
                  <a href="https://ieeexplore.ieee.org/document/6758978" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline ml-1">
                    Does Gamification Work? – A Literature Review of Empirical Studies on Gamification
                  </a> - IEEE Xplore
                </li>
              </ol>
            </div>
          </section>


          <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Looking for Collaborators</h2>
            <p className="mb-4">
              This is just the beginning—and I'm looking for collaborators to help shape what comes next.
            </p>
            <p className="mb-4">
              If you have skills in any of the following, I'd love to connect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Software development (especially front-end, mobile, or full-stack)</li>
              <li>Game design and systems thinking</li>
              <li>Behavioral science or psychology</li>
              <li>Audio/sound design</li>
              <li>UI/UX design</li>
              <li>Community building</li>
              <li>Narrative design or worldbuilding</li>
            </ul>
            <p>
              If you're passionate about building supportive tools for growth, focus, and joy, please reach out!
            </p>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Join the Adventure</h2>
            <p className="mb-4">
              I want LifeQuest to be more than just a productivity app—I want it to grow into a community of people supporting each other on their quests to build better habits, accomplish meaningful goals, and level up their lives.
            </p>
            <p className="mb-6">
              Whether you're a student, professional, creative, or simply someone looking to bring more structure and enjoyment to your daily routine, I invite you to join the journey.
            </p>
            
            {/* Support LifeQuest Button */}
            <div className="flex justify-center">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-pink-500/50 bg-pink-600/20 text-pink-300 hover:bg-pink-600/30 hover:text-pink-200 transition-all duration-300"
                title="Help us build more features, fix bugs, and keep the quest alive."
              >
                <a href="https://coff.ee/lifequest" target="_blank" rel="noopener noreferrer">
                  <Heart className="w-5 h-5 mr-2" />
                  Support LifeQuest
                </a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;