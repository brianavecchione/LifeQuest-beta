
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventorySystem from '@/components/InventorySystem';
import Minigames from '@/components/Minigames';
import GoldShop from '@/pages/GoldShop';

const Inventory = () => {
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
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700 mb-8 p-1 rounded-lg">
            <TabsTrigger 
              value="inventory" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
            >
              Inventory & Gear
            </TabsTrigger>
            <TabsTrigger 
              value="gold-shop" 
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
            >
              Gold Shop
            </TabsTrigger>
            <TabsTrigger 
              value="minigames" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md"
            >
              Minigames
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="focus-visible:outline-none">
            <InventorySystem />
          </TabsContent>

          <TabsContent value="gold-shop" className="focus-visible:outline-none">
            <GoldShop />
          </TabsContent>

          <TabsContent value="minigames" className="focus-visible:outline-none">
            <Minigames />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
