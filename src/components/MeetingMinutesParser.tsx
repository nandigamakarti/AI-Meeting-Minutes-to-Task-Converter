
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Trash2, Plus, Mic, Sparkles, Zap } from 'lucide-react';
import { parseWithGemini } from '../utils/geminiApi';
import { parseMeetingTranscript } from '../utils/meetingParser';
import { ParsedTask } from '../types/task';

interface MeetingMinutesParserProps {
  onTasksCreate: (tasks: ParsedTask[]) => void;
  useAI: boolean;
  onToggleAI: (useAI: boolean) => void;
}

interface ParsedMeetingTask extends ParsedTask {
  confidence: 'high' | 'medium' | 'low';
  originalText: string;
}

export function MeetingMinutesParser({ onTasksCreate, useAI, onToggleAI }: MeetingMinutesParserProps) {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<ParsedMeetingTask[]>([]);

  const sampleTranscript = `Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight. John can you handle the database migration by Friday 2pm P1? Sarah please coordinate with the design team by next Monday P2.`;

  const handleParseMeeting = async () => {
    if (!transcript.trim()) return;
    
    setIsLoading(true);
    
    try {
      let tasks: ParsedMeetingTask[];
      
      if (useAI) {
        try {
          const apiKey = import.meta.env.VITE_AI_API_KEY;
          if (!apiKey) {
            throw new Error('AI API key not found');
          }
          tasks = await parseMeetingWithGemini(transcript, apiKey);
        } catch (error) {
          console.error('AI parsing failed, falling back to basic parsing:', error);
          tasks = parseMeetingTranscript(transcript);
        }
      } else {
        tasks = parseMeetingTranscript(transcript);
      }
      
      setParsedTasks(tasks);
    } catch (error) {
      console.error('Failed to parse meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllTasks = () => {
    const tasksToAdd = parsedTasks.map(({ confidence, originalText, ...task }) => task);
    onTasksCreate(tasksToAdd);
    setTranscript('');
    setParsedTasks([]);
  };

  const handleClear = () => {
    setTranscript('');
    setParsedTasks([]);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'P2': return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700';
      case 'P3': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'P4': return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700';
      default: return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full">
            <Mic className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          AI Meeting Minutes to Task Converter
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Transform meeting transcripts into actionable tasks
        </p>
      </div>

      {/* AI Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800/50 dark:to-slate-700/50 p-4 rounded-2xl backdrop-blur-sm border border-purple-200/50 dark:border-slate-600/50">
          <Switch
            id="ai-toggle-meeting"
            checked={useAI}
            onCheckedChange={onToggleAI}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
          />
          <Label htmlFor="ai-toggle-meeting" className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            {useAI ? <Zap className="h-4 w-4 text-purple-500" /> : <Sparkles className="h-4 w-4 text-pink-500" />}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {useAI ? 'AI Processing' : 'Basic Processing'}
            </span>
          </Label>
        </div>
      </div>

      {/* Sample Button */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTranscript(sampleTranscript)}
          className="text-purple-600 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-600 dark:hover:bg-purple-900/20"
        >
          <FileText className="h-4 w-4 mr-2" />
          Load Sample Transcript
        </Button>
      </div>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="min-h-[200px] text-base bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm border-2 border-purple-200/50 dark:border-slate-600/50 focus:border-gradient-to-r focus:from-purple-400 focus:to-pink-400 rounded-2xl shadow-lg transition-all duration-300 resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleParseMeeting}
          disabled={!transcript.trim() || isLoading}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-lg hover:shadow-xl text-white font-semibold px-8 py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              {useAI ? 'Processing with AI...' : 'Parsing Meeting...'}
            </>
          ) : (
            <>
              <Mic className="mr-3 h-5 w-5" />
              Parse Meeting
            </>
          )}
        </Button>
        
        <Button
          onClick={handleClear}
          variant="outline"
          disabled={isLoading}
          className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 rounded-xl px-6 py-3"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Results */}
      {parsedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-6 border border-green-200/50 dark:border-slate-600/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                ✨ {parsedTasks.length} tasks extracted from transcript
              </h3>
              <Button
                onClick={handleAddAllTasks}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl px-6 py-2 font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add All Tasks
              </Button>
            </div>
            
            <div className="space-y-3">
              {parsedTasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 flex-1">
                      {task.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium">
                        Meeting
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    {task.assignee && (
                      <div className="text-slate-600 dark:text-slate-300">
                        👤 Assigned to: {task.assignee}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="text-slate-600 dark:text-slate-300">
                        📅 Due: {task.dueDate.toLocaleDateString()} at {task.dueDate.toLocaleTimeString()}
                      </div>
                    )}
                    <div className={`text-xs ${getConfidenceColor(task.confidence)}`}>
                      Confidence: {task.confidence}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function parseMeetingWithGemini(transcript: string, apiKey: string): Promise<ParsedMeetingTask[]> {
  const prompt = `
You are an intelligent meeting transcript analyzer. Parse the following meeting transcript and extract all actionable tasks. Return ONLY valid JSON with this exact structure:

{
  "tasks": [
    {
      "name": "task description",
      "assignee": "person name or null",
      "dueDate": "ISO date string or null",
      "priority": "P1, P2, P3, or P4",
      "confidence": "high, medium, or low",
      "originalText": "original sentence from transcript"
    }
  ]
}

Rules for parsing meeting transcripts:
1. Look for assignment patterns: "you take", "please handle", "can you", "your responsibility", names followed by tasks
2. Extract clear assignee names mentioned in the context of task assignments
3. Parse deadline expressions: "tomorrow", "tonight", "Wednesday", "by Friday 2pm", "next Monday"
4. Identify priority mentions (P1, P2, P3, P4) or infer from urgency context
5. Confidence levels:
   - high: Clear assignee, clear deadline, specific task
   - medium: Missing one element (assignee OR deadline unclear)
   - low: Vague assignment or unclear task description

Transcript: "${transcript}"

JSON:`;

  const response = await parseWithGemini(prompt, apiKey);
  
  // This is a simplified version - we'll enhance the Gemini parsing for meeting transcripts
  return [
    {
      ...response,
      confidence: 'medium' as const,
      originalText: transcript
    }
  ];
}
