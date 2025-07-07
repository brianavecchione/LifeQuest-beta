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
import { useGoldShop } from '@/hooks/useGoldShop';
import { useRewards } from '@/hooks/useRewards';
import { useUserBalance } from '@/hooks/useUserBalance';

const GoldShopContent = () => {
  const { toast } = useToast();
  const { items: shopItems, loading: shopLoading, purchaseItem } = useGoldShop();
  const { rewards, loading: rewardsLoading, unlockReward, redeemReward, createReward } = useRewards();
  const { balance } = useUserBalance();
  
  const [customRewardName, setCustomRewardName] = useState('');
  const [customRewardCost, setCustomRewardCost] = useState('');
  const [customRewardType, setCustomRewardType] = useState<'Personal' | 'Company'>('Personal');
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const currentGold = balance?.current_gold_balance || 0;
  
  // Using real database data from hooks

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'bronze':
      case 'common': return 'bg-slate-600 text-slate-200';
      case 'silver':
      case 'rare': return 'bg-blue-600 text-blue-100';
      case 'gold':
      case 'epic': return 'bg-purple-600 text-purple-100';
      case 'legendary': return 'bg-yellow-600 text-yellow-100';
      default: return 'bg-slate-600 text-slate-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'bronze':
      case 'common': return <Star className="w-3 h-3" />;
      case 'silver':
      case 'rare': return <Gem className="w-3 h-3" />;
      case 'gold':
      case 'epic': return <Crown className="w-3 h-3" />;
      case 'legendary': return <Crown className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const addCustomReward = async () => {
    if (!customRewardName || !customRewardCost) return;
    
    await createReward({
      name: customRewardName,
      description: `Personal reward: ${customRewardName}`,
      reward_type: customRewardType,
      gold_cost: parseInt(customRewardCost),
      status: 'Locked'
    });
    
    setCustomRewardName('');
    setCustomRewardCost('');
    setIsAddingReward(false);
    
    toast({
      title: "Reward Added! 🎁",
      description: `${customRewardName} has been added to your rewards.`,
    });
  };

  const handlePurchaseShopItem = async (item: any) => {
    const result = await purchaseItem(item.shop_item_id, item.gold_cost);
    if (result.success) {
      toast({
        title: "🎉 Purchase Successful!",
        description: `You've purchased ${item.name}!`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleUnlockReward = async (reward: any) => {
    if (reward.status === 'Unlocked') {
      const result = await redeemReward(reward.reward_id);
      if (result.success) {
        toast({
          title: "🎉 Reward Redeemed!",
          description: `Enjoy your ${reward.name}!`,
        });
      }
    } else {
      const result = await unlockReward(reward.reward_id, reward.gold_cost);
      if (result.success) {
        toast({
          title: "🎉 Reward Unlocked!",
          description: `${reward.name} is now available to redeem!`,
        });
      } else {
        toast({
          title: "Unlock Failed",
          description: result.error,
          variant: "destructive"
        });
      }
    }
  };

  if (shopLoading || rewardsLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
        <div className="text-center text-slate-300">Loading shop...</div>
      </div>
    );
  }

  const personalShopItems = shopItems.filter(item => item.category === 'Personal');
  const lifequestShopItems = shopItems.filter(item => item.category === 'LifeQuest');
  const personalRewards = rewards.filter(reward => reward.reward_type === 'Personal');
  const companyRewards = rewards.filter(reward => reward.reward_type === 'Company');

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-yellow-600/30 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-yellow-400">Gold Shop</h3>
      </div>

      {/* Shop Tabs */}
      <Tabs defaultValue="my-rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700 border-slate-600 mb-6">
          <TabsTrigger value="my-rewards" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            My Rewards
          </TabsTrigger>
          <TabsTrigger value="lifequest-rewards" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            LifeQuest Rewards
          </TabsTrigger>
        </TabsList>

        {/* My Rewards Tab */}
        <TabsContent value="my-rewards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-amber-400">Your Personal Rewards</h4>
            <Dialog open={isAddingReward} onOpenChange={setIsAddingReward}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reward
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalRewards.map((reward) => (
              <Card key={reward.reward_id} className="bg-slate-700/50 border-slate-600/50 hover:border-amber-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-amber-400 flex items-center gap-2 text-base">
                    <Gift className="w-4 h-4" />
                    {reward.name}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    {reward.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-sm">{reward.gold_cost} Gold</span>
                    </div>
                    <Badge className={reward.status === 'Redeemed' ? 'bg-green-600' : reward.status === 'Unlocked' ? 'bg-blue-600' : 'bg-slate-600'}>
                      {reward.status}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handleUnlockReward(reward)}
                    disabled={reward.status === 'Redeemed' || (reward.status === 'Locked' && currentGold < reward.gold_cost)}
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600"
                  >
                    {reward.status === 'Redeemed' ? 'Completed' : reward.status === 'Unlocked' ? 'Redeem' : 'Unlock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* LifeQuest Rewards Tab */}
        <TabsContent value="lifequest-rewards" className="space-y-6">
          <h4 className="text-lg font-semibold text-purple-400">Exclusive LifeQuest Treasures</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifequestShopItems.map((item) => (
              <Card key={reward.id} className="bg-slate-700/50 border-slate-600/50 hover:border-purple-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-purple-400 text-base">{reward.name}</CardTitle>
                    {reward.rarity && (
                      <Badge className={`${getRarityColor(reward.rarity)} text-xs`}>
                        {getRarityIcon(reward.rarity)}
                        {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-slate-300 text-sm">
                    {reward.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {reward.effect && (
                      <div className="bg-slate-600/50 p-2 rounded border border-green-500/30">
                        <div className="text-green-400 text-xs font-medium">Effect: {reward.effect}</div>
                      </div>
                    )}
                    
                    {reward.duration && (
                      <div className="flex items-center gap-2 text-slate-300 text-xs">
                        <Clock className="w-3 h-3" />
                        Duration: {reward.duration} days
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm">{reward.goldCost} Gold</span>
                      </div>
                    </div>
                    
                    {user.gold >= reward.goldCost ? (
                      <Progress value={100} className="h-2" />
                    ) : (
                      <div>
                        <Progress value={(user.gold / reward.goldCost) * 100} className="h-2 mb-1" />
                        <div className="text-xs text-slate-400">
                          {reward.goldCost - user.gold} more gold needed
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => redeemReward(reward)}
                      disabled={user.gold < reward.goldCost}
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600"
                    >
                      {user.gold >= reward.goldCost ? 'Claim Now' : 'Need More Gold'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Simplified for now - modal removed */}
    </div>
  );
};

export default GoldShopContent;