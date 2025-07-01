
import React, { useState } from 'react';
import { MessageCircle, Send, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PartyChat = () => {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    {
      id: '1',
      author: 'Emma',
      message: 'Just completed the legendary quest! 🏆',
      timestamp: '2 min ago',
      type: 'message',
      avatar: null
    },
    {
      id: '2',
      author: 'System',
      message: 'Emma completed "Master the Art of Focus" and earned 200 XP!',
      timestamp: '2 min ago',
      type: 'notification',
      avatar: null
    },
    {
      id: '3',
      author: 'Alexander',
      message: 'Great work everyone! We\'re so close to our party goal 💪',
      timestamp: '5 min ago',
      type: 'message',
      avatar: null
    },
    {
      id: '4',
      author: 'Sarah',
      message: 'Who wants to tackle the new weekly challenge together?',
      timestamp: '12 min ago',
      type: 'message',
      avatar: null
    },
    {
      id: '5',
      author: 'System',
      message: 'Mike completed "Daily Workout Routine" and earned 50 XP!',
      timestamp: '15 min ago',
      type: 'notification',
      avatar: null
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the server
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-green-600/30 shadow-2xl h-[500px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-bold text-green-400">Party Chat</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === 'notification' ? 'justify-center' : ''}`}>
            {msg.type === 'notification' ? (
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-300 text-sm">
                  <Bell className="w-4 h-4" />
                  <span>{msg.message}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{msg.timestamp}</div>
              </div>
            ) : (
              <>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                    {msg.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{msg.author}</span>
                      <span className="text-slate-400 text-xs">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-sm">{msg.message}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
        />
        <Button
          onClick={handleSendMessage}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          disabled={!message.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PartyChat;
