
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventorySystem from '@/components/InventorySystem';
import Minigames from '@/components/Minigames';
import GoldShop from '@/pages/GoldShop';
import { useTheme } from '@/contexts/ThemeContext';

const Inventory = () => {
  const { isClassicFantasy } = useTheme();
  
  return (
    <div className={`min-h-screen text-white ${
      isClassicFantasy 
        ? 'fantasy-bg fantasy-text-primary' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      {/* Fantasy background pattern */}
      {!isClassicFantasy && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${
            isClassicFantasy 
              ? 'fantasy-accent' 
              : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent'
          }`}>
            ⚔️ Inventory & Rewards
          </h1>
          <p className={`text-xl ${
            isClassicFantasy ? 'fantasy-text-secondary' : 'text-slate-300'
          }`}>
            Equip your gear and claim your rewards
          </p>
        </div>

        {/* Inventory Tabs */}
        <Tabs defaultValue="inventory" className="w-full">
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

          <TabsContent value="inventory">
            <InventorySystem />
          </TabsContent>

          <TabsContent value="gold-shop">
            <GoldShop />
          </TabsContent>

          <TabsContent value="minigames">
            <Minigames />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
