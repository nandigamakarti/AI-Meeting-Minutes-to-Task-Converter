
import { ParsedTask } from '../types/task';

interface ParsedMeetingTask extends ParsedTask {
  confidence: 'high' | 'medium' | 'low';
  originalText: string;
}

export function parseMeetingTranscript(transcript: string): ParsedMeetingTask[] {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const tasks: ParsedMeetingTask[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length === 0) continue;

    // Look for assignment patterns
    const assignmentPatterns = [
      /(\w+)\s+you\s+take\s+(.+?)(?:\s+by\s+(.+?))?$/i,
      /(\w+)\s+please\s+(.+?)(?:\s+by\s+(.+?))?$/i,
      /(\w+)\s+can\s+you\s+(.+?)(?:\s+by\s+(.+?))?$/i,
      /(\w+)\s+handle\s+(.+?)(?:\s+by\s+(.+?))?$/i,
      /(\w+)\s+take\s+care\s+of\s+(.+?)(?:\s+by\s+(.+?))?$/i
    ];

    let parsed = false;
    
    for (const pattern of assignmentPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const [, assignee, taskDesc, deadline] = match;
        
        const task: ParsedMeetingTask = {
          name: cleanTaskName(taskDesc),
          assignee: assignee,
          dueDate: deadline ? parseDeadline(deadline) : undefined,
          priority: extractPriority(trimmed),
          confidence: calculateConfidence(assignee, taskDesc, deadline),
          originalText: trimmed
        };
        
        tasks.push(task);
        parsed = true;
        break;
      }
    }

    // Alternative patterns
    if (!parsed) {
      const altPatterns = [
        /(.+?)\s+(\w+)\s+by\s+(.+)$/i,
        /(\w+)\s+your\s+responsibility\s+(.+?)(?:\s+by\s+(.+?))?$/i
      ];

      for (const pattern of altPatterns) {
        const match = trimmed.match(pattern);
        if (match) {
          let taskDesc, assignee, deadline;
          
          if (pattern.source.includes('responsibility')) {
            [, assignee, taskDesc, deadline] = match;
          } else {
            [, taskDesc, assignee, deadline] = match;
          }
          
          const task: ParsedMeetingTask = {
            name: cleanTaskName(taskDesc),
            assignee: assignee,
            dueDate: deadline ? parseDeadline(deadline) : undefined,
            priority: extractPriority(trimmed),
            confidence: calculateConfidence(assignee, taskDesc, deadline),
            originalText: trimmed
          };
          
          tasks.push(task);
          parsed = true;
          break;
        }
      }
    }
  }

  return tasks;
}

function cleanTaskName(taskDesc: string): string {
  return taskDesc
    .replace(/\b(P[1-4])\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPriority(text: string): 'P1' | 'P2' | 'P3' | 'P4' {
  const match = text.match(/\b(P[1-4])\b/i);
  return match ? match[1].toUpperCase() as 'P1' | 'P2' | 'P3' | 'P4' : 'P3';
}

function parseDeadline(deadline: string): Date | undefined {
  const now = new Date();
  const trimmed = deadline.trim().toLowerCase();

  if (trimmed.includes('tonight')) {
    const tonight = new Date(now);
    tonight.setHours(23, 59, 59, 999);
    return tonight;
  }

  if (trimmed.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check for time
    const timeMatch = deadline.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const ampm = timeMatch[3].toLowerCase();
      
      if (ampm === 'pm' && hour !== 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      
      tomorrow.setHours(hour, minute, 0, 0);
    } else {
      tomorrow.setHours(23, 59, 59, 999);
    }
    
    return tomorrow;
  }

  // Handle specific weekdays
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < weekdays.length; i++) {
    if (trimmed.includes(weekdays[i])) {
      const targetDate = new Date(now);
      const currentDay = targetDate.getDay();
      const targetDay = i;
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Next occurrence
      }
      
      if (trimmed.includes('next')) {
        daysToAdd += 7;
      }
      
      targetDate.setDate(targetDate.getDate() + daysToAdd);
      
      // Check for specific time
      const timeMatch = deadline.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const ampm = timeMatch[3].toLowerCase();
        
        if (ampm === 'pm' && hour !== 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        
        targetDate.setHours(hour, minute, 0, 0);
      } else {
        targetDate.setHours(23, 59, 59, 999);
      }
      
      return targetDate;
    }
  }

  return undefined;
}

function calculateConfidence(assignee?: string, taskDesc?: string, deadline?: string): 'high' | 'medium' | 'low' {
  let score = 0;
  
  if (assignee && assignee.length > 1) score += 1;
  if (taskDesc && taskDesc.length > 5) score += 1;
  if (deadline) score += 1;
  
  if (score === 3) return 'high';
  if (score === 2) return 'medium';
  return 'low';
}
