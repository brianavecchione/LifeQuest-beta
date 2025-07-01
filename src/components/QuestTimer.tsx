
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuestTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Quest completed effect could go here
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const progress = ((initialTime - time) / initialTime) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-600/30 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-purple-400">Quest Timer</h3>
      </div>
      
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgb(51 65 85)"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgb(168 85 247)"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{formatTime(time)}</span>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleTimer}
            variant="outline"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="sm"
            className="bg-slate-600 hover:bg-slate-700 text-white border-slate-500"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestTimer;
