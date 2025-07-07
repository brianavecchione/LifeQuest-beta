
import React from 'react';
import { Crown, Users, TrendingUp, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const PartyDashboard = () => {
  // Empty state - no hardcoded party data
  const partyData = null;

  if (!partyData) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-purple-600/30 shadow-2xl text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Party Yet</h2>
        <p className="text-muted-foreground">Join or create a party to start collaborating with other adventurers!</p>
      </div>
    );
  }

  return <div>Party feature coming soon...</div>;
};

export default PartyDashboard;
