
import React, { useState } from 'react';
import { Play, Pause, Volume2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Soundtrack = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const playlist = [
    {
      title: 'Peaceful Day at Hogwarts',
      artist: 'Harry Potter Music',
      tags: ['#harrypotter', '#hogwarts', '#hogwartslegacy'],
      duration: '3:45'
    },
    {
      title: 'The Most Touching Game Soundtracks',
      artist: 'Various Artists',
      tags: ['#gaming', '#emotional'],
      duration: '45:20'
    },
    {
      title: 'Studio Ghibli Music Collection',
      artist: 'Studio Ghibli',
      tags: ['#studioghibli', '#relaxing'],
      duration: '28:15'
    },
    {
      title: 'Rainy Night Coffee Shop Ambience',
      artist: 'Ambient Sounds',
      tags: ['#ambient', '#focus'],
      duration: '2:00:00'
    }
  ];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-component-background border-component-border rounded-xl p-6 border shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-indigo-400">Soundtrack</h3>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1" />
          Add Track
        </Button>
      </div>

      <div className="space-y-3">
        {playlist.map((track, index) => (
          <div 
            key={index}
            className={`bg-component-muted rounded-lg p-4 border transition-all cursor-pointer hover:bg-component-muted/80 ${
              currentTrack === index ? 'border-indigo-500/70 bg-indigo-900/20' : 'border-component-border'
            }`}
            onClick={() => setCurrentTrack(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-component-foreground font-medium mb-1">{track.title}</h4>
                <p className="text-muted-foreground text-sm mb-2">{track.artist}</p>
                <div className="flex gap-1 flex-wrap">
                  {track.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-muted-foreground text-sm ml-4">
                {track.duration}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-component-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-component-foreground font-medium">{playlist[currentTrack].title}</div>
            <div className="text-muted-foreground text-sm">{playlist[currentTrack].artist}</div>
          </div>
          <Button
            onClick={togglePlayback}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 rounded-full w-10 h-10 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-indigo-400 h-full rounded-full transition-all duration-300" style={{ width: '35%' }} />
        </div>
      </div>
    </div>
  );
};

export default Soundtrack;
