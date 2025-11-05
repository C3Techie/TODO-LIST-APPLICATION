import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Theme } from '../theme';
import { FilterType } from '../types';

interface FilterBarProps {
  theme: Theme;
  activeFilter: FilterType;
  itemsLeft: number;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
  isMobile?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  theme, 
  activeFilter, 
  itemsLeft,
  onFilterChange,
  onClearCompleted,
  isMobile = false,
}) => {
  const barHeight = 50;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, height: barHeight }]}>
      <Text style={[styles.itemsLeft, { color: theme.textSecondary }]}>
        {itemsLeft} items left
      </Text>
      
      {/* Desktop shows filters inline, mobile hides them */}
      {!isMobile && (
        <View style={styles.filters}>
          <Pressable onPress={() => onFilterChange('all')}>
            <Text style={[
              styles.filterText,
              { color: activeFilter === 'all' ? theme.filterActive : theme.filterInactive }
            ]}>
              All
            </Text>
          </Pressable>
          <Pressable onPress={() => onFilterChange('active')}>
            <Text style={[
              styles.filterText,
              { color: activeFilter === 'active' ? theme.filterActive : theme.filterInactive }
            ]}>
              Active
            </Text>
          </Pressable>
          <Pressable onPress={() => onFilterChange('completed')}>
            <Text style={[
              styles.filterText,
              { color: activeFilter === 'completed' ? theme.filterActive : theme.filterInactive }
            ]}>
              Completed
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={onClearCompleted}>
        <Text style={[styles.clearButton, { color: theme.textSecondary }]}>
          Clear Completed
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  itemsLeft: {
    fontSize: 14,
    fontFamily: 'JosefinSans_400Regular',
  },
  filters: {
    flexDirection: 'row',
    gap: 18,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'JosefinSans_700Bold',
  },
  clearButton: {
    fontSize: 14,
    fontFamily: 'JosefinSans_400Regular',
  },
});
