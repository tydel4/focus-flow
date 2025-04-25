import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Todo } from '@/types/todo';
import { format } from 'date-fns';

type Notification = {
  id: string;
  message: string;
  todoId: string;
  timestamp: Date;
};

interface NotificationProps {
  todos: Todo[];
  onClearNotification: (id: string) => void;
}

export function Notification({ todos, onClearNotification }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkDueDates = () => {
      const now = new Date();
      const newNotifications: Notification[] = [];

      todos.forEach(todo => {
        if (todo.dueDate && !todo.completed) {
          const dueDate = new Date(todo.dueDate);
          const timeUntilDue = dueDate.getTime() - now.getTime();
          const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

          // Notify if due within 24 hours and not completed
          if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
            newNotifications.push({
              id: `due-${todo.id}`,
              message: `"${todo.text}" is due in ${Math.ceil(hoursUntilDue)} hours`,
              todoId: todo.id,
              timestamp: now,
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        setUnreadCount(prev => prev + newNotifications.length);
      }
    };

    // Check every minute
    const interval = setInterval(checkDueDates, 60000);
    checkDueDates(); // Initial check

    return () => clearInterval(interval);
  }, [todos]);

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
    onClearNotification(id);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <span className="text-sm font-medium">Due Date Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-auto p-0 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No upcoming due dates
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex items-start gap-2 p-2"
            >
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {format(notification.timestamp, 'MMM d, h:mm a')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleClearNotification(notification.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 