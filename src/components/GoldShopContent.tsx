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
import { useGoldShop } from '@/hooks/useGoldShopWrapper';
import { useRewards } from '@/hooks/useRewardsWrapper';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';

// Testing flag - set to true to disable redemptions for testing
const IS_TESTING_REWARDS = true;

const GoldShopContent = () => {
  const { toast } = useToast();
  const { items: shopItems, loading: shopLoading, purchaseItem } = useGoldShop();
  const { rewards, loading: rewardsLoading, unlockReward, redeemReward, createReward } = useRewards();
  const { balance, spendGold } = useUserBalance();
  
  const [customRewardName, setCustomRewardName] = useState('');
  const [customRewardCost, setCustomRewardCost] = useState('');
  const [customRewardType, setCustomRewardType] = useState<'Personal' | 'Company'>('Personal');
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Testing state for toggling reward status
  const [testingRewardStates, setTestingRewardStates] = useState<Record<string, string>>({});

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
        description: result.error || "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  // Testing function to toggle reward states
  const toggleTestingRewardState = (rewardId: string, currentStatus: string) => {
    const stateCycle = ['Locked', 'Unlocked', 'Redeemed'];
    const currentIndex = stateCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % stateCycle.length;
    const nextState = stateCycle[nextIndex];
    
    setTestingRewardStates(prev => ({
      ...prev,
      [rewardId]: nextState
    }));
    
    toast({
      title: "Testing State Changed",
      description: `Reward status changed to: ${nextState}`,
    });
  };

  const getTestingRewardStatus = (reward: any) => {
    return testingRewardStates[reward.reward_id] || reward.status;
  };

  const handleUnlockReward = async (reward: any) => {
    // Check testing flag
    if (IS_TESTING_REWARDS) {
      toast({
        title: "Testing Mode",
        description: "Reward redemption is disabled for testing",
        variant: "destructive"
      });
      return;
    }

    // Check if user has enough gold
    if (currentGold < reward.gold_cost) {
      toast({
        title: "Not Enough Gold",
        description: `You need ${reward.gold_cost - currentGold} more gold to unlock this reward.`,
        variant: "destructive"
      });
      return;
    }

    if (reward.status === 'Unlocked') {
      // Redeem the reward (no gold cost for redemption)
      const result = await redeemReward(reward.reward_id);
      if (result.success) {
        toast({
          title: "🎉 Reward Redeemed!",
          description: `Enjoy your ${reward.name}!`,
        });
      } else {
        toast({
          title: "Redemption Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } else {
      // Unlock the reward (costs gold)
      const goldSpent = await spendGold(reward.gold_cost);
      if (goldSpent) {
        const result = await unlockReward(reward.reward_id, reward.gold_cost);
        if (result.success) {
          toast({
            title: "🎉 Reward Unlocked!",
            description: `${reward.name} is now available to redeem!`,
          });
        } else {
          toast({
            title: "Unlock Failed",
            description: result.error || "Unknown error occurred",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Not Enough Gold",
          description: `You need ${reward.gold_cost} gold to unlock this reward.`,
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
            {personalRewards.length > 0 ? (
              personalRewards.map((reward) => (
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
                      <Badge className={getTestingRewardStatus(reward) === 'Redeemed' ? 'bg-green-600' : getTestingRewardStatus(reward) === 'Unlocked' ? 'bg-blue-600' : 'bg-slate-600'}>
                        {getTestingRewardStatus(reward)}
                      </Badge>
                    </div>
                    
                    {IS_TESTING_REWARDS ? (
                      <Button
                        onClick={() => toggleTestingRewardState(reward.reward_id, getTestingRewardStatus(reward))}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Toggle Status ({getTestingRewardStatus(reward)})
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUnlockReward(reward)}
                        disabled={
                          reward.status === 'Redeemed' || 
                          (reward.status === 'Locked' && currentGold < reward.gold_cost)
                        }
                        size="sm"
                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600"
                        title={
                          reward.status === 'Locked' && currentGold < reward.gold_cost ? 
                          "Not enough gold" : undefined
                        }
                      >
                        {reward.status === 'Redeemed' ? 'Completed' : 
                         reward.status === 'Unlocked' ? 'Redeem' : 
                         currentGold >= reward.gold_cost ? 'Unlock' : 
                         `Need ${reward.gold_cost - currentGold} more gold`}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Gift className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-50" />
                <p className="text-amber-400 font-medium text-lg mb-2">You don't have any rewards yet</p>
                <p className="text-amber-300 text-sm">Earn Gold to unlock exciting rewards here!</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* LifeQuest Rewards Tab */}
        <TabsContent value="lifequest-rewards" className="space-y-6">
          <h4 className="text-lg font-semibold text-purple-400">Exclusive LifeQuest Treasures</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifequestShopItems.map((item) => (
                <Card key={item.shop_item_id} className="bg-slate-700/50 border-slate-600/50 hover:border-purple-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-purple-400 text-base">{item.name}</CardTitle>
                      <Badge className="bg-purple-600 text-white text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-300 text-sm">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {item.effect_description && (
                        <div className="bg-slate-600/50 p-2 rounded border border-green-500/30">
                          <div className="text-green-400 text-xs font-medium">Effect: {item.effect_description}</div>
                        </div>
                      )}
                      
                      {item.duration_days && (
                        <div className="flex items-center gap-2 text-slate-300 text-xs">
                          <Clock className="w-3 h-3" />
                          Duration: {item.duration_days} days
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold text-sm">{item.gold_cost} Gold</span>
                        </div>
                      </div>
                      
                      {currentGold >= item.gold_cost ? (
                        <Progress value={100} className="h-2" />
                      ) : (
                        <div>
                          <Progress value={(currentGold / item.gold_cost) * 100} className="h-2 mb-1" />
                          <div className="text-xs text-slate-400">
                            {item.gold_cost - currentGold} more gold needed
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => handlePurchaseShopItem(item)}
                        disabled={currentGold < item.gold_cost}
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600"
                      >
                        {currentGold >= item.gold_cost ? 'Purchase Now' : 'Need More Gold'}
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