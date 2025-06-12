
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Moon, Sun, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onClearAll: () => void;
}

export function Header({ 
  isDark, 
  onToggleTheme, 
  onClearAll
}: HeaderProps) {
  const { toast } = useToast();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      onClearAll();
      toast({
        title: "Data Cleared",
        description: "All tasks have been cleared.",
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 dark:from-slate-800/40 dark:via-slate-700/40 dark:to-slate-600/40 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Task Manager
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Clear All */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-3 bg-white/20 dark:bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm">
              <Sun className="h-4 w-4 text-orange-500" />
              <Switch
                checked={isDark}
                onCheckedChange={onToggleTheme}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
              />
              <Moon className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
