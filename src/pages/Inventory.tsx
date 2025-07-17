import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventorySystem from '@/components/InventorySystem';
import GoldShopContent from '@/components/GoldShopContent';
import PageContentWrapper from '@/components/PageContentWrapper';
import { Coins } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useGuest } from '@/contexts/GuestContext';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const { user } = useUser();
  const { isGuestMode, guestUser } = useGuest();
  
  // Use guest data if in guest mode, otherwise use real user data
  const activeUser = isGuestMode ? guestUser : user;

  return (
    <PageContentWrapper>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))',
              textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
            }}>
          ⚔️ Inventory & Rewards
        </h1>
        <p className="text-xl text-slate-300" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
          Equip your gear and claim your rewards
        </p>
      </div>

      {/* Gold Balance Display */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Coins className="w-6 h-6 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">{activeUser.gold.toLocaleString()}</div>
            <div className="text-lg text-slate-300">Gold</div>
          </div>
        </div>
      </div>

      {/* Inventory Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700 mb-8">
          <TabsTrigger 
            value="inventory" 
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Inventory & Gear
          </TabsTrigger>
          <TabsTrigger 
            value="gold-shop" 
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
          >
            Gold Shop
          </TabsTrigger>
        </TabsList>

        <TabsContent key="inventory" value="inventory">
          <InventorySystem />
        </TabsContent>

        <TabsContent key="gold-shop" value="gold-shop">
          <GoldShopContent />
        </TabsContent>
      </Tabs>
    </PageContentWrapper>
  );
};

export default Inventory;