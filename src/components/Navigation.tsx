
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Trophy, Sword, Settings, Users, LogOut, Coins, Menu, X, Crown, Zap, User, Bell, Palette, HelpCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { useUserBalance } from '@/hooks/useUserBalanceWrapper';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user: userContext, isLoading } = useUser();
  const { user, loading } = useAuth();
  const { signOut } = useAuth();
  const { isGuestMode, disableGuestMode, guestUser } = useGuest();
  const { balance } = useUserBalance();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // Use guest data if in guest mode, otherwise use real user data
  const activeUser = isGuestMode ? guestUser : userContext;
  const goldBalance = isGuestMode ? guestUser.gold : (balance?.current_gold_balance || 0);
  
  // Add logged-in class to body for proper padding
  useEffect(() => {
    if (!loading && (user || isGuestMode)) {
      document.body.classList.add('logged-in');
    } else {
      document.body.classList.remove('logged-in');
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('logged-in');
    };
  }, [user, loading, isGuestMode]);
  
  // Debug log for XP recalculation
  React.useEffect(() => {
    if (!isLoading && activeUser) {
      console.log('📊 Navigation - Current user stats:', {
        level: activeUser.level,
        xp: activeUser.xp,
        totalXp: activeUser.totalXp,
        gold: goldBalance
      });
    }
  }, [activeUser, isLoading, goldBalance]);

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

  // Show landing navbar for logged-out users and non-auth pages
  const isLoggedOut = !loading && !user && !isGuestMode;
  
  // Show landing navbar if user is not logged in (even on public pages like Help)
  if (isLoggedOut) {
    return <LandingNavbar />;
  }
  
  // Hide in-app navigation completely on auth page for logged-in users
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
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[calc(100vw-2rem)] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1F2C40]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
           style={{
             boxShadow: '0 8px 32px rgba(31, 44, 64, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
           }}>
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="/lovable-uploads/075724f8-fc61-40fb-8303-6a4588776d3a.png" 
              alt="LifeQuest Logo" 
              className="h-8 w-auto sm:h-10"
              style={{ objectFit: 'contain' }}
            />
            
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
                    <span className="text-yellow-400 font-bold text-sm">{goldBalance.toLocaleString()}</span>
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md' 
                      : 'text-[#F0F4FF] hover:text-amber-400 hover:scale-105'
                  }`}
                  style={isActive ? {} : { textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Support LifeQuest Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="ml-3 border-pink-500/50 bg-pink-600/20 text-pink-300 hover:bg-pink-600/30 hover:text-pink-200 transition-all duration-300"
              title="Help us build more features, fix bugs, and keep the quest alive."
            >
              <a href="https://coff.ee/lifequest" target="_blank" rel="noopener noreferrer">
                <Heart className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Support LifeQuest</span>
              </a>
            </Button>
            
            {/* Desktop Profile Dropdown */}
            <div className="ml-3 pl-3 border-l border-slate-700 relative" ref={profileDropdownRef}>
              <Button
                onClick={toggleProfileDropdown}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-[#F0F4FF] hover:text-amber-400 hover:bg-white/10 transition-all duration-300 rounded-full p-2"
                aria-label="Profile menu"
              >
                <User className="w-4 h-4" />
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1F2C40]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl z-50">
                  <div className="py-1">
                    <button
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                      style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </button>
                    
                    <Link
                      to="/settings"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                      style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    
                    <Link
                      to="/customization"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                      style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                    >
                      <Palette className="w-4 h-4" />
                      <span>Customization</span>
                    </Link>
                    
                    <Link
                      to="/help"
                      onClick={closeProfileDropdown}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                      style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
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
              className="p-2 text-[#F0F4FF] hover:text-amber-400 hover:bg-white/10 transition-all duration-300 rounded-full"
              aria-label="Profile menu"
            >
              <User className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#F0F4FF] hover:text-amber-400 hover:bg-white/10 transition-all duration-300 rounded-full"
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
          <div className="md:hidden absolute right-4 top-full mt-2 w-48 bg-[#1F2C40]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl z-50">
            <div className="py-1">
              <button
                onClick={closeProfileDropdown}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              
              <Link
                to="/settings"
                onClick={closeProfileDropdown}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              
                <Link
                  to="/customization"
                  onClick={closeProfileDropdown}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                >
                  <Palette className="w-4 h-4" />
                  <span>Customization</span>
                </Link>
                
                <Link
                  to="/help"
                  onClick={closeProfileDropdown}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 hover:bg-white/5"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
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
          <div className="md:hidden border-t border-white/10 bg-[#1F2C40]/95 backdrop-blur-md rounded-b-2xl">
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
                      <span className="text-yellow-400 font-bold text-sm">{goldBalance.toLocaleString()}</span>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md' 
                        : 'text-[#F0F4FF] hover:text-amber-400 hover:bg-white/5'
                    }`}
                    style={isActive ? {} : { textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
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
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-[#F0F4FF] hover:text-amber-400 hover:bg-white/5 transition-all duration-300"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                
                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-[#F0F4FF] hover:text-amber-400 hover:bg-white/5 transition-all duration-300"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                
                <Link
                  to="/customization"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-[#F0F4FF] hover:text-amber-400 hover:bg-white/5 transition-all duration-300"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                >
                  <Palette className="w-5 h-5" />
                  <span>Customization</span>
                </Link>
                
                <Link
                  to="/help"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-[#F0F4FF] hover:text-amber-400 hover:bg-white/5 transition-all duration-300"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
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
