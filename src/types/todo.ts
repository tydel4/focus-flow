export type Priority = 'high' | 'medium' | 'low' | 'none';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
  categories: string[];
  notificationSent?: boolean;
} 