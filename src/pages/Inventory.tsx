
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventorySystem from '@/components/InventorySystem';
import Minigames from '@/components/Minigames';
import GoldShop from '@/pages/GoldShop';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  const handleTabChange = (value: string) => {
    console.log('Tab changing to:', value);
    setActiveTab(value);
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            ⚔️ Inventory & Rewards
          </h1>
          <p className="text-xl text-slate-300">
            Equip your gear and claim your rewards
          </p>
        </div>

        {/* Inventory Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700 mb-8">
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
            <TabsTrigger 
              value="minigames" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Minigames
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className={activeTab === 'inventory' ? 'block' : 'hidden'}>
            <InventorySystem />
          </TabsContent>

          <TabsContent value="gold-shop" className={activeTab === 'gold-shop' ? 'block' : 'hidden'}>
            <GoldShop />
          </TabsContent>

          <TabsContent value="minigames" className={activeTab === 'minigames' ? 'block' : 'hidden'}>
            <Minigames />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
