import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../theme';

const THEME_KEY = '@todo_app_theme';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme !== null) {
        const isDarkMode = savedTheme === 'dark';
        setIsDark(isDarkMode);
        setTheme(isDarkMode ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme);
      await AsyncStorage.setItem(THEME_KEY, newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return { theme, isDark, toggleTheme };
};
