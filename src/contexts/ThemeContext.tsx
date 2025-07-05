import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'default' | 'classic-fantasy';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isClassicFantasy: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('quest-dashboard-theme') as Theme;
    if (savedTheme && (savedTheme === 'default' || savedTheme === 'classic-fantasy')) {
      setThemeState(savedTheme);
      // Apply theme class to document root immediately
      if (savedTheme === 'classic-fantasy') {
        document.documentElement.classList.add('theme-classic-fantasy');
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('quest-dashboard-theme', newTheme);
    
    // Apply or remove theme class from document root
    if (newTheme === 'classic-fantasy') {
      document.documentElement.classList.add('theme-classic-fantasy');
    } else {
      document.documentElement.classList.remove('theme-classic-fantasy');
    }
  };

  const isClassicFantasy = theme === 'classic-fantasy';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isClassicFantasy }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};