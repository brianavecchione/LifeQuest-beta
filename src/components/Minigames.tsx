
import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Minigames = () => {
  const [diceResult, setDiceResult] = useState<number>(1);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails'>('heads');
  const [wheelResult, setWheelResult] = useState<string>('');
  const [magic8Result, setMagic8Result] = useState<string>('');

  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1;
    setDiceResult(result);
  };

  const flipCoin = () => {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setCoinResult(result);
  };

  const spinWheel = () => {
    const options = ['$5 Gold', '$10 Gold', '$15 Gold', 'Movie Night', 'Spa Day', 'Pizza Night'];
    const result = options[Math.floor(Math.random() * options.length)];
    setWheelResult(result);
  };

  const shakeMagic8Ball = () => {
    const responses = [
      'Take a break first',
      'Start with the easiest task',
      'Tackle the hardest one',
      'Do something creative',
      'Exercise first',
      'Reward yourself after'
    ];
    const result = responses[Math.floor(Math.random() * responses.length)];
    setMagic8Result(result);
  };

  const getDiceIcon = (num: number) => {
    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const DiceIcon = diceIcons[num - 1];
    return <DiceIcon className="w-12 h-12 text-white" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-amber-400 mb-2">Available Minigames</h2>
        <p className="text-slate-300">Can't decide how to spend your gold? Play a minigame to choose for you!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dice Game */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 border border-blue-600/30 shadow-2xl">
          <h3 className="text-xl font-bold text-blue-300 mb-4 text-center">🎲 Dice</h3>
          <div className="text-center">
            <div className="bg-blue-700/50 rounded-lg p-6 mb-4">
              {getDiceIcon(diceResult)}
            </div>
            <Button onClick={rollDice} className="bg-blue-600 hover:bg-blue-700">
              Roll Dice
            </Button>
          </div>
        </div>

        {/* Coin Flip */}
        <div className="bg-gradient-to-br from-amber-800 to-yellow-900 rounded-xl p-6 border border-amber-600/30 shadow-2xl">
          <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">🪙 Coin Flip</h3>
          <div className="text-center">
            <div className="bg-amber-700/50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {coinResult === 'heads' ? 'H' : 'T'}
              </span>
            </div>
            <Button onClick={flipCoin} className="bg-amber-600 hover:bg-amber-700">
              Flip Coin
            </Button>
          </div>
        </div>

        {/* Wheel Spin */}
        <div className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-xl p-6 border border-purple-600/30 shadow-2xl">
          <h3 className="text-xl font-bold text-purple-300 mb-4 text-center">🎡 Spin the Wheel</h3>
          <div className="text-center">
            <div className="bg-purple-700/50 rounded-lg p-4 mb-4 min-h-[60px] flex items-center justify-center">
              <span className="text-white font-medium">
                {wheelResult || 'Click to spin!'}
              </span>
            </div>
            <Button onClick={spinWheel} className="bg-purple-600 hover:bg-purple-700">
              Spin Wheel
            </Button>
          </div>
        </div>

        {/* Magic 8 Ball */}
        <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-xl p-6 border border-indigo-600/30 shadow-2xl">
          <h3 className="text-xl font-bold text-indigo-300 mb-4 text-center">🔮 Magic 8 Ball</h3>
          <div className="text-center">
            <div className="bg-indigo-700/50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-sm text-center px-2">
                {magic8Result || '8'}
              </span>
            </div>
            <Button onClick={shakeMagic8Ball} className="bg-indigo-600 hover:bg-indigo-700">
              Shake Ball
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minigames;
