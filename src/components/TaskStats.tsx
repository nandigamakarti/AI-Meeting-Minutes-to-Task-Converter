
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { TaskStats as TaskStatsType } from '../types/task';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Calendar,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      label: 'Due Today',
      value: stats.dueToday,
      icon: Clock,
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gradient">Task Overview</h2>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {completionRate}%
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Completion Rate</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className={`text-center p-4 rounded-xl bg-gradient-to-br ${item.bgGradient} border border-white/50 dark:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 bg-gradient-to-r ${item.gradient} shadow-lg`}>
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold mb-1 text-slate-800 dark:text-slate-100">{item.value}</div>
            <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
