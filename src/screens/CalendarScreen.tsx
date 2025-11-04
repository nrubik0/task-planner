import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CalendarGrid from '../components/CalendarGrid';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Календарь задач</Text>
      <CalendarGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
});
