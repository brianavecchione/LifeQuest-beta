import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-[rgba(31,44,64,0.95)] backdrop-blur-md border-b border-slate-700/50" : "bg-[rgba(31,44,64,0.9)] backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-90"
            >
              <img 
                src="/lovable-uploads/c7bd973b-7319-4787-b4a2-01ce9490c47c.png" 
                alt="LifeQuest Logo" 
                className="h-8 w-8"
              />
              <span 
                className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }}
              >
                LifeQuest
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#F0F4FF] hover:text-amber-400 transition-colors"
            >
              Features
            </button>
            <Link
              to="/help"
              className="text-[#F0F4FF] hover:text-amber-400 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/about"
              className="text-[#F0F4FF] hover:text-amber-400 transition-colors"
            >
              About
            </Link>
            <button
              onClick={() => scrollToSection('login')}
              className="text-[#F0F4FF] hover:text-amber-400 transition-colors"
            >
              Login
            </button>
            <Button
              onClick={() => scrollToSection('login')}
              variant="default"
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F0F4FF] hover:text-amber-400 hover:bg-slate-800/50 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-200 ease-in-out overflow-hidden",
        isOpen ? "max-h-64" : "max-h-0"
      )}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-[rgba(31,44,64,0.95)] backdrop-blur-md border-t border-slate-700/50">
          <button
            onClick={() => scrollToSection('features')}
            className="block px-3 py-2 w-full text-left rounded-md text-[#F0F4FF] hover:text-amber-400 hover:bg-slate-800/50"
          >
            Features
          </button>
          <Link
            to="/help"
            className="block px-3 py-2 rounded-md text-[#F0F4FF] hover:text-amber-400 hover:bg-slate-800/50"
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-[#F0F4FF] hover:text-amber-400 hover:bg-slate-800/50"
          >
            About
          </Link>
          <button
            onClick={() => scrollToSection('login')}
            className="block px-3 py-2 w-full text-left rounded-md text-[#F0F4FF] hover:text-amber-400 hover:bg-slate-800/50"
          >
            Login
          </button>
          <Button
            onClick={() => scrollToSection('login')}
            variant="default"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;