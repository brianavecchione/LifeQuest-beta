import React, { useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import mockup images
import mockupDashboard from '@/assets/mockup-dashboard.jpg';
import mockupQuestTracking from '@/assets/mockup-quest-tracking.jpg';
import mockupProfileAchievements from '@/assets/mockup-profile-achievements.jpg';
import mockupPartySocial from '@/assets/mockup-party-social.jpg';

interface FeatureSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
}

const features: FeatureSlide[] = [
  {
    id: 'dashboard',
    title: 'Character Stats & Progress',
    description: 'Track your character progression with XP charts, level advancement, and streak counters. Watch your stats grow as you complete quests!',
    image: mockupDashboard,
    badge: 'Character System',
  },
  {
    id: 'tracking',
    title: 'Quest Management',
    description: 'Organize your tasks as RPG-style quests with different types: Daily habits, Main objectives, Side tasks, and Legendary challenges.',
    image: mockupQuestTracking,
    badge: 'Quest System',
  },
  {
    id: 'achievements',
    title: 'Analytics & Achievements',
    description: 'Visualize your productivity with XP charts, maintain streaks for consistent habits, and unlock achievement badges.',
    image: mockupProfileAchievements,
    badge: 'Progress Analytics',
  },
  {
    id: 'social',
    title: 'Party Collaboration',
    description: 'Form adventuring parties with friends, share quests, compete on leaderboards, and achieve goals together.',
    image: mockupPartySocial,
    badge: 'Social Gaming',
  },
];

export const FeatureCarousel = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!api) {
      return;
    }

    const autoScroll = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [api]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center lg:text-left">
        <h3 className="text-xl font-semibold text-white mb-2">
          See What Awaits You
        </h3>
        <p className="text-slate-300 text-sm">
          Explore the features that make LifeQuest your ultimate productivity companion
        </p>
      </div>

      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={feature.id}>
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-t-lg"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-amber-600/90 text-white border-none">
                        {feature.badge}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-6 bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80" />
        <CarouselNext className="hidden sm:flex -right-4 lg:-right-6 bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80" />
      </Carousel>

      {/* Dot indicators */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === current - 1
                ? 'bg-amber-500 w-6'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint for mobile */}
      <div className="text-center sm:hidden">
        <p className="text-xs text-slate-400">
          Swipe to explore features →
        </p>
      </div>
    </div>
  );
};