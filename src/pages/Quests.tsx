import React, { useState } from 'react';
import QuestCategories from '@/components/QuestCategories';
import NewQuestModal from '@/components/NewQuestModal';
import FilterModal from '@/components/FilterModal';
import PageContentWrapper from '@/components/PageContentWrapper';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Quests = () => {
  const { toast } = useToast();
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
    <PageContentWrapper>
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4"
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'
              }}>
            🎯 Quests
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 px-4" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
            Organize and manage your adventures
          </p>
        </div>
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
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 lg:mb-8 px-6 py-4 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl">Quest Categories</h2>
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
    </PageContentWrapper>
  );
};

export default Quests;