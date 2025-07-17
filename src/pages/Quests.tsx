
import React, { useState } from 'react';
import QuestCategories from '@/components/QuestCategories';
import NewQuestModal from '@/components/NewQuestModal';
import FilterModal from '@/components/FilterModal';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useBackground } from '@/contexts/BackgroundContext';

const Quests = () => {
  const { toast } = useToast();
  const { backgroundImage } = useBackground();
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestType, setSelectedQuestType] = useState<string | undefined>(undefined);
  
  // Filter states
  const [filters, setFilters] = useState({
    priorityFilter: 'all',
    typeFilter: 'all',
    statusFilter: 'all',
    xpRange: [1000] as number[],
    goldRange: [0, 200] as number[],
    dueDateFilter: 'all'
  });

  const handleAddToFocus = (questId: string) => {
    // This function is now handled by QuestCategories component directly
    // No need for additional logic here since QuestCategories handles the real functionality
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priorityFilter: 'all',
      typeFilter: 'all',
      statusFilter: 'all',
      xpRange: [1000],
      goldRange: [0, 200],
      dueDateFilter: 'all'
    });
  };

  const handleOpenNewQuestModal = (questType?: string) => {
    setSelectedQuestType(questType);
    setIsNewQuestModalOpen(true);
  };

  const handleCloseNewQuestModal = () => {
    setIsNewQuestModalOpen(false);
    setSelectedQuestType(undefined);
  };
  return (
    <div className={`min-h-screen text-white relative z-10 ${!backgroundImage ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : ''}`}>
      {/* Fantasy background pattern - only show if no custom background */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-16 lg:py-16">{/* Increased top padding for logged-in view */}
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            🎯 Quests
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 px-4">
            Organize and manage your adventures
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 lg:mb-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 sm:p-6 border border-blue-600/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search quests..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white h-10 sm:h-auto"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFilterModalOpen(true)}
                  className="border-blue-600 text-blue-400 flex-1 sm:flex-none h-10 text-sm"
                >
                  <Filter className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button 
                  onClick={() => handleOpenNewQuestModal()}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none h-10 text-sm"
                >
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Quest</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quest Categories */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-400 mb-6 lg:mb-8 px-4">🗺️ Quest Categories</h2>
          <QuestCategories 
            onAddToFocus={handleAddToFocus} 
            searchQuery={searchQuery}
            filters={filters}
            onOpenNewQuestModal={handleOpenNewQuestModal}
            maxFocusQuests={5}
          />
        </div>


        {/* New Quest Modal */}
        <NewQuestModal
          isOpen={isNewQuestModalOpen}
          onClose={handleCloseNewQuestModal}
          defaultQuestType={selectedQuestType as any}
        />

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default Quests;
