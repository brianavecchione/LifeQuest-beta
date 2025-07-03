import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Gift, Plus, Clock, Star, Crown, Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reward {
  id: string;
  name: string;
  description: string;
  goldCost: number;
  type: 'custom' | 'lifequest';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  duration?: number; // days
  effect?: string;
  image?: string;
  redeemed: boolean;
}

const GoldShop = () => {
  const { toast } = useToast();
  const [userGold] = useState(2750);
  const [customRewardName, setCustomRewardName] = useState('');
  const [customRewardCost, setCustomRewardCost] = useState('');
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  const [customRewards, setCustomRewards] = useState<Reward[]>([
    {
      id: '1',
      name: 'Buy myself a latte',
      description: 'Treat myself to a delicious coffee',
      goldCost: 200,
      type: 'custom',
      redeemed: false
    },
    {
      id: '2', 
      name: 'Movie night',
      description: 'Watch a movie I\'ve been wanting to see',
      goldCost: 500,
      type: 'custom',
      redeemed: false
    }
  ]);

  const lifequestRewards: Reward[] = [
    {
      id: 'lq1',
      name: 'Sword of Focus',
      description: '+15% XP on Side Quests for 7 days',
      goldCost: 2500,
      type: 'lifequest',
      rarity: 'epic',
      duration: 7,
      effect: '+15% Side Quest XP',
      redeemed: false
    },
    {
      id: 'lq2',
      name: 'Timekeeper\'s Hourglass',
      description: '+10 minutes on the Quest Timer for 3 days',
      goldCost: 1500,
      type: 'lifequest',
      rarity: 'rare',
      duration: 3,
      effect: '+10min Timer',
      redeemed: false
    },
    {
      id: 'lq3',
      name: 'Phoenix Companion',
      description: 'Revives failed daily streaks once per week',
      goldCost: 5000,
      type: 'lifequest',
      rarity: 'legendary',
      effect: 'Streak Revival',
      redeemed: false
    },
    {
      id: 'lq4',
      name: '$5 Gift Card',
      description: 'Choose from Amazon, Starbucks, or Steam',
      goldCost: 3000,
      type: 'lifequest',
      rarity: 'epic',
      redeemed: false
    },
    {
      id: 'lq5',
      name: 'Golden Quest Badge',
      description: 'Show off your dedication with this premium badge',
      goldCost: 800,
      type: 'lifequest',
      rarity: 'common',
      redeemed: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-600 text-slate-200';
      case 'rare': return 'bg-blue-600 text-blue-100';
      case 'epic': return 'bg-purple-600 text-purple-100';
      case 'legendary': return 'bg-yellow-600 text-yellow-100';
      default: return 'bg-slate-600 text-slate-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-3 h-3" />;
      case 'rare': return <Gem className="w-3 h-3" />;
      case 'epic': return <Crown className="w-3 h-3" />;
      case 'legendary': return <Crown className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const addCustomReward = () => {
    if (!customRewardName || !customRewardCost) return;
    
    const newReward: Reward = {
      id: Date.now().toString(),
      name: customRewardName,
      description: `Personal reward: ${customRewardName}`,
      goldCost: parseInt(customRewardCost),
      type: 'custom',
      redeemed: false
    };
    
    setCustomRewards([...customRewards, newReward]);
    setCustomRewardName('');
    setCustomRewardCost('');
    setIsAddingReward(false);
    
    toast({
      title: "Reward Added! 🎁",
      description: `${newReward.name} has been added to your rewards.`,
    });
  };

  const redeemReward = (reward: Reward) => {
    if (userGold >= reward.goldCost) {
      setSelectedReward(reward);
    } else {
      toast({
        title: "Not Enough Gold! 💰",
        description: `You need ${reward.goldCost - userGold} more gold to unlock this reward.`,
        variant: "destructive"
      });
    }
  };

  const confirmRedemption = () => {
    if (!selectedReward) return;
    
    toast({
      title: "🎉 You've Unlocked a Reward!",
      description: selectedReward.type === 'custom' 
        ? "Treat yourself—mark this as complete once you enjoy it!"
        : "Check your email for delivery details, or update your shipping info.",
    });
    
    setSelectedReward(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Fantasy background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            💰 Gold Shop
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Welcome to the Gold Shop, where your hard-earned Gold transforms into epic rewards!<br />
            Use your Gold to unlock personal treats or exclusive LifeQuest treasures—because every hero deserves a prize.
          </p>
          
          {/* Gold Balance Display */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{userGold.toLocaleString()} Gold</div>
                  <div className="text-sm text-slate-300">Available to spend</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Tabs */}
        <Tabs defaultValue="my-rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="my-rewards" className="data-[state=active]:bg-amber-600">
              My Rewards
            </TabsTrigger>
            <TabsTrigger value="lifequest-rewards" className="data-[state=active]:bg-purple-600">
              LifeQuest Rewards
            </TabsTrigger>
          </TabsList>

          {/* My Rewards Tab */}
          <TabsContent value="my-rewards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-400">Your Personal Rewards</h2>
              <Dialog open={isAddingReward} onOpenChange={setIsAddingReward}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Reward
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-amber-400">Add Custom Reward</DialogTitle>
                    <DialogDescription className="text-slate-300">
                      Create a personal reward to motivate yourself!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reward-name" className="text-slate-300">Reward Name</Label>
                      <Input
                        id="reward-name"
                        value={customRewardName}
                        onChange={(e) => setCustomRewardName(e.target.value)}
                        placeholder="e.g., Buy myself a latte"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward-cost" className="text-slate-300">Gold Cost</Label>
                      <Input
                        id="reward-cost"
                        type="number"
                        value={customRewardCost}
                        onChange={(e) => setCustomRewardCost(e.target.value)}
                        placeholder="200"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Button onClick={addCustomReward} className="w-full bg-amber-600 hover:bg-amber-700">
                      Add Reward
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customRewards.map((reward) => (
                <Card key={reward.id} className="bg-slate-800 border-slate-700 hover:border-amber-500/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      {reward.name}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{reward.goldCost} Gold</span>
                      </div>
                    </div>
                    
                    {userGold >= reward.goldCost ? (
                      <Progress value={100} className="h-2 mb-4" />
                    ) : (
                      <div className="mb-4">
                        <Progress value={(userGold / reward.goldCost) * 100} className="h-2 mb-1" />
                        <div className="text-xs text-slate-400">
                          {reward.goldCost - userGold} more gold needed
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => redeemReward(reward)}
                      disabled={userGold < reward.goldCost}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600"
                    >
                      {userGold >= reward.goldCost ? 'Unlock Now' : 'Need More Gold'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* LifeQuest Rewards Tab */}
          <TabsContent value="lifequest-rewards" className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">Exclusive LifeQuest Treasures</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifequestRewards.map((reward) => (
                <Card key={reward.id} className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-purple-400">{reward.name}</CardTitle>
                      {reward.rarity && (
                        <Badge className={getRarityColor(reward.rarity)}>
                          {getRarityIcon(reward.rarity)}
                          {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-slate-300">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reward.effect && (
                        <div className="bg-slate-700/50 p-2 rounded border border-green-500/30">
                          <div className="text-green-400 text-sm font-medium">Effect: {reward.effect}</div>
                        </div>
                      )}
                      
                      {reward.duration && (
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <Clock className="w-4 h-4" />
                          Duration: {reward.duration} days
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{reward.goldCost} Gold</span>
                        </div>
                      </div>
                      
                      {userGold >= reward.goldCost ? (
                        <Progress value={100} className="h-2" />
                      ) : (
                        <div>
                          <Progress value={(userGold / reward.goldCost) * 100} className="h-2 mb-1" />
                          <div className="text-xs text-slate-400">
                            {reward.goldCost - userGold} more gold needed
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => redeemReward(reward)}
                        disabled={userGold < reward.goldCost}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600"
                      >
                        {userGold >= reward.goldCost ? 'Claim Now' : 'Need More Gold'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Confirmation Modal */}
        <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-amber-400 text-xl">🎉 You've Unlocked a Reward!</DialogTitle>
              <DialogDescription className="text-slate-300">
                {selectedReward?.type === 'custom' 
                  ? "Treat yourself—mark this as complete once you enjoy it!"
                  : "Check your email for delivery details, or update your shipping info below."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-4">
              <div className="text-lg font-bold text-white mb-2">{selectedReward?.name}</div>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Coins className="w-5 h-5" />
                <span className="font-bold">{selectedReward?.goldCost} Gold</span>
              </div>
            </div>
            <Button onClick={confirmRedemption} className="w-full bg-amber-600 hover:bg-amber-700">
              Got It!
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GoldShop;