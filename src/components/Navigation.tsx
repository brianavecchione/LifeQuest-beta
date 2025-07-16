
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Trophy, Sword, Settings, Users, LogOut, Coins, Menu, X, Crown, Zap, User, Bell, Palette, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user: userContext, isLoading } = useUser();
  const { signOut } = useAuth();
  const { isGuestMode, disableGuestMode } = useGuest();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // Debug log for XP recalculation
  React.useEffect(() => {
    if (!isLoading && userContext) {
      console.log('📊 Navigation - Current user stats:', {
        level: userContext.level,
        xp: userContext.xp,
        totalXp: userContext.totalXp,
        gold: userContext.gold
      });
    }
  }, [userContext, isLoading]);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide navigation on auth page
  const isAuthPage = location.pathname === '/auth';
  
  if (isAuthPage) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    if (isGuestMode) {
      // Handle guest mode logout
      disableGuestMode();
      // Add small delay to ensure state is cleared
      setTimeout(() => {
        navigate('/auth', { replace: true });
        setIsLoggingOut(false);
      }, 250);
    } else {
      // Handle regular user logout
      await signOut();
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };
  
  const navItems = [
    { path: '/', label: 'Today', icon: Home },
    { path: '/quests', label: 'Quests', icon: Target },
    { path: '/challenges', label: 'Challenges', icon: Zap },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/inventory', label: 'Inventory', icon: Sword },
    { path: '/parties', label: 'Parties', icon: Users },
  ];

  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xl sm:text-2xl">⚔️</span>
            <h1 className="text-lg sm:text-xl font-bold text-amber-400">LifeQuest</h1>
            
            {/* User Stats - Hidden on smaller screens */}
            <div className="hidden xl:flex items-center gap-3 ml-6">
              {isLoading || !userContext.name ? (
                <>
                  <Skeleton className="h-6 w-16 bg-slate-700" />
                  <Skeleton className="h-6 w-12 bg-slate-700" />
                  <Skeleton className="h-6 w-14 bg-slate-700" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-slate-700/50 px-2 py-1 rounded-lg border border-amber-500/30">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{userContext.gold.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-700/50 px-2 py-1 rounded-lg border border-blue-500/30">
                    <Crown className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-bold text-sm">Lv.{userContext.level}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-700/50 px-2 py-1 rounded-lg border border-purple-500/30">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-bold text-sm">{userContext.totalXp} XP</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-amber-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Desktop Profile Dropdown */}
            <div className="ml-3 pl-3 border-l border-slate-700 relative" ref={profileDropdownRef}>
              <Button
                onClick={toggleProfileDropdown}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-600 hover:border-slate-500"
                aria-label="Profile menu"
              >
                <User className="w-4 h-4" />
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </button>
                    
                    <Link
                      to="/settings"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    
                    <Link
                      to="/customization"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <Palette className="w-4 h-4" />
                      <span>Customization</span>
                    </Link>
                    
                    <Link
                      to="/help"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & FAQ</span>
                    </Link>
                    
                    <div className="border-t border-slate-700 my-1"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        closeProfileDropdown();
                      }}
                      disabled={isLoggingOut}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                        isLoggingOut 
                          ? 'text-slate-500 cursor-not-allowed' 
                          : 'text-red-400 hover:bg-red-600/20 hover:text-red-300'
                      }`}
                    >
                      <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                      <span>{isLoggingOut ? 'Logging Out...' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button and Profile */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={toggleProfileDropdown}
              variant="ghost"
              size="sm"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-600 hover:border-slate-500"
              aria-label="Profile menu"
            >
              <User className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Profile Dropdown */}
        {isProfileDropdownOpen && (
          <div className="md:hidden absolute right-4 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
            <div className="py-1">
              <button
                onClick={closeProfileDropdown}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              
              <Link
                to="/settings"
                onClick={closeProfileDropdown}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              
                <Link
                  to="/customization"
                  onClick={closeProfileDropdown}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  <span>Customization</span>
                </Link>
                
                <Link
                  to="/help"
                  onClick={closeProfileDropdown}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & FAQ</span>
                </Link>
                
                <div className="border-t border-slate-700 my-1"></div>
              
              <button
                onClick={() => {
                  handleLogout();
                  closeProfileDropdown();
                }}
                disabled={isLoggingOut}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                  isLoggingOut 
                    ? 'text-slate-500 cursor-not-allowed' 
                    : 'text-red-400 hover:bg-red-600/20 hover:text-red-300'
                }`}
              >
                <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                <span>{isLoggingOut ? 'Logging Out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-800/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile User Stats */}
              <div className="flex items-center justify-center gap-3 py-3 mb-2 bg-slate-700/30 rounded-lg">
                {isLoading || !userContext.name ? (
                  <>
                    <Skeleton className="h-5 w-12 bg-slate-600" />
                    <Skeleton className="h-5 w-10 bg-slate-600" />
                    <Skeleton className="h-5 w-14 bg-slate-600" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-sm">{userContext.gold.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-bold text-sm">Lv.{userContext.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-bold text-sm">{userContext.totalXp} XP</span>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Navigation Links */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-amber-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Profile Menu */}
              <div className="pt-3 mt-3 border-t border-slate-700 space-y-1">
                <button
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                
                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                
                <Link
                  to="/customization"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Palette className="w-5 h-5" />
                  <span>Customization</span>
                </Link>
                
                <Link
                  to="/help"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>Help & FAQ</span>
                </Link>
                
                <Button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  disabled={isLoggingOut}
                  className={`w-full flex items-center justify-center gap-3 py-3 text-base font-medium transition-all duration-300 ${
                    isLoggingOut 
                      ? 'bg-slate-600 text-slate-400 opacity-50' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-spin' : ''}`} />
                  <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
