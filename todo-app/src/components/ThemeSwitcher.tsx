import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme';

interface ThemeSwitcherProps {
  theme: Theme;
  isDark: boolean;
  onToggle: () => void;
  size?: number;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, isDark, onToggle, size = 24 }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <Ionicons 
        name={isDark ? 'sunny' : 'moon'} 
        size={size} 
        color="#FFFFFF" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
