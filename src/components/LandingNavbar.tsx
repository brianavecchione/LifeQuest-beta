import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, useNavigate } from 'react-router-dom';

const LandingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Add a class to body for landing pages
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the landing page, navigate there first
    if (window.location.pathname !== '/auth') {
      navigate(`/auth#${sectionId}`);
      return;
    }
    
    // If we're on the landing page, smooth scroll with navbar offset
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate scroll position with navbar offset
      // Navbar is fixed top-4 (16px) with h-16 (64px), so total offset is 80px + extra space
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100; // 80px navbar + 20px extra space
      
      // Scroll to the position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    if (path.startsWith('#')) {
      scrollToSection(path.substring(1));
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl mx-auto px-4">
      <div 
        className="bg-[#1F2C40]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
        style={{
          boxShadow: '0 8px 32px rgba(31, 44, 64, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/075724f8-fc61-40fb-8303-6a4588776d3a.png" 
                alt="LifeQuest Logo" 
                className="h-10 w-auto"
                style={{ objectFit: 'contain' }}
              />
            </button>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavigation('#features')}
              className="text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 font-medium hover:scale-105"
              style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
            >
              Features
            </button>
            <Link
              to="/help"
              className="text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 font-medium hover:scale-105"
              style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
            >
              FAQ
            </Link>
            <Link
              to="/about"
              className="text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 font-medium hover:scale-105"
              style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
            >
              About
            </Link>
            <button
              onClick={() => handleNavigation('#login')}
              className="text-[#F0F4FF] hover:text-amber-400 transition-all duration-300 font-medium hover:scale-105"
              style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
            >
              Login
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => window.open('https://coff.ee/lifequest', '_blank')}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mr-2"
                    style={{
                      boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4), 0 0 0 1px rgba(236, 72, 153, 0.2)'
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Support LifeQuest
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help us build more features, fix bugs, and keep the quest alive.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              onClick={() => handleNavigation('#login')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium px-6 py-2 rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.2)'
              }}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#F0F4FF] hover:text-amber-400 hover:bg-white/10 rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#1F2C40]/95 backdrop-blur-md rounded-b-2xl">
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => handleNavigation('#features')}
                className="block w-full text-left text-[#F0F4FF] hover:text-amber-400 py-2 font-medium transition-colors"
              >
                Features
              </button>
              <Link
                to="/help"
                className="block w-full text-left text-[#F0F4FF] hover:text-amber-400 py-2 font-medium transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/about"
                className="block w-full text-left text-[#F0F4FF] hover:text-amber-400 py-2 font-medium transition-colors"
              >
                About
              </Link>
              <button
                onClick={() => handleNavigation('#login')}
                className="block w-full text-left text-[#F0F4FF] hover:text-amber-400 py-2 font-medium transition-colors"
              >
                Login
              </button>
              <Button
                onClick={() => window.open('https://coff.ee/lifequest', '_blank')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 rounded-full mt-2"
              >
                <Heart className="w-4 h-4 mr-2" />
                Support LifeQuest
              </Button>
              <Button
                onClick={() => handleNavigation('#login')}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium py-2 rounded-full mt-2"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;