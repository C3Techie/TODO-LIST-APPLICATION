import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  Dimensions,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useTheme } from '../hooks/useTheme';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { TodoInput } from '../components/TodoInput';
import { TodoItem } from '../components/TodoItem';
import { FilterBar } from '../components/FilterBar';
import { FilterType, Todo } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');
  const { width } = useWindowDimensions();

  // Determine if mobile or desktop based on width
  // Mobile: < 768, Tablet: 768-1024, Laptop/Desktop: >= 1024
  const isMobile = width < 768;
  const contentWidth = isMobile ? Math.min(327, width - 48) : Math.min(540, width - 100);
  const headerImage = isMobile ? theme.headerBackgroundImageMobile : theme.headerBackgroundImage;

  // Convex queries and mutations
  const todos = useQuery(api.todos.getTodos) ?? [];
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  // Filter todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter((todo) => !todo.completed).length;

  const handleAddTodo = async (text: string) => {
    await createTodo({ text });
  };

  const handleToggleTodo = async (id: string) => {
    await toggleTodo({ id: id as any });
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo({ id: id as any });
  };

  const handleClearCompleted = async () => {
    await clearCompleted();
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with background image */}
        <ImageBackground
          source={headerImage}
          style={styles.header}
          resizeMode="cover"
        >
          <View style={[
            styles.headerContent, 
            { 
              width: contentWidth,
              alignSelf: 'center',
              marginTop: isMobile ? 48 : 70,
            }
          ]}>
            <Text style={[
              styles.title,
              {
                fontSize: isMobile ? 20 : 40,
              }
            ]} numberOfLines={1} adjustsFontSizeToFit={true}>TODO</Text>
            <ThemeSwitcher 
              theme={theme} 
              isDark={isDark} 
              onToggle={toggleTheme}
              size={isMobile ? 20 : 26}
            />
          </View>

          {/* Content container positioned within the background image */}
          <View style={[styles.contentContainer, { width: contentWidth, alignSelf: 'center' }]}>
            {/* Todo Input/Search - 40px below TODO */}
            <View style={{ marginTop: 40 }}>
              <TodoInput theme={theme} onAddTodo={handleAddTodo} isMobile={isMobile} />
            </View>

            {/* Todo List - 24px/16px below search */}
            <View style={[
              styles.todoListContainer, 
              { 
                backgroundColor: theme.cardBackground,
                marginTop: isMobile ? 16 : 24,
              }
            ]}>
              {/* Sample completed todo - static design element */}
              <View style={[
                styles.sampleTodoItem, 
                { 
                  backgroundColor: theme.cardBackground, 
                  borderBottomColor: theme.border,
                  height: isMobile ? 52 : 64,
                }
              ]}>
                <View style={styles.sampleContent}>
                  <View style={styles.sampleCheckbox}>
                    <LinearGradient
                      colors={['#55DDFF', '#C058F3']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sampleCheckboxCompleted}
                    >
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <Text style={[
                    styles.sampleText, 
                    { color: theme.textCompleted }
                  ]}>
                    Complete online JavaScript course
                  </Text>
                </View>
              </View>

              {/* Render todos directly without FlatList scrolling */}
              {filteredTodos.map((item) => (
                <TodoItem
                  key={item._id}
                  todo={item}
                  theme={theme}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  isMobile={isMobile}
                />
              ))}
              
              <FilterBar
                theme={theme}
                activeFilter={filter}
                itemsLeft={activeCount}
                onFilterChange={setFilter}
                onClearCompleted={handleClearCompleted}
                isMobile={isMobile}
              />
            </View>

            {/* Mobile-only separate filter bar */}
            {isMobile && (
              <View style={[
                styles.mobileFilterContainer,
                { 
                  backgroundColor: theme.cardBackground,
                  width: contentWidth,
                  height: 48,
                  marginTop: 16,
                }
              ]}>
                <View style={styles.mobileFilters}>
                  <Pressable onPress={() => setFilter('all')}>
                    <Text style={[
                      styles.filterText,
                      { color: filter === 'all' ? theme.filterActive : theme.filterInactive }
                    ]}>
                      All
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setFilter('active')}>
                    <Text style={[
                      styles.filterText,
                      { color: filter === 'active' ? theme.filterActive : theme.filterInactive }
                    ]}>
                      Active
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setFilter('completed')}>
                    <Text style={[
                      styles.filterText,
                      { color: filter === 'completed' ? theme.filterActive : theme.filterInactive }
                    ]}>
                      Completed
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>

        {/* Area below the image background with theme background color */}
        <View style={[styles.belowImageArea, { backgroundColor: theme.background }]}>
          {/* Drag and drop hint */}
          <Text style={[
            styles.hint, 
            { 
              color: '#9495A5',
              marginTop: isMobile ? 40 : 49,
              width: contentWidth,
              alignSelf: 'center',
            }
          ]}>
            Drag and drop to reorder list
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    minHeight: 300,
    width: '100%',
    paddingBottom: 60, // Add padding to extend the image area
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  title: {
    fontFamily: 'JosefinSans_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 15,
    lineHeight: 40,
    flex: 1,
    maxWidth: '80%',
  },
  contentContainer: {
    paddingBottom: 0,
  },
  todoListContainer: {
    borderRadius: 5,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.1)' } as any
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
        }
    ),
    overflow: 'hidden',
  },
  belowImageArea: {
    minHeight: 200,
    paddingBottom: 60,
  },
  mobileFilterContainer: {
    borderRadius: 5,
    alignSelf: 'center',
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.1)' } as any
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
        }
    ),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileFilters: {
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: 'JosefinSans_700Bold',
    fontSize: 14,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.19,
  },
  sampleTodoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sampleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sampleCheckbox: {
    marginRight: 12,
  },
  sampleCheckboxCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sampleText: {
    fontSize: 18,
    flex: 1,
    fontFamily: 'JosefinSans_400Regular',
    letterSpacing: -0.25,
    textDecorationLine: 'line-through',
  },
});
