
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Edit, Trash2, User, Clock, Check, X } from 'lucide-react';
import { Task } from '../types/task';
import { formatDueDate, isOverdue, isDueToday, isDueTomorrow } from '../utils/taskParser';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    name: task.name,
    assignee: task.assignee || '',
    priority: task.priority
  });

  const handleSave = () => {
    onUpdate(task.id, {
      name: editedTask.name,
      assignee: editedTask.assignee || undefined,
      priority: editedTask.priority,
      updatedAt: new Date()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({
      name: task.name,
      assignee: task.assignee || '',
      priority: task.priority
    });
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate(task.id, {
      completed: !task.completed,
      updatedAt: new Date()
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-priority-p1/10 text-priority-p1 border-priority-p1/20';
      case 'P2': return 'bg-priority-p2/10 text-priority-p2 border-priority-p2/20';
      case 'P3': return 'bg-priority-p3/10 text-priority-p3 border-priority-p3/20';
      case 'P4': return 'bg-priority-p4/10 text-priority-p4 border-priority-p4/20';
      default: return 'bg-priority-p4/10 text-priority-p4 border-priority-p4/20';
    }
  };

  const getDateStatus = () => {
    if (!task.dueDate) return null;
    
    if (isOverdue(task.dueDate) && !task.completed) {
      return 'overdue';
    } else if (isDueToday(task.dueDate)) {
      return 'today';
    } else if (isDueTomorrow(task.dueDate)) {
      return 'tomorrow';
    }
    return 'normal';
  };

  const dateStatus = getDateStatus();

  return (
    <div className={`
      group relative bg-card rounded-xl border border-border
      shadow-sm hover:shadow-lg transition-[transform,box-shadow] duration-300 ease-smooth
      hover:-translate-y-1 hover:border-primary/50


      ${dateStatus === 'overdue' ? 'ring-1 ring-priority-p1/30' : ''}
      ${dateStatus === 'today' ? 'ring-1 ring-priority-p2/30' : ''}
    `}>
            {/* Dimming overlay for completed tasks */}
      {task.completed && (
        <div className="absolute inset-0 z-0 rounded-xl bg-black/30 pointer-events-none" />
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">

            
            {isEditing ? (
              <Input
                value={editedTask.name}
                onChange={(e) => setEditedTask(prev => ({ ...prev, name: e.target.value }))}
                className="text-base font-medium"
                autoFocus
              />
            ) : (
              <h3 className={`text-base font-medium text-foreground ${task.completed ? 'line-through' : ''}`}>
                {task.name}
              </h3>
            )}
          </div>
          
          {/* Priority Badge */}
          {isEditing ? (
            <Select 
              value={editedTask.priority} 
              onValueChange={(value: 'P1' | 'P2' | 'P3' | 'P4') => 
                setEditedTask(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
                <SelectItem value="P3">P3</SelectItem>
                <SelectItem value="P4">P4</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Assignee */}
          {(task.assignee || isEditing) && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {isEditing ? (
                <Input
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Assignee name"
                  className="text-sm"
                />
              ) : (
                <span>Assigned to: {task.assignee}</span>
              )}
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-2 text-sm ${dateStatus === 'overdue' ? 'text-priority-p1' : dateStatus === 'today' ? 'text-priority-p2' : dateStatus === 'tomorrow' ? 'text-sky-500' : 'text-muted-foreground'}`}>
              <Clock className="h-4 w-4" />
              <span>Due: {formatDueDate(task.dueDate)}</span>
              {dateStatus === 'overdue' && !task.completed && (
                <span className="px-2 py-1 bg-priority-p1/10 text-priority-p1 rounded-full text-xs font-medium">
                  Overdue
                </span>
              )}
              {dateStatus === 'today' && (
                <span className="px-2 py-1 bg-priority-p2/10 text-priority-p2 rounded-full text-xs font-medium">
                  Due Today
                </span>
              )}
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created: {task.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
              
              {task.completed ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleComplete}
                  className="text-priority-p2 border-priority-p2/50 hover:bg-priority-p2/10"
                >
                  <X className="h-3 w-3 mr-1" />
                  Unmark
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={toggleComplete}
                  className="bg-success/10 text-success border border-success/20 hover:bg-success/20"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark as completed
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
