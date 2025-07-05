
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, Trophy, Sword, Music, Settings, Users, LogOut, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useUser();

  // Hide navigation on login and other auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';
  
  if (isAuthPage) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    localStorage.removeItem('lifequest-user'); // Clear user data
    sessionStorage.clear();
    
    // Optional: API call to invalidate token on server
    try {
      // await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    // Add a small delay for smooth UX
    setTimeout(() => {
      setIsLoggingOut(false);
      navigate('/login');
    }, 300);
  };
  
  const navItems = [
    { path: '/', label: 'Today', icon: Home },
    { path: '/quests', label: 'Quests', icon: Target },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/inventory', label: 'Inventory', icon: Sword },
    { path: '/parties', label: 'Parties', icon: Users },
    { path: '/soundtrack', label: 'Atmosphere', icon: Music },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <span className="text-2xl">⚔️</span>
            <h1 className="text-xl font-bold text-amber-400">LifeQuest</h1>
            
            {/* User Stats */}
            <div className="hidden lg:flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg border border-amber-500/30">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{user.gold.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">Gold</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg border border-blue-500/30">
                <span className="text-blue-400 font-bold">Lv.{user.level}</span>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-blue-400 font-bold">{user.totalXp} XP</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-amber-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Log Out Button */}
            <div className="ml-4 pl-4 border-l border-slate-700">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLoggingOut 
                    ? 'bg-slate-600 text-slate-400 opacity-50' 
                    : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
                }`}
              >
                <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">
                  {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
