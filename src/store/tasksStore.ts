import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

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

      addTask: (task) =>
        set((state) => ({
          tasks: [task, ...state.tasks],
        })),

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updatedTask } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      clearTasks: () => set({ tasks: [] }),
    }),

    {
      name: 'tasks-storage', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
