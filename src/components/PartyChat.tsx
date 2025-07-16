
import React, { useState } from 'react';
import { MessageCircle, Send, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePartyData } from '@/hooks/usePartyDataWrapper';

const PartyChat = () => {
  const [message, setMessage] = useState('');
  const { chatMessages, partyMembers, chatLoading, sendMessage } = usePartyData();

  // Get member details for message display
  const getMemberDetails = (userId: string) => {
    return partyMembers.find(m => m.user_id === userId) || { username: 'Unknown User' };
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage();
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (chatLoading) {
    return (
      <div className="bg-component-background rounded-xl p-6 border border-green-600/30 shadow-2xl h-[500px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-green-400">Party Chat</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-component-background rounded-xl p-6 border border-green-600/30 shadow-2xl h-[500px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-bold text-green-400">Party Chat</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {chatMessages.length > 0 ? (
          chatMessages.map((msg) => {
            const memberDetails = getMemberDetails(msg.user_id);
            
            return (
              <div key={msg.message_id} className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                    {memberDetails.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{memberDetails.username}</span>
                      <span className="text-slate-400 text-xs">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <p className="text-slate-200 text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No messages yet</p>
              <p className="text-slate-500 text-sm">Join a party to start chatting with fellow adventurers!</p>
            </div>
          </div>
        )}
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
