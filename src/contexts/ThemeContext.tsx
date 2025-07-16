import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark-mode' | 'light-mode';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get theme from localStorage or default to dark-mode
    const savedTheme = localStorage.getItem('lifequest-theme') as Theme;
    return savedTheme || 'dark-mode';
  });

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    console.log('Applying theme:', newTheme);
    
    if (newTheme === 'light-mode') {
      root.classList.remove('dark');
      console.log('Removed dark class');
    } else {
      root.classList.add('dark');
      console.log('Added dark class');
    }
    
    // Save to localStorage
    localStorage.setItem('lifequest-theme', newTheme);
    setThemeState(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};