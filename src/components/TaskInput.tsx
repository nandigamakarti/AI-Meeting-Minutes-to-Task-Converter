
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Sparkles, Zap } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { parseWithGemini } from '../utils/geminiApi';
import { ParsedTask } from '../types/task';

interface TaskInputProps {
  onTaskCreate: (task: ParsedTask) => void;
  useAI: boolean;
  onToggleAI: (useAI: boolean) => void;
}

export function TaskInput({ onTaskCreate, useAI, onToggleAI }: TaskInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<ParsedTask | null>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Real-time preview with basic parsing
    if (value.trim()) {
      const parsed = parseNaturalLanguage(value);
      setPreview(parsed);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      let parsedTask: ParsedTask;
      
      if (useAI) {
        try {
          const apiKey = import.meta.env.VITE_AI_API_KEY;
          if (!apiKey) {
            throw new Error('AI API key not found');
          }
          parsedTask = await parseWithGemini(input, apiKey);
        } catch (error) {
          console.error('AI parsing failed, falling back to basic parsing:', error);
          parsedTask = parseNaturalLanguage(input);
        }
      } else {
        parsedTask = parseNaturalLanguage(input);
      }
      
      onTaskCreate(parsedTask);
      setInput('');
      setPreview(null);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 p-4 rounded-2xl backdrop-blur-sm border border-indigo-200/50 dark:border-slate-600/50">
          <Switch
            id="ai-toggle"
            checked={useAI}
            onCheckedChange={onToggleAI}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
          />
          <Label htmlFor="ai-toggle" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            {useAI ? <Zap className="h-4 w-4 text-purple-500" /> : <Sparkles className="h-4 w-4 text-indigo-500" />}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {useAI ? 'AI Processing' : 'Smart Processing'}
            </span>
          </Label>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe your task naturally..."
          className="min-h-[120px] text-base bg-gradient-to-br from-white/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border-2 border-indigo-200/50 dark:border-slate-600/50 focus:border-gradient-to-r focus:from-indigo-400 focus:to-purple-400 rounded-2xl shadow-lg transition-all duration-300 resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          disabled={isLoading}
        />
        
        {/* Real-time Preview */}
        {preview && (
          <div className="absolute top-3 right-3 bg-gradient-to-br from-white/95 to-indigo-50/95 dark:from-slate-800/95 dark:to-slate-700/95 backdrop-blur-md rounded-xl p-3 border border-indigo-200/50 dark:border-slate-600/50 max-w-xs shadow-xl">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">Preview:</div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{preview.name}</div>
              {preview.assignee && (
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <span className="text-indigo-500">👤</span> {preview.assignee}
                </div>
              )}
              {preview.dueDate && (
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <span className="text-purple-500">📅</span> {preview.dueDate.toLocaleDateString()}
                </div>
              )}
              <div className={`text-xs px-3 py-1 rounded-full inline-block font-medium ${
                preview.priority === 'P1' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                preview.priority === 'P2' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                preview.priority === 'P3' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
              }`}>
                {preview.priority}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl shadow-lg hover:shadow-xl text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            {useAI ? 'Processing with AI...' : 'Creating Task...'}
          </>
        ) : (
          <>
            <Plus className="mr-3 h-5 w-5" />
            Add Task
          </>
        )}
      </Button>

      {/* Keyboard Hint */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300">Cmd+Enter</kbd> to add task
      </div>
    </div>
  );
}
