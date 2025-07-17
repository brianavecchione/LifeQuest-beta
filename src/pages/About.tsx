import React from 'react';

const About = () => {
  return (
    <div className="relative">
      {/* Solid background overlay to override any custom background images */}
      <div className="absolute inset-0 bg-slate-900 z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">{/* Added more padding at the top */}
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
          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Our Mission</h2>
            <p className="mb-4">
              LifeQuest was created to help people with ADHD, motivation challenges, and productivity struggles 
              by transforming everyday tasks into engaging quests within a fantasy RPG-like experience.
            </p>
            <p>
              We believe that productivity tools should be enjoyable, accessible, and effective—especially for 
              neurodivergent individuals who often struggle with traditional productivity systems.
            </p>
          </section>

          <section>
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

          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Our Team</h2>
            <p className="mb-4">
              LifeQuest was created by a small, passionate team with personal experience in ADHD, executive 
              dysfunction, and productivity challenges. We've combined our expertise in software development, 
              game design, and behavioral psychology to create a tool we wish we'd had ourselves.
            </p>
          </section>

          <section>
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