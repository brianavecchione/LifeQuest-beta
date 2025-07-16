
import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AISidekick = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Greetings, brave adventurer! I am your AI sidekick, here to help you plan quests, stay motivated, and brainstorm new challenges. What adventure shall we embark on today?'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: 'I understand your quest! Let me help you break that down into manageable tasks. Would you like me to suggest some specific steps to get started?' }
    ];

    setMessages(newMessages);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl z-50 px-6 py-3 text-lg font-bold"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Summon AI Sidekick
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-purple-600/30 shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-purple-400">AI Sidekick</h3>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          ×
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white ml-8'
                : 'bg-slate-700 text-slate-200 mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for quest ideas, motivation, or planning help..."
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AISidekick;
