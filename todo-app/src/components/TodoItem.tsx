import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  theme: Theme;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, theme, onToggle, onDelete, isMobile = false }) => {
  const checkboxSize = isMobile ? 20 : 24;
  const itemHeight = isMobile ? 52 : 64;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.cardBackground, 
        borderBottomColor: theme.border,
        height: itemHeight,
      }
    ]}>
      <Pressable 
        style={styles.content}
        onPress={() => onToggle(todo._id)}
      >
        <Pressable 
          style={styles.checkbox}
          onPress={() => onToggle(todo._id)}
        >
          {todo.completed ? (
            <LinearGradient
              colors={['#55DDFF', '#C058F3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.checkboxCompleted, { width: checkboxSize, height: checkboxSize, borderRadius: checkboxSize / 2 }]}
            >
              <Ionicons name="checkmark" size={checkboxSize * 0.6} color="#FFFFFF" />
            </LinearGradient>
          ) : (
            <View style={[styles.checkboxEmpty, { borderColor: theme.checkbox, width: checkboxSize, height: checkboxSize, borderRadius: checkboxSize / 2 }]} />
          )}
        </Pressable>
        <Text 
          style={[
            styles.text, 
            { color: todo.completed ? theme.textCompleted : theme.text },
            todo.completed && styles.textCompleted
          ]}
        >
          {todo.text}
        </Text>
      </Pressable>
      <Pressable 
        style={styles.deleteButton}
        onPress={() => onDelete(todo._id)}
      >
        <Ionicons name="close" size={18} color={theme.deleteButton} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxEmpty: {
    borderWidth: 1,
  },
  checkboxCompleted: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    flex: 1,
    fontFamily: 'JosefinSans_400Regular',
    letterSpacing: -0.25,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 4,
  },
});
