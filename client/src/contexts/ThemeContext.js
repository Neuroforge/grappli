import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('primary-black');

  // Belt to theme mapping
  const beltToTheme = {
    white: 'primary-white',
    blue: 'primary-blue',
    purple: 'primary-purple',
    brown: 'primary-brown',
    black: 'primary-black',
  };

  useEffect(() => {
    if (user && user.beltRank && user.beltRank.color) {
      const theme = beltToTheme[user.beltRank.color] || 'primary-black';
      setCurrentTheme(theme);

      // Apply theme to document body
      const body = document.body;
      body.className = body.className.replace(/theme-\w+/g, '');
      body.classList.add(`theme-${user.beltRank.color}`);
    } else {
      // Default to black theme for non-authenticated users
      setCurrentTheme('primary-black');
      const body = document.body;
      body.className = body.className.replace(/theme-\w+/g, '');
      body.classList.add('theme-black');
    }
  }, [user]);

  const getThemeClass = baseClass => {
    // Replace primary-* classes with the current theme
    return baseClass.replace(/primary-\d+/g, match => {
      return match.replace('primary-', `${currentTheme}-`);
    });
  };

  const value = {
    currentTheme,
    setCurrentTheme,
    getThemeClass,
    beltToTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
