import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../store/tasksStore';

interface Props {
  task: Task;
  onLongPress: () => void;
}

export default function DraggableTask({ task, onLongPress }: Props) {
  const getColor = (category: string) => {
    switch (category) {
      case 'work':
        return '#FFD966';
      case 'study':
        return '#A4C2F4';
      case 'personal':
        return '#B6D7A8';
      case 'health':
        return '#EA9999';
      case 'finance':
        return '#C27BA0';
      default:
        return '#ccc';
    }
  };

  // обрезка названия задачи
  const truncateTitle = (title: string, maxWords: number = 4) => {
    const words = title.trim().split(/\s+/);
    if (words.length <= maxWords) {
      return title;
    }
    return words.slice(0, maxWords).join(' ') + ' ...';
  };

  return (
    <TouchableOpacity onLongPress={onLongPress}>
      <View style={[styles.task, { backgroundColor: getColor(task.category) }]}>
        <Text style={styles.title} numberOfLines={2}>
          {truncateTitle(task.title)}
        </Text>
        <Text style={styles.meta}>{task.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  task: {
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: { fontWeight: 'bold', fontSize: 13 },
  meta: { fontSize: 11, color: '#555' },
});
