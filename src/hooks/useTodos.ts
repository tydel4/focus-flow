import { useState, useEffect } from 'react';
import { Todo, Priority } from '@/types/todo';

const STORAGE_KEY = 'focus-flow-todos';

// Helper function to generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to save todos to localStorage
const saveTodosToStorage = (todos: Todo[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

// Helper function to load todos from localStorage
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const todos = JSON.parse(stored);
      // Convert date strings back to Date objects
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    }
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
  }
  return [];
};

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load todos from localStorage on mount
    const storedTodos = loadTodosFromStorage();
    setTodos(storedTodos);
    setLoading(false);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveTodosToStorage(todos);
    }
  }, [todos, loading]);

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate,
      priority: 'none',
      categories: [],
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
  };

  const editDate = (id: string, date: Date | undefined) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, dueDate: date } : todo
      )
    );
  };

  const editPriority = (id: string, priority: Priority) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const editCategories = (id: string, categories: string[]) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, categories } : todo
      )
    );
  };

  const updateNotificationStatus = (id: string, notificationSent: boolean) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, notificationSent } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const reorderTodos = (activeId: string, overId: string) => {
    setTodos((prev) => {
      const activeIndex = prev.findIndex((todo) => todo.id === activeId);
      const overIndex = prev.findIndex((todo) => todo.id === overId);
      
      if (activeIndex === -1 || overIndex === -1) return prev;
      
      const newTodos = [...prev];
      const [movedTodo] = newTodos.splice(activeIndex, 1);
      newTodos.splice(overIndex, 0, movedTodo);
      
      return newTodos;
    });
  };

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    editDate,
    editPriority,
    editCategories,
    updateNotificationStatus,
    reorderTodos,
    clearCompleted,
  };
} 