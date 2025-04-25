import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';

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
        }));
        console.log('Saving todos to localStorage:', todosToStore);
        localStorage.setItem('todos', JSON.stringify(todosToStore));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    };

    saveTodos();
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
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

  const editTodo = (id: string, newText: string) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
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

  // Sort todos: active tasks first, then completed tasks
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return 0;
    }
    return a.completed ? 1 : -1;
  });

  return {
    todos: sortedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
    clearCompleted,
  };
} 