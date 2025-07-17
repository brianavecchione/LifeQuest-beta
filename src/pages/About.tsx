import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          About LifeQuest
        </h1>
        
        <div className="space-y-8 text-lg">
          <p>
            Welcome to LifeQuest, where everyday tasks transform into epic adventures!
            Our platform is designed to help you conquer your daily challenges while
            embracing the spirit of adventure and achievement.
          </p>
          
          <p>
            Built for those who seek more engagement and motivation in their daily
            routines, LifeQuest turns your tasks into quests, your goals into
            epic missions, and your progress into tangible achievements.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-primary">
            Our Mission
          </h2>
          <p>
            To transform the way people approach their daily tasks and personal
            development by creating an engaging, gamified experience that makes
            productivity not just effective, but truly enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;