
import React, { useState } from 'react';
import QuestCategories from '@/components/QuestCategories';
import NarrativeJournal from '@/components/NarrativeJournal';
import NewQuestModal from '@/components/NewQuestModal';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const Quests = () => {
  const { toast } = useToast();
  const { isClassicFantasy } = useTheme();
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);

  const handleAddToFocus = (questId: string) => {
    toast({
      title: "Added to Today's Focus!",
      description: "This quest will appear in your daily focus on the Today page.",
    });
  };

  const handleQuestCreated = (quest: any) => {
    console.log('New quest created:', quest);
    // This will be handled by individual components for now
  };
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
            🎯 Quests
          </h1>
          <p className={`text-xl ${
            isClassicFantasy ? 'fantasy-text-secondary' : 'text-slate-300'
          }`}>
            Organize and manage your adventures
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className={`rounded-xl p-6 border shadow-2xl ${
            isClassicFantasy 
              ? 'fantasy-card fantasy-border' 
              : 'bg-gradient-to-br from-slate-800 to-slate-900 border-blue-600/30'
          }`}>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search quests..." 
                  className={`pl-10 border text-white ${
                    isClassicFantasy 
                      ? 'bg-slate-800 fantasy-border fantasy-text-primary' 
                      : 'bg-slate-700 border-slate-600'
                  }`}
                />
              </div>
              <Button variant="outline" className="border-blue-600 text-blue-400">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button 
                onClick={() => setIsNewQuestModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Quest
              </Button>
            </div>
          </div>
        </div>

        {/* Quest Categories */}
        <div className="mb-12">
          <h2 className={`text-3xl font-bold text-center mb-8 ${
            isClassicFantasy ? 'fantasy-accent' : 'text-amber-400'
          }`}>🗺️ Quest Categories</h2>
          <QuestCategories onAddToFocus={handleAddToFocus} />
        </div>

        {/* Narrative Journal */}
        <div className="mb-12">
          <NarrativeJournal />
        </div>

        {/* New Quest Modal */}
        <NewQuestModal
          isOpen={isNewQuestModalOpen}
          onClose={() => setIsNewQuestModalOpen(false)}
          onQuestCreated={handleQuestCreated}
        />
      </div>
    </div>
  );
};

export default Quests;
