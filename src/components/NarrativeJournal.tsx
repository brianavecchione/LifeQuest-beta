
import React, { useState } from 'react';
import { BookOpen, Scroll, Feather, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const NarrativeJournal = () => {
  const [currentTab, setCurrentTab] = useState<'journal' | 'lore'>('journal');

  const journalEntries = [
    {
      date: '2025-01-07',
      title: 'The Journey Begins',
      content: 'Today I started my quest to become a more productive adventurer. Completed my first workout quest and earned 50 XP!',
      xp: 50,
      type: 'milestone'
    },
    {
      date: '2025-01-06',
      title: 'Forest of Focus',
      content: 'Struggled through the dense forest of procrastination but emerged victorious with my project proposal complete.',
      xp: 150,
      type: 'quest'
    }
  ];

  const dailyLore = {
    title: "The Misty Mountains Challenge",
    content: "A thick fog has settled over your realm, making it difficult to see the path ahead. Only by completing your daily quests can you clear the mist and reveal new opportunities. The ancient spirits whisper of great rewards for those who persist through the challenges ahead.",
    mood: "mysterious",
    icon: "🌫️"
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-amber-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-amber-400">Chronicle of Adventures</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={currentTab === 'journal' ? 'default' : 'outline'}
            onClick={() => setCurrentTab('journal')}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Scroll className="w-4 h-4 mr-1" />
            Journal
          </Button>
          <Button
            size="sm"
            variant={currentTab === 'lore' ? 'default' : 'outline'}
            onClick={() => setCurrentTab('lore')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Feather className="w-4 h-4 mr-1" />
            Daily Lore
          </Button>
        </div>
      </div>

      {currentTab === 'journal' && (
        <div className="space-y-4">
          {journalEntries.map((entry, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">{entry.date}</span>
                </div>
                <Badge className="bg-amber-600 text-white">
                  +{entry.xp} XP
                </Badge>
              </div>
              <h4 className="text-white font-bold mb-2">{entry.title}</h4>
              <p className="text-slate-300 text-sm">{entry.content}</p>
            </div>
          ))}
          
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            <Feather className="w-4 h-4 mr-2" />
            Write New Entry
          </Button>
        </div>
      )}

      {currentTab === 'lore' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-lg p-6 border border-purple-500/30">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{dailyLore.icon}</div>
              <h4 className="text-xl font-bold text-purple-300">{dailyLore.title}</h4>
            </div>
            <p className="text-slate-200 leading-relaxed text-center italic">
              "{dailyLore.content}"
            </p>
            <div className="mt-4 text-center">
              <Badge className="bg-purple-600 text-white">
                Today's Challenge
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Generate New Lore
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NarrativeJournal;
