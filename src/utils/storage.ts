
import { Task } from '../types/task';

const TASKS_KEY = 'natural-language-tasks';
const SETTINGS_KEY = 'natural-language-settings';

export interface AppSettings {
  useAI: boolean;
  theme: 'light' | 'dark' | 'system';
  geminiApiKey?: string;
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function loadTasks(): Task[] {
  try {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    if (!tasksJson) return [];
    
    const tasks = JSON.parse(tasksJson);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

export function loadSettings(): AppSettings {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (!settingsJson) {
      return {
        useAI: false,
        theme: 'system'
      };
    }
    
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return {
      useAI: false,
      theme: 'system'
    };
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to clear data from localStorage:', error);
  }
}

export function exportTasks(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

export function importTasks(data: string): Task[] {
  try {
    const tasks = JSON.parse(data);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
  } catch (error) {
    console.error('Failed to import tasks:', error);
    throw new Error('Invalid task data format');
  }
}
