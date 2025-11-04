import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Task } from '../store/tasksStore';

interface Props {
  parsedTask: Task;
  onSave: (task: Task) => void;
}

export default function TaskPreview({ parsedTask, onSave }: Props) {
  const [editableTask, setEditableTask] = useState(parsedTask);

  const handleChange = (key: keyof Task, value: string) => {
    setEditableTask((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Предпросмотр задачи</Text>

      <TextInput
        style={styles.input}
        value={editableTask.title}
        onChangeText={(val) => handleChange('title', val)}
        placeholder="Название"
      />

      <TextInput
        style={styles.input}
        value={editableTask.date}
        onChangeText={(val) => handleChange('date', val)}
        placeholder="Дата"
      />

      <MaskInput
        style={styles.input}
        value={editableTask.time}
        onChangeText={(masked) => handleChange('time', masked)}
        placeholder="Время (ЧЧ:ММ)"
        mask={[/\d/, /\d/, ':', /\d/, /\d/]}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={editableTask.priority}
        onChangeText={(val) => handleChange('priority', val)}
        placeholder="Приоритет"
      />

      <Text style={styles.label}>Категория</Text>
      <Picker
        selectedValue={editableTask.category}
        onValueChange={(val) => handleChange('category', val)}
        style={styles.picker}
      >
        <Picker.Item label="Выберите категорию" value="" />
        <Picker.Item label="Работа" value="work" />
        <Picker.Item label="Учёба" value="study" />
        <Picker.Item label="Личное" value="personal" />
        <Picker.Item label="Здоровье" value="health" />
        <Picker.Item label="Финансы" value="finance" />
      </Picker>

      <Button title="Сохранить задачу" onPress={() => onSave(editableTask)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
});
