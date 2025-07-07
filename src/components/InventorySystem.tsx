
import React, { useState } from 'react';
import { Sword, Shield, Crown, Gem, Package, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const InventorySystem = () => {
  const { user: authUser } = useAuth();
  const { items, loading, equipItem } = useInventory();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<'equipped' | 'inventory'>('equipped');

  // Check if this is the dummy account
  const isDummyAccount = authUser?.email === 'contact@lifequest.com';

  // Old static data for dummy account
  const oldEquippedItems = {
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

  const oldInventoryItems = [
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

  const oldPets = [
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

  const getCategoryIcon = (category: string) => {
    return category === 'Companion' ? '🐾' : '⚔️';
  };

  const handleEquip = async (itemId: string, currentlyEquipped: boolean) => {
    await equipItem(itemId, !currentlyEquipped);
    toast({
      title: currentlyEquipped ? "Item Unequipped" : "Item Equipped",
      description: currentlyEquipped ? "Item removed from active gear" : "Item is now active",
    });
  };

  // EXPLICIT CHECK: Only render old layout for the exact dummy account email
  if (authUser && authUser.email && authUser.email === 'contact@lifequest.com') {
    console.log('Rendering OLD LAYOUT for dummy account:', authUser.email); // Debug log
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
            {/* EXACT OLD LAYOUT: Currently Equipped */}
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">Currently Equipped</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-slate-700/50 rounded-lg p-6 border border-blue-500/30 shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">⚔️</div>
                    <h5 className="text-white font-bold text-base mb-2">Sword of Productivity</h5>
                    <Badge className="bg-blue-600 text-white mb-3 text-xs px-2 py-1">
                      Rare
                    </Badge>
                    <p className="text-slate-300 text-sm leading-relaxed">+10% XP from Main Quests</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-6 border border-blue-500/30 shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏺</div>
                    <h5 className="text-white font-bold text-base mb-2">Cloak of Focus</h5>
                    <Badge className="bg-purple-600 text-white mb-3 text-xs px-2 py-1">
                      Epic
                    </Badge>
                    <p className="text-slate-300 text-sm leading-relaxed">+5 minutes to quest timer</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-6 border border-blue-500/30 shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-3">💍</div>
                    <h5 className="text-white font-bold text-base mb-2">Ring of Motivation</h5>
                    <Badge className="bg-slate-600 text-white mb-3 text-xs px-2 py-1">
                      Common
                    </Badge>
                    <p className="text-slate-300 text-sm leading-relaxed">+5% daily XP boost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* EXACT OLD LAYOUT: Companion */}
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">Companion</h4>
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-700/50 rounded-lg p-6 border border-orange-500/30 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🔥</div>
                    <div>
                      <h5 className="text-white font-bold text-base mb-1">Phoenix Companion</h5>
                      <Badge className="bg-orange-600 text-white text-xs px-2 py-1 mb-2">
                        Legendary
                      </Badge>
                      <p className="text-slate-300 text-sm leading-relaxed">Revives failed daily streaks once per week</p>
                    </div>
                  </div>
                </div>
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
                {oldInventoryItems.map((item, index) => (
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
                {oldPets.filter(pet => !pet.active).map((pet, index) => (
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
  }

  // For all other accounts, show the new database-driven layout
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-600/30 shadow-2xl">
        <div className="text-center text-slate-300">Loading inventory...</div>
      </div>
    );
  }

  const equippedItems = items.filter(item => item.equipped);
  const unequippedItems = items.filter(item => !item.equipped);
  const gearItems = unequippedItems.filter(item => item.category === 'Gear');
  const companionItems = unequippedItems.filter(item => item.category === 'Companion');

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
            <h4 className="text-lg font-semibold text-blue-300 mb-4">Currently Equipped ({equippedItems.length})</h4>
            {equippedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equippedItems.map((item) => (
                  <div key={item.item_id} className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getCategoryIcon(item.category)}</div>
                      <h5 className="text-white font-bold mb-1">{item.name}</h5>
                      <Badge className={`${getRarityColor(item.rarity)} text-white mb-2`}>
                        {item.rarity}
                      </Badge>
                      <p className="text-slate-300 text-xs mb-2">{item.effect_description || item.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEquip(item.item_id, true)}
                        className="text-xs"
                      >
                        Unequip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Your inventory is empty</p>
                <p className="text-sm">Complete quests or visit the Gold Shop to collect gear!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === 'inventory' && (
        <div className="space-y-6">
          {/* Available Gear */}
          {gearItems.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">Available Gear ({gearItems.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gearItems.map((item) => (
                  <div key={item.item_id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">⚔️</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-white font-bold">{item.name}</h5>
                          <Badge className={`${getRarityColor(item.rarity)} text-white text-xs`}>
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-xs mb-2">{item.effect_description || item.description}</p>
                        {item.duration_days && (
                          <p className="text-slate-400 text-xs mb-2">Duration: {item.duration_days} days</p>
                        )}
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEquip(item.item_id, false)}
                        >
                          Equip
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Companions */}
          {companionItems.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">Available Companions ({companionItems.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companionItems.map((item) => (
                  <div key={item.item_id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-orange-500/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl opacity-75">🐾</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-white font-bold">{item.name}</h5>
                          <Badge className={`${getRarityColor(item.rarity)} text-white text-xs`}>
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-xs mb-2">{item.effect_description || item.description}</p>
                        {item.duration_days && (
                          <p className="text-slate-400 text-xs mb-2">Duration: {item.duration_days} days</p>
                        )}
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => handleEquip(item.item_id, false)}
                        >
                          Summon
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {unequippedItems.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your inventory is empty</p>
              <p className="text-sm">Complete quests to earn gear and companions!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventorySystem;
