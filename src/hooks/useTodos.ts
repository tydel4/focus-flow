import { useState, useEffect } from 'react';
import { Todo, Priority } from '@/types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string, dueDate?: Date) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          dueDate,
          priority: 'none',
          categories: [],
        }),
      });
      const newTodo = await response.json();
      setTodos((prev) => [newTodo, ...prev]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const editTodo = async (id: string, text: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          text,
        }),
      });
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Failed to edit todo:', error);
    }
  };

  const editDate = async (id: string, date: Date | undefined) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          dueDate: date,
        }),
      });
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Failed to edit date:', error);
    }
  };

  const editPriority = async (id: string, priority: Priority) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          priority,
        }),
      });
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Failed to edit priority:', error);
    }
  };

  const editCategories = async (id: string, categories: string[]) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          categories,
        }),
      });
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Failed to edit categories:', error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedIds = todos
        .filter((t) => t.completed)
        .map((t) => t.id);
      
      await Promise.all(
        completedIds.map((id) =>
          fetch(`/api/todos/${id}`, {
            method: 'DELETE',
          })
        )
      );
      
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (error) {
      console.error('Failed to clear completed:', error);
    }
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
    clearCompleted,
  };
} 