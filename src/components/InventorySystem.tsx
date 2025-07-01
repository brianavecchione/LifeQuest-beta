
import React, { useState } from 'react';
import { Sword, Shield, Crown, Gem, Package, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const InventorySystem = () => {
  const [currentTab, setCurrentTab] = useState<'equipped' | 'inventory'>('equipped');

  const equippedItems = {
    weapon: {
      name: 'Sword of Productivity',
      rarity: 'Rare',
      icon: '⚔️',
      description: '+10% XP from Main Quests',
      equipped: true
    },
    armor: {
      name: 'Cloak of Focus',
      rarity: 'Epic',
      icon: '🏺',
      description: '+5 minutes to quest timer',
      equipped: true
    },
    accessory: {
      name: 'Ring of Motivation',
      rarity: 'Common',
      icon: '💍',
      description: '+5% daily XP boost',
      equipped: true
    }
  };

  const inventoryItems = [
    {
      name: 'Crown of Leadership',
      rarity: 'Legendary',
      icon: '👑',
      description: 'Doubles XP from completed Main Quests',
      equipped: false,
      type: 'accessory'
    },
    {
      name: 'Shield of Perseverance',
      rarity: 'Epic',
      icon: '🛡️',
      description: 'Prevents XP loss from failed streaks',
      equipped: false,
      type: 'armor'
    },
    {
      name: 'Wand of Wisdom',
      rarity: 'Rare',
      icon: '🪄',
      description: '+20% XP from Side Quests',
      equipped: false,
      type: 'weapon'
    },
    {
      name: 'Boots of Speed',
      rarity: 'Common',
      icon: '👢',
      description: '-2 minutes from quest timer cooldown',
      equipped: false,
      type: 'armor'
    }
  ];

  const pets = [
    {
      name: 'Phoenix Companion',
      icon: '🔥',
      rarity: 'Legendary',
      description: 'Revives failed daily streaks once per week',
      active: true
    },
    {
      name: 'Wise Owl',
      icon: '🦉',
      rarity: 'Epic',
      description: 'Provides daily quest suggestions',
      active: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-slate-600';
      case 'Rare': return 'bg-blue-600';
      case 'Epic': return 'bg-purple-600';
      case 'Legendary': return 'bg-orange-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-600/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-blue-400">Inventory & Gear</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('equipped')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'equipped' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Sword className="w-4 h-4 mr-1 inline" />
            Equipped
          </button>
          <button
            onClick={() => setCurrentTab('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'inventory' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Package className="w-4 h-4 mr-1 inline" />
            Inventory
          </button>
        </div>
      </div>

      {currentTab === 'equipped' && (
        <div className="space-y-6">
          {/* Equipped Gear */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-4">Currently Equipped</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(equippedItems).map(([slot, item]) => (
                <div key={slot} className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h5 className="text-white font-bold mb-1">{item.name}</h5>
                    <Badge className={`${getRarityColor(item.rarity)} text-white mb-2`}>
                      {item.rarity}
                    </Badge>
                    <p className="text-slate-300 text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Pets */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-4">Companion</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.filter(pet => pet.active).map((pet, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-orange-500/30">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{pet.icon}</div>
                    <div>
                      <h5 className="text-white font-bold">{pet.name}</h5>
                      <Badge className={`${getRarityColor(pet.rarity)} text-white text-xs`}>
                        {pet.rarity}
                      </Badge>
                      <p className="text-slate-300 text-xs mt-1">{pet.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'inventory' && (
        <div className="space-y-6">
          {/* Available Gear */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-4">Available Gear</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventoryItems.map((item, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-white font-bold">{item.name}</h5>
                        <Badge className={`${getRarityColor(item.rarity)} text-white text-xs`}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-xs mb-2">{item.description}</p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Equip
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Pets */}
          <div>
            <h4 className="text-lg font-semibold text-blue-300 mb-4">Available Companions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.filter(pet => !pet.active).map((pet, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-orange-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-75">{pet.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-white font-bold">{pet.name}</h5>
                        <Badge className={`${getRarityColor(pet.rarity)} text-white text-xs`}>
                          {pet.rarity}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-xs mb-2">{pet.description}</p>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Summon
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySystem;
