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
      isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-background/40 backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity"
            >
              <img 
                src="/favicon.ico" 
                alt="LifeQuest Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">LifeQuest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Features
            </button>
            <Link
              to="/help"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              About
            </Link>
            <button
              onClick={() => scrollToSection('login')}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Login
            </button>
            <Button
              onClick={() => scrollToSection('login')}
              variant="default"
              className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-background/50 focus:outline-none"
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
        <div className="px-4 pt-2 pb-3 space-y-1 bg-background/80 backdrop-blur-md">
          <button
            onClick={() => scrollToSection('features')}
            className="block px-3 py-2 w-full text-left rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10"
          >
            Features
          </button>
          <Link
            to="/help"
            className="block px-3 py-2 rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10"
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10"
          >
            About
          </Link>
          <button
            onClick={() => scrollToSection('login')}
            className="block px-3 py-2 w-full text-left rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10"
          >
            Login
          </button>
          <Button
            onClick={() => scrollToSection('login')}
            variant="default"
            className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;