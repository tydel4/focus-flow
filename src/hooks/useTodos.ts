import { useState, useEffect } from 'react';
import { Todo, Priority } from '@/types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on initial mount
  useEffect(() => {
    const loadTodos = () => {
      try {
        const storedTodos = localStorage.getItem('todos');
        console.log('Loading todos from localStorage:', storedTodos);
        
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos).map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate + 'T00:00:00') : undefined,
            priority: todo.priority || 'none',
            categories: todo.categories || [],
          }));
          console.log('Parsed todos:', parsedTodos);
          setTodos(parsedTodos);
        }
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        localStorage.removeItem('todos');
      }
    };

    // Load todos immediately
    loadTodos();

    // Also load todos when the window gains focus (in case of multiple tabs)
    window.addEventListener('focus', loadTodos);
    return () => window.removeEventListener('focus', loadTodos);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    const saveTodos = () => {
      try {
        const todosToStore = todos.map(todo => ({
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : undefined,
          priority: todo.priority,
          categories: todo.categories,
        }));
        console.log('Saving todos to localStorage:', todosToStore);
        localStorage.setItem('todos', JSON.stringify(todosToStore));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    };

    saveTodos();
  }, [todos]);

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate.toISOString().split('T')[0] + 'T00:00:00') : undefined,
      priority: 'none',
      categories: [],
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, text: string | Partial<Todo>) => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.map(todo => {
        if (todo.id === id) {
          if (typeof text === 'string') {
            return { ...todo, text };
          } else {
            return { ...todo, ...text };
          }
        }
        return todo;
      });
      saveTodos(newTodos);
      return newTodos;
    });
  };

  const editDate = (id: string, newDate: Date | undefined) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { 
          ...todo, 
          dueDate: newDate ? new Date(newDate.toISOString().split('T')[0] + 'T00:00:00') : undefined 
        } : todo
      )
    );
  };

  const editPriority = (id: string, priority: Priority) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const editCategories = (id: string, categories: string[]) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, categories } : todo
      )
    );
  };

  const reorderTodos = (activeId: string, overId: string) => {
    setTodos(prevTodos => {
      const activeIndex = prevTodos.findIndex((todo) => todo.id === activeId);
      const overIndex = prevTodos.findIndex((todo) => todo.id === overId);

      if (activeIndex !== overIndex) {
        const newTodos = [...prevTodos];
        const [removed] = newTodos.splice(activeIndex, 1);
        newTodos.splice(overIndex, 0, removed);
        return newTodos;
      }
      return prevTodos;
    });
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter((todo) => !todo.completed));
  };

  // Sort todos: by priority first, then by completion status
  const sortedTodos = [...todos].sort((a, b) => {
    // If both are completed or both are active, sort by priority
    if (a.completed === b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Put completed tasks at the bottom
    return a.completed ? 1 : -1;
  });

  return {
    todos: sortedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    editDate,
    editPriority,
    editCategories,
    reorderTodos,
    clearCompleted,
  };
} 