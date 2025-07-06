
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventorySystem from '@/components/InventorySystem';
import GoldShopContent from '@/components/GoldShopContent';
import { Coins } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const { user } = useUser();

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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            ⚔️ Inventory & Rewards
          </h1>
          <p className="text-xl text-slate-300">
            Equip your gear and claim your rewards
          </p>
        </div>

        {/* Gold Balance Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-yellow-400" />
              <div className="text-2xl font-bold text-yellow-400">{user.gold.toLocaleString()}</div>
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
      </div>
    </div>
  );
};

export default Inventory;
