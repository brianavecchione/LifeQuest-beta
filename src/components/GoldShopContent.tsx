import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Gift, Plus, Clock, Star, Crown, Gem, Sparkles, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useGoldShop } from '@/hooks/useGoldShopWrapper';
import { useRewards } from '@/hooks/useRewardsWrapper';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';

// Testing flag - set to true to enable testing features (unredeem button)
const IS_TESTING_REWARDS = true;

const GoldShopContent = () => {
  const { toast } = useToast();
  const { items: shopItems, loading: shopLoading, purchaseItem } = useGoldShop();
  const { rewards, loading: rewardsLoading, unlockReward, redeemReward, unredeemReward, createReward } = useRewards();
  const { balance, spendGold, refetch: refetchBalance } = useUserBalance();
  
  const [customRewardName, setCustomRewardName] = useState('');
  const [customRewardCost, setCustomRewardCost] = useState('');
  const [customRewardType, setCustomRewardType] = useState<'Personal' | 'Company'>('Personal');
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Testing state for toggling reward status
  const [testingRewardStates, setTestingRewardStates] = useState<Record<string, string>>({});

  const currentGold = balance?.current_gold_balance || 0;
  
  // Debug logging for progress bar issues
  console.log('🏆 GoldShopContent Debug:', {
    currentGold,
    balance: balance?.current_gold_balance,
    balanceObject: balance,
    typeof_currentGold: typeof currentGold
  });
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
    // For testing purposes only - shows testing state overlay
    // But actual database operations should use reward.status
    return IS_TESTING_REWARDS ? (testingRewardStates[reward.reward_id] || reward.status) : reward.status;
  };

  const handleUnlockReward = async (reward: any) => {
    const hasEnoughGold = currentGold >= reward.gold_cost;
    
    if (!hasEnoughGold) {
      toast({
        title: "Not Enough Gold",
        description: `You need ${reward.gold_cost - currentGold} more gold to unlock this reward.`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Unlock process - deduct gold and move from Locked to Unlocked
      const result = await unlockReward(reward.reward_id, reward.gold_cost);
      
      if (!result.success) {
        toast({
          title: "Unlock Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
        return;
      }

      await refetchBalance();
      
      toast({
        title: "🎉 Reward Unlocked!",
        description: `${reward.name} is now available to redeem!`,
      });
    } catch (error) {
      console.error('Error unlocking reward:', error);
      toast({
        title: "Error",
        description: "Failed to unlock reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRedeemReward = async (reward: any) => {
    try {
      // Redeem process - move from Unlocked to Redeemed without deducting gold
      const result = await redeemReward(reward.reward_id);
      
      if (!result.success) {
        toast({
          title: "Redeem Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "🎉 Reward Redeemed!",
        description: `Enjoy your ${reward.name}!`,
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnredeemReward = async (reward: any) => {
    const result = await unredeemReward(reward.reward_id);
    if (result.success) {
      // Refresh balance to show refunded gold amount
      await refetchBalance();
      toast({
        title: "🔄 Reward Unredeemed!",
        description: `${reward.name} has been unredeemed. ${reward.gold_cost} gold refunded.`,
      });
    } else {
      toast({
        title: "Unredeem Failed",
        description: result.error || "Unknown error occurred",
        variant: "destructive"
      });
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
  // Only show locked rewards in Gold Shop - unlocked rewards move to inventory
  const personalRewards = rewards.filter(reward => reward.reward_type === 'Personal' && reward.status === 'Locked');
  const companyRewards = rewards.filter(reward => reward.reward_type === 'Company' && reward.status === 'Locked');

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
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-amber-400 flex items-center gap-2 text-base">
                          <Gift className="w-4 h-4" />
                          {reward.name}
                        </CardTitle>
                        <CardDescription className="text-slate-300 text-sm">
                          {reward.description}
                        </CardDescription>
                      </div>
                      
                      {/* Three-dot dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          {reward.status === 'Redeemed' && (
                            <DropdownMenuItem 
                              onClick={() => handleUnredeemReward(reward)}
                              className="text-orange-400 hover:bg-slate-700 cursor-pointer"
                            >
                              Unredeem
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                    
                    {/* Gold Progress Bar - Same as LifeQuest rewards */}
                      {(() => {
                        const userGold = Number(currentGold) || 0;
                        const rewardCost = Number(reward.gold_cost) || 1;
                        const progressPercent = Math.min(100, Math.max(0, (userGold / rewardCost) * 100));
                        const hasEnoughGold = userGold >= rewardCost;
                        
                        console.log('🔄 Progress Bar Debug:', {
                          rewardName: reward.name,
                          userGold,
                          rewardCost,
                          progressPercent,
                          hasEnoughGold
                        });
                      
                      return (
                        <div className="mb-3">
                          <Progress value={hasEnoughGold ? 100 : progressPercent} className="h-2 mb-1" />
                          {!hasEnoughGold && (
                            <div className="text-xs text-slate-400">
                              {rewardCost - userGold} more gold needed
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    
                     {(() => {
                      const hasEnoughGold = currentGold >= reward.gold_cost;
                      
                      // Determine button text, action, and state based on reward status
                      let buttonText = '';
                      let onClick = () => {};
                      let isDisabled = false;
                      let buttonClass = 'w-full bg-amber-600 hover:bg-amber-700';
                      
                      if (reward.status === 'Redeemed') {
                        buttonText = 'Redeemed';
                        isDisabled = true;
                        buttonClass = 'w-full bg-green-600/50 cursor-not-allowed';
                      } else if (reward.status === 'Unlocked') {
                        buttonText = 'Redeem';
                        onClick = () => handleRedeemReward(reward);
                        isDisabled = false;
                        buttonClass = 'w-full bg-blue-600 hover:bg-blue-700';
                      } else { // status === 'Locked'
                        if (hasEnoughGold) {
                          buttonText = 'Unlock';
                          onClick = () => handleUnlockReward(reward);
                          isDisabled = false;
                        } else {
                          buttonText = 'Need More Gold';
                          isDisabled = true;
                          buttonClass = 'w-full bg-slate-600 cursor-not-allowed';
                        }
                      }
                      
                      return (
                        <Button
                          onClick={onClick}
                          disabled={isDisabled}
                          size="sm"
                          className={buttonClass}
                        >
                          {buttonText}
                        </Button>
                      );
                    })()}
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
          
          {/* Work in Progress Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-300 text-sm leading-relaxed">
                  We're still building this feature! For now, here's a preview of the exclusive LifeQuest rewards you'll be able to unlock soon.
                </p>
              </div>
            </div>
          </div>
          
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
                      
                      {(() => {
                        const userGold = Number(currentGold) || 0;
                        const itemCost = Number(item.gold_cost) || 1;
                        const progressPercent = Math.min(100, Math.max(0, (userGold / itemCost) * 100));
                        const hasEnoughGold = userGold >= itemCost;
                        
                        console.log('🔄 LifeQuest Progress Bar Debug:', {
                          itemName: item.name,
                          userGold,
                          itemCost,
                          progressPercent,
                          hasEnoughGold
                        });
                        
                        return (
                          <div className="mb-3">
                            <Progress value={hasEnoughGold ? 100 : progressPercent} className="h-2 mb-1" />
                            {!hasEnoughGold && (
                              <div className="text-xs text-slate-400">
                                {itemCost - userGold} more gold needed
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      
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