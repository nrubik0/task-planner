import React, { useState } from 'react';
import { Text, Button, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { useTasksStore } from '../store/tasksStore';
import TaskPreview from '../components/TaskPreview';
import { parseTask } from '../utils/taskParser';
import TaskList from '../components/TaskList';
import { suggestions } from '../utils/suggestions';


export default function QuickAddScreen() {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [parsedTask, setParsedTask] = useState<any>(null);

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
    const task = parseTask(input);
    setParsedTask(task);
  };

  const handleSave = (task: any) => {
    addTask(task);
    setParsedTask(null);
    setInput('');
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

      {parsedTask && <TaskPreview parsedTask={parsedTask} onSave={handleSave} />}

      <TaskList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10 },
  suggestion: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  autocompleteContainer: { marginBottom: 10, },
});
