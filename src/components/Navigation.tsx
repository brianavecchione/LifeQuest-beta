
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, Trophy, Sword, Music, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    sessionStorage.clear();
    
    // Optional: API call to invalidate token on server
    try {
      // await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    // Add a small delay for smooth UX
    setTimeout(() => {
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
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <h1 className="text-xl font-bold text-amber-400">Quest Master</h1>
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
