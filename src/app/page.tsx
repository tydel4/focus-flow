'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTodos } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TodoItem } from '@/components/TodoItem';
import { ThemeToggle } from '@/components/theme-toggle';
import { Notification } from '@/components/Notification';
import { Trash2, Calendar, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type FilterType = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low' | 'none';
type DueDateFilter = 'all' | 'today' | 'upcoming' | 'overdue';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { 
    todos, 
    addTodo, 
    toggleTodo, 
    deleteTodo, 
    editTodo, 
    editDate, 
    editPriority,
    editCategories,
    updateNotificationStatus,
    reorderTodos, 
    clearCompleted 
  } = useTodos();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), dueDate ? new Date(dueDate) : undefined);
      setNewTodo('');
      setDueDate('');
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      reorderTodos(active.id, over.id);
    }
  };

  const hasCompletedTasks = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    // Status filter
    if (statusFilter === 'active' && todo.completed) return false;
    if (statusFilter === 'completed' && !todo.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

    // Due date filter
    if (dueDateFilter !== 'all' && todo.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (dueDateFilter) {
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'upcoming':
          return dueDate.getTime() > today.getTime();
        case 'overdue':
          return dueDate.getTime() < today.getTime();
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesText = todo.text.toLowerCase().includes(searchLower);
      const matchesCategories = todo.categories.some(category => 
        category.toLowerCase().includes(searchLower)
      );
      return matchesText || matchesCategories;
    }

    return true;
  });

  const handleClearNotification = (id: string) => {
    const todoId = id.split('-')[1];
    updateNotificationStatus(todoId, true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-poppins text-foreground">
            Focus Flow
          </h1>
          <div className="flex items-center gap-2">
            <Notification todos={todos} onClearNotification={handleClearNotification} />
            <ThemeToggle />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => {
                    const dateInput = document.getElementById('dueDate');
                    if (dateInput) dateInput.click();
                  }}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="hidden"
                />
                <Button 
                  type="submit"
                  disabled={!newTodo.trim()}
                  className={!newTodo.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <div className="flex items-center gap-2">
              {showSearch ? (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[200px]"
                    autoFocus
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Tasks</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <RadioGroup
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value as FilterType)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all">All Tasks</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active">Active Tasks</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="completed" id="completed" />
                          <Label htmlFor="completed">Completed Tasks</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <RadioGroup
                        value={priorityFilter}
                        onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="priority-all" />
                          <Label htmlFor="priority-all">All Priorities</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">High Priority</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium Priority</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low">Low Priority</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="none" />
                          <Label htmlFor="none">No Priority</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <RadioGroup
                        value={dueDateFilter}
                        onValueChange={(value) => setDueDateFilter(value as DueDateFilter)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="date-all" />
                          <Label htmlFor="date-all">All Dates</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="today" id="today" />
                          <Label htmlFor="today">Due Today</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="upcoming" id="upcoming" />
                          <Label htmlFor="upcoming">Upcoming</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="overdue" id="overdue" />
                          <Label htmlFor="overdue">Overdue</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todos.length === 0 ? (
                <p className="text-center text-muted-foreground">No tasks yet. Add one above!</p>
              ) : filteredTodos.length === 0 ? (
                <p className="text-center text-muted-foreground">No tasks match the current filters.</p>
              ) : (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredTodos.map((todo) => todo.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                        onEditDate={editDate}
                        onEditPriority={editPriority}
                        onEditCategories={editCategories}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
            disabled={!hasCompletedTasks}
            className={`text-red-500 hover:text-red-600 ${
              !hasCompletedTasks ? 'opacity-50 cursor-not-allowed' : ''}
            }`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Completed
          </Button>
        </div>
      </div>
    </main>
  );
} 