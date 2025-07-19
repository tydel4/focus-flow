import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, GripVertical, Calendar, MoreVertical, Tag, Flag, Pencil } from 'lucide-react';
import { Todo, Priority } from '@/types/todo';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onEditDate: (id: string, date: Date | undefined) => void;
  onEditPriority: (id: string, priority: Priority) => void;
  onEditCategories: (id: string, categories: string[]) => void;
}

const priorityColors = {
  high: 'text-red-500 border-red-500 data-[state=checked]:bg-red-500',
  medium: 'text-yellow-500 border-yellow-500 data-[state=checked]:bg-yellow-500',
  low: 'text-blue-500 border-blue-500 data-[state=checked]:bg-blue-500',
  none: 'text-muted-foreground border-muted-foreground data-[state=checked]:bg-muted-foreground',
};

const priorityLabels = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
  none: 'No Priority',
};

export function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onEditDate, 
  onEditPriority,
  onEditCategories 
}: TodoItemProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.dueDate ? format(todo.dueDate, 'yyyy-MM-dd') : '');
  const [editCategories, setEditCategories] = useState(todo.categories.join(', '));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const categoriesInputRef = useRef<HTMLInputElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  useEffect(() => {
    if (isEditingText && inputRef.current) {
      inputRef.current.focus();
    }
    if (isEditingDate && dateInputRef.current) {
      dateInputRef.current.focus();
    }
    if (isEditingCategories && categoriesInputRef.current) {
      categoriesInputRef.current.focus();
    }
  }, [isEditingText, isEditingDate, isEditingCategories]);

  const handleDoubleClick = () => {
    setIsEditingText(true);
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditDate(todo.id, editDate ? new Date(editDate) : undefined);
    setIsEditingDate(false);
  };

  const handleCategoriesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = editCategories
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0);
    onEditCategories(todo.id, categories);
    setIsEditingCategories(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditingText(false);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close dropdown and prevent focus
    setDropdownOpen(false);
    if (dropdownTriggerRef.current) {
      dropdownTriggerRef.current.blur();
    }
    
    // Immediately set edit mode
    setIsEditingText(true);
    
    // Focus the input after a brief moment
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditDate(todo.dueDate ? format(todo.dueDate, 'yyyy-MM-dd') : '');
      setEditCategories(todo.categories.join(', '));
      setIsEditingText(false);
      setIsEditingDate(false);
      setIsEditingCategories(false);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 border rounded-lg bg-background"
    >
      <div className="flex items-center space-x-4 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className={cn(
            "border-2",
            priorityColors[todo.priority]
          )}
        />
        <div className="flex-1">
          <div>
            <span
              onDoubleClick={() => setIsEditingText(true)}
              className={cn(
                'block break-all whitespace-normal',
                todo.completed ? 'line-through text-muted-foreground' : ''
              )}
            >
              {todo.text}
            </span>
            <div className="flex items-center gap-4 mt-1">
              {todo.dueDate && (
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {isEditingDate ? (
                    <form onSubmit={handleDateSubmit} className="flex gap-2">
                      <Input
                        type="date"
                        value={format(new Date(todo.dueDate), 'yyyy-MM-dd')}
                        onChange={(e) => onEditDate(todo.id, e.target.value ? new Date(e.target.value) : undefined)}
                        className="h-8"
                        autoFocus
                      />
                      <Button type="submit" size="sm">Save</Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingDate(false)}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <p 
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => setIsEditingDate(true)}
                    >
                      Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              )}
              {todo.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {todo.categories.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              ref={dropdownTriggerRef}
              variant="ghost" 
              size="icon"
              tabIndex={dropdownOpen ? 0 : -1}
              onFocus={(e) => {
                if (!dropdownOpen) {
                  e.target.blur();
                }
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRenameClick}>
              <Pencil className="w-4 h-4 mr-2" />
              Rename Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditingDate(true)}>
              <Calendar className="w-4 h-4 mr-2" />
              {todo.dueDate ? 'Edit Due Date' : 'Add Due Date'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditingCategories(true)}>
              <Tag className="w-4 h-4 mr-2" />
              {todo.categories.length > 0 ? 'Edit Categories' : 'Add Categories'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Flag className="w-4 h-4 mr-2" />
                <span>Priority</span>
                <span className={cn(
                  'ml-2 w-2 h-2 rounded-full',
                  priorityColors[todo.priority].split(' ')[0]
                )} />
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onEditPriority(todo.id, 'high')}>
                  <span className={cn('w-2 h-2 rounded-full mr-2', priorityColors.high.split(' ')[0])} />
                  {priorityLabels.high}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditPriority(todo.id, 'medium')}>
                  <span className={cn('w-2 h-2 rounded-full mr-2', priorityColors.medium.split(' ')[0])} />
                  {priorityLabels.medium}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditPriority(todo.id, 'low')}>
                  <span className={cn('w-2 h-2 rounded-full mr-2', priorityColors.low.split(' ')[0])} />
                  {priorityLabels.low}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditPriority(todo.id, 'none')}>
                  <span className={cn('w-2 h-2 rounded-full mr-2', priorityColors.none.split(' ')[0])} />
                  {priorityLabels.none}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      </div>

      {/* Date Input Modal */}
      {isEditingDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {todo.dueDate ? 'Edit Due Date' : 'Add Due Date'}
            </h3>
            <form onSubmit={handleDateSubmit} className="flex flex-col gap-4">
              <Input
                ref={dateInputRef}
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="h-10"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingDate(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Input Modal */}
      {isEditingCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {todo.categories.length > 0 ? 'Edit Categories' : 'Add Categories'}
            </h3>
            <form onSubmit={handleCategoriesSubmit} className="flex flex-col gap-4">
              <Input
                ref={categoriesInputRef}
                value={editCategories}
                onChange={(e) => setEditCategories(e.target.value)}
                placeholder="Enter categories (comma separated)"
                className="h-10"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingCategories(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Text Edit Modal */}
      {isEditingText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
              <Input
                ref={inputRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingText(false);
                    setEditText(todo.text);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 