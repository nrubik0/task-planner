import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTasksStore } from '../store/tasksStore';

export default function TaskList() {
  const tasks = useTasksStore((s) => s.tasks);
  const deleteTask = useTasksStore((s) => s.deleteTask);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'work':
        return 'Работа';
      case 'study':
        return 'Учёба';
      case 'personal':
        return 'Личное';
      case 'health':
        return 'Здоровье';
      case 'finance':
        return 'Финансы';
      default:
        return 'Без категории';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Все задачи ({tasks.length})</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <View style={styles.task}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.date} {item.time} | {item.priority}
              </Text>
              <Text style={styles.category}>{getCategoryLabel(item.category || '')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  task: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },
  category: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
});
