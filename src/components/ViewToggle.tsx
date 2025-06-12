
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface ViewToggleProps {
  isMobileView: boolean;
  onToggle: (isMobile: boolean) => void;
}

export function ViewToggle({ isMobileView, onToggle }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200/50 dark:border-slate-600/50">
      <Button
        variant={!isMobileView ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          !isMobileView 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">Desktop</span>
      </Button>
      <Button
        variant={isMobileView ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          isMobileView 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        <Smartphone className="h-4 w-4" />
        <span className="hidden sm:inline">Mobile</span>
      </Button>
    </div>
  );
}
