import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme';

interface TodoInputProps {
  theme: Theme;
  onAddTodo: (text: string) => void;
  isMobile?: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({ theme, onAddTodo, isMobile = false }) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.inputBackground,
        height: isMobile ? 48 : 64,
      }
    ]}>
      <Pressable style={styles.checkbox}>
        <View style={[styles.checkboxInner, { borderColor: theme.checkbox }]} />
      </Pressable>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Create a new todo..."
        placeholderTextColor={theme.textSecondary}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
        maxLength={50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'JosefinSans_400Regular',
    fontWeight: '400',
    letterSpacing: -0.25,
    width: 129,
    height: 18,
  },
});
