import { addDays, format, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTasksStore } from '../store/tasksStore';
import DraggableTask from './DraggableTask';

const hours = Array.from(
  { length: 25 },
  (_, i) => `${i.toString().padStart(2, '0')}:00`
);

// текущая неделя
const getCurrentWeek = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1, locale: ru });
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    return {
      dayName: format(date, 'EEEEEE', { locale: ru }),
      dateStr: format(date, 'd.MM'),
      isoDate: format(date, 'yyyy-MM-dd'),
    };
  });
};

const weekDays = getCurrentWeek();

// перекрытие задач
const checkOverlap = (task1: any, task2: any) => {
  const getMinutes = (time: string) => {
    const match = time.match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  };

  const start1 = getMinutes(task1.time);
  const end1 = start1 + (task1.duration || 60);
  const start2 = getMinutes(task2.time);
  const end2 = start2 + (task2.duration || 60);

  return start1 < end2 && start2 < end1;
};

// позиционирование перекрывающихся задач
const calculateTaskPosition = (tasks: any[], currentTask: any) => {
  const overlapping = tasks.filter(
    (t) => t.id !== currentTask.id && checkOverlap(t, currentTask)
  );

  if (overlapping.length === 0) {
    return { left: 4, right: 4, zIndex: 5 };
  }

  // сортировка
  const sorted = [...overlapping, currentTask].sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  const index = sorted.findIndex((t) => t.id === currentTask.id);
  const totalOverlapping = sorted.length;

  const availableWidth = 142;
  const taskWidth = availableWidth / totalOverlapping;
  const leftOffset = 4 + index * taskWidth;

  return {
    left: leftOffset,
    width: taskWidth - 2, 
    zIndex: 5 + index,
  };
};

export default function CalendarGrid() {
  const { tasks } = useTasksStore();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.fullCalendar}>
          <View style={styles.headerRow}>
            <View style={styles.timeColumnHeader}></View>
            {weekDays.map((day) => (
              <View key={day.isoDate} style={styles.dayHeader}>
                <Text style={styles.dayText}>{day.dayName}</Text>
                <Text style={styles.dateText}>{day.dateStr}</Text>
              </View>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              <View style={styles.timeColumn}>
                {hours.map((time) => (
                  <View key={time} style={styles.hourSlot}>
                    <Text style={styles.timeLabel}>{time}</Text>
                  </View>
                ))}
              </View>

              {weekDays.map((day) => {
                const dayTasks = tasks.filter((t) => t.date === day.isoDate);
                return (
                  <View key={day.isoDate} style={styles.dayColumn}>
                    {hours.map((_, hourIndex) => (
                      <View key={hourIndex} style={styles.hourSlot} />
                    ))}
                    {dayTasks.map((task) => {
                      const timeMatch = task.time.match(/(\d{1,2}):(\d{2})/);
                      if (timeMatch) {
                        const hour = parseInt(timeMatch[1]);
                        const minute = parseInt(timeMatch[2]);
                        const topPosition = (hour * 60 + minute) * (80 / 60);
                        let duration = task.duration || 60; 

                        // высота
                        const minHeight = 40;
                        const taskHeight = Math.max(
                          duration * (80 / 60),
                          minHeight
                        );

                        // проверка
                        const maxHeight = 1920 - topPosition;
                        const finalHeight = Math.min(taskHeight, maxHeight);

                        const position = calculateTaskPosition(dayTasks, task);

                        return (
                          <View
                            key={task.id}
                            style={[
                              styles.taskAbsolute,
                              {
                                top: topPosition,
                                left: position.left,
                                width: position.width,
                                height: finalHeight,
                                zIndex: position.zIndex,
                              },
                            ]}
                          >
                            <DraggableTask task={task} onLongPress={() => {}} />
                          </View>
                        );
                      }
                      return null;
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullCalendar: { flexDirection: 'column' },
  headerRow: { flexDirection: 'row', backgroundColor: '#fff' },
  timeColumnHeader: { width: 70 },
  dayHeader: {
    width: 150,
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  dayText: { fontWeight: 'bold', fontSize: 15 },
  dateText: { fontSize: 12, color: '#666', marginTop: 2 },
  grid: { flexDirection: 'row' },
  timeColumn: {
    width: 70,
    borderRightWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  hourSlot: { height: 80, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  timeLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  dayColumn: {
    width: 150,
    borderLeftWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  taskAbsolute: {
    position: 'absolute',
    left: 4,
    right: 4,
    overflow: 'hidden',
    zIndex: 5,
  },
});
