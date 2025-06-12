
export interface Task {
  id: string;
  name: string;
  assignee?: string;
  dueDate?: Date;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  originalInput?: string;
}

export interface ParsedTask {
  name: string;
  assignee?: string;
  dueDate?: Date;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
}
