import React from 'react';

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
                  LifeQuest was created by me, Briana Vecchione—a researcher in computer and information science with a deep interest in how technology can support personal growth, mental health, and wellness. Designed for people who thrive on structure, enjoy games, or want to build a more intentional relationship with their goals, LifeQuest transforms everyday tasks into an immersive and rewarding experience.
                </p>
                <p className="mb-4">
                  Inspired by behavioral psychology and game design, the platform uses streaks, progress tracking, and meaningful rewards to help users stay motivated and focused without relying on guilt or rigid discipline.
                </p>
                <p>
                  Whether you're feeling overwhelmed, struggling to stay organized, craving more structure, or just want to bring more fun and intention into your daily routine, LifeQuest was built with you in mind.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Built on Science</h2>
            <p className="mb-4">
              LifeQuest is built on established principles from behavioral psychology, gamification research, 
              and neuroscience. Our approach incorporates:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dopamine-driven reward mechanisms that create positive feedback loops</li>
              <li>Progressive achievement systems that build momentum through consistent small wins</li>
              <li>Visual categorization and filtering to reduce cognitive load and decision fatigue</li>
              <li>Focus limitation techniques based on working memory research</li>
              <li>Customizable interfaces to accommodate different cognitive styles and preferences</li>
            </ul>
          </section>

          <section className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">The Mission</h2>
            <p className="mb-4">
              LifeQuest was created to help people with ADHD, motivation challenges, and productivity struggles 
              by transforming everyday tasks into engaging quests within a fantasy RPG-like experience.
            </p>
            <p>
              We believe that productivity tools should be enjoyable, accessible, and effective—especially for 
              neurodivergent individuals who often struggle with traditional productivity systems.
            </p>
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
              LifeQuest is more than just a productivity app—it's a community of people supporting each other 
              on their quests to build better habits, accomplish goals, and level up their lives.
            </p>
            <p>
              Whether you're a student, professional, creative, or anyone looking to bring more structure and 
              enjoyment to your daily tasks, we invite you to join us on this epic journey.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;