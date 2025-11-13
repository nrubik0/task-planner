import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  duration?: number;
  priority: 'low' | 'normal' | 'medium' | 'high';
  category: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;
}

export const useTasksStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (task) => {
        try {
          set((state) => ({
            tasks: [task, ...state.tasks],
          }));
        } catch (error) {
          console.error('Ошибка при добавлении задачи:', error);
          throw error;
        }
      },

      updateTask: (id, updatedTask) => {
        try {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...updatedTask } : t
            ),
          }));
        } catch (error) {
          console.error('Ошибка при обновлении задачи:', error);
          throw error;
        }
      },

      deleteTask: (id) => {
        try {
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        } catch (error) {
          console.error('Ошибка при удалении задачи:', error);
          throw error;
        }
      },

      clearTasks: () => {
        try {
          set({ tasks: [] });
        } catch (error) {
          console.error('Ошибка при очистке задач:', error);
          throw error;
        }
      },
    }),

    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
