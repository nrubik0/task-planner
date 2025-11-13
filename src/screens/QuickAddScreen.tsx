import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import TaskList from '../components/TaskList';
import TaskPreview from '../components/TaskPreview';
import { Task, useTasksStore } from '../store/tasksStore';
import { suggestions } from '../utils/suggestions';
import { parseTask } from '../utils/taskParser';

export default function QuickAddScreen() {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [parsedTask, setParsedTask] = useState<Task | null>(null);

  const addTask = useTasksStore((s) => s.addTask);

  const handleInputChange = (text: string) => {
    setInput(text);
    const filtered = suggestions.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelectSuggestion = (value: string) => {
    setInput(value);
    setFilteredSuggestions([]);
  };

  const handleParse = () => {
    try {
      if (!input.trim()) {
        return;
      }
      const task = parseTask(input);
      setParsedTask(task);
    } catch (error) {
      console.error('Ошибка при парсинге задачи:', error);
    }
  };

  const handleSave = (task: Task) => {
    try {
      addTask(task);
      setParsedTask(null);
      setInput('');
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Быстрое добавление задачи</Text>

      <View style={styles.autocompleteContainer}>
        <Autocomplete
          data={filteredSuggestions}
          defaultValue={input}
          onChangeText={handleInputChange}
          placeholder="Например: созвон завтра в 10 !!!"
          flatListProps={{
            keyExtractor: (_, i) => i.toString(),
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                <Text style={styles.suggestion}>{item}</Text>
              </TouchableOpacity>
            ),
          }}
          inputContainerStyle={styles.inputContainer}
        />
      </View>

      <Button title="Распознать" onPress={handleParse} />

      {parsedTask && (
        <TaskPreview parsedTask={parsedTask} onSave={handleSave} />
      )}

      <TaskList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  suggestion: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  autocompleteContainer: { marginBottom: 10 },
});
