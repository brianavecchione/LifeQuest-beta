
import React, { useState } from 'react';
import { UserPlus, Settings, Copy, Shield, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PartyManagement = () => {
  const [inviteCode] = useState('DS-7X4K9');
  const [showInvite, setShowInvite] = useState(false);
  
  const partyMembers = [
    { id: '1', name: 'Alexander', level: 12, isLeader: true, isCoLeader: false, avatar: null },
    { id: '2', name: 'Sarah', level: 11, isLeader: false, isCoLeader: true, avatar: null },
    { id: '3', name: 'Mike', level: 10, isLeader: false, isCoLeader: false, avatar: null },
    { id: '4', name: 'Emma', level: 13, isLeader: false, isCoLeader: false, avatar: null },
    { id: '5', name: 'David', level: 9, isLeader: false, isCoLeader: false, avatar: null }
  ];

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    // In a real app, you'd show a toast notification here
    console.log('Invite code copied!');
  };

  const handlePromoteToCoLeader = (memberId: string) => {
    console.log('Promoting member to co-leader:', memberId);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Removing member:', memberId);
  };

  return (
    <div className="space-y-6">
      {/* Invite Management */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-indigo-600/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-indigo-400">Invite Members</h3>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setShowInvite(!showInvite)}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Generate Invite Link
          </Button>

          {showInvite && (
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
              <div className="mb-2">
                <label className="text-slate-300 text-sm font-medium">Party Invite Code</label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={inviteCode}
                  readOnly
                  className="flex-1 bg-slate-800 border-slate-600 text-white"
                />
                <Button size="sm" onClick={copyInviteCode} className="bg-slate-600 hover:bg-slate-700">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                Share this code with friends to invite them to your party (Max: 10 members)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Member Management */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-red-600/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-bold text-red-400">Member Management</h3>
        </div>

        <div className="space-y-3">
          {partyMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{member.name}</span>
                  {member.isLeader && (
                    <Badge className="bg-yellow-600 hover:bg-yellow-700 text-xs">Leader</Badge>
                  )}
                  {member.isCoLeader && (
                    <Badge className="bg-orange-600 hover:bg-orange-700 text-xs">Co-Leader</Badge>
                  )}
                </div>
                <div className="text-slate-400 text-sm">Level {member.level}</div>
              </div>
              
              {!member.isLeader && (
                <div className="flex gap-1">
                  {!member.isCoLeader && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePromoteToCoLeader(member.id)}
                      className="text-xs border-orange-500/50 text-orange-400 hover:bg-orange-900/20"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Promote
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-xs border-red-500/50 text-red-400 hover:bg-red-900/20"
                  >
                    <UserMinus className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <div className="text-center text-slate-300 text-sm">
            <strong>Party Size:</strong> {partyMembers.length}/10 members
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyManagement;
