
import { ParsedTask } from '../types/task';

const PRIORITY_REGEX = /\b(P[1-4])\b/i;
const NAME_PATTERNS = [
  /^(.*?)\s+(?:by|due|deadline|@)/i,
  /^(.*?)\s+\w+day/i,
  /^(.*?)\s+\d/i
];

const ASSIGNEE_PATTERNS = [
  /(?:assign(?:ed)?\s+to\s+|@)(\w+)/i,
  /\b(\w+)\s+(?:by|due|deadline)/i,
  /\s(\w+)(?:\s+by|\s+\d)/i
];

const TIME_PATTERNS = [
  /\b(\d{1,2}):?(\d{2})?\s*(am|pm)\b/i,
  /\b(\d{1,2})\s*(am|pm)\b/i
];

const DATE_PATTERNS = [
  /\b(today|tomorrow|yesterday)\b/i,
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\b(next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
  /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/,
  /\b(\d{1,2})-(\d{1,2})(?:-(\d{2,4}))?\b/,
  /\bin\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i,
  /\bafter\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i
];

export function parseNaturalLanguage(input: string): ParsedTask {
  const trimmedInput = input.trim();
  
  // Extract priority (default to P3)
  const priorityMatch = trimmedInput.match(PRIORITY_REGEX);
  const priority = priorityMatch ? priorityMatch[1].toUpperCase() as 'P1' | 'P2' | 'P3' | 'P4' : 'P3';
  
  // Extract assignee
  let assignee: string | undefined;
  for (const pattern of ASSIGNEE_PATTERNS) {
    const match = trimmedInput.match(pattern);
    if (match && match[1]) {
      assignee = match[1];
      break;
    }
  }
  
  // Extract date and time
  const dueDate = extractDateTime(trimmedInput);
  
  // Extract task name (clean version without metadata)
  let name = extractTaskName(trimmedInput, assignee, priority, dueDate);
  
  // Clean up the name
  name = name
    .replace(PRIORITY_REGEX, '')
    .replace(/\b(today|tomorrow|yesterday)\b/i, '')
    .replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, '')
    .replace(/\b(next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, '')
    .replace(/\b(\d{1,2}):?(\d{2})?\s*(am|pm)\b/i, '')
    .replace(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i, '')
    .replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i, '')
    .replace(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/, '')
    .replace(/\b(\d{1,2})-(\d{1,2})(?:-(\d{2,4}))?\b/, '')
    .replace(/\bin\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i, '')
    .replace(/\bafter\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i, '')
    .replace(/\b(?:by|due|deadline|@)\b/i, '')
    .replace(/\b(?:assign(?:ed)?\s+to)\b/i, '')
    .replace(new RegExp(`\\b${assignee}\\b`, 'i'), '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return {
    name: name || 'Untitled Task',
    assignee,
    dueDate,
    priority
  };
}

function extractTaskName(input: string, assignee?: string, priority?: string, dueDate?: Date): string {
  // Try different patterns to extract the main task name
  for (const pattern of NAME_PATTERNS) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Fallback: take everything before common keywords
  const keywords = ['by', 'due', 'deadline', 'tomorrow', 'today', 'next', 'this', 'assign', '@'];
  let name = input;
  
  for (const keyword of keywords) {
    const regex = new RegExp(`\\s+${keyword}\\b.*`, 'i');
    name = name.replace(regex, '');
  }
  
  return name.trim();
}

function extractDateTime(input: string): Date | undefined {
  const now = new Date();
  let targetDate = new Date(now);
  let hasTime = false;
  let hour = 0;
  let minute = 0;
  
  // Extract time first
  for (const pattern of TIME_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      hasTime = true;
      hour = parseInt(match[1]);
      minute = match[2] ? parseInt(match[2]) : 0;
      
      if (match[3]?.toLowerCase() === 'pm' && hour !== 12) {
        hour += 12;
      } else if (match[3]?.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      break;
    }
  }
  
  // Extract date
  let dateFound = false;
  
  // Handle relative dates
  if (input.match(/\btoday\b/i)) {
    dateFound = true;
  } else if (input.match(/\btomorrow\b/i)) {
    targetDate.setDate(targetDate.getDate() + 1);
    dateFound = true;
  } else if (input.match(/\byesterday\b/i)) {
    targetDate.setDate(targetDate.getDate() - 1);
    dateFound = true;
  }
  
  // Handle specific weekdays
  const weekdayMatch = input.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (weekdayMatch) {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = weekdays.indexOf(weekdayMatch[1].toLowerCase());
    const currentDay = targetDate.getDay();
    
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Next occurrence
    }
    
    // Check for "next" or "this" prefix
    if (input.match(/\bnext\s+/i)) {
      daysToAdd += 7;
    }
    
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    dateFound = true;
  }
  
  // Handle month/day patterns
  const monthDayMatch = input.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
  if (monthDayMatch) {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const month = months.indexOf(monthDayMatch[2].toLowerCase());
    const day = parseInt(monthDayMatch[1]);
    
    targetDate.setMonth(month, day);
    if (targetDate < now) {
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }
    dateFound = true;
  }
  
  // Handle day/month patterns
  const dayMonthMatch = input.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i);
  if (dayMonthMatch) {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const month = months.indexOf(dayMonthMatch[1].toLowerCase());
    const day = parseInt(dayMonthMatch[2]);
    
    targetDate.setMonth(month, day);
    if (targetDate < now) {
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }
    dateFound = true;
  }
  
  // Handle numeric date patterns (MM/DD or MM-DD)
  const numericDateMatch = input.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
  if (numericDateMatch) {
    const month = parseInt(numericDateMatch[1]) - 1; // JS months are 0-indexed
    const day = parseInt(numericDateMatch[2]);
    let year = numericDateMatch[3] ? parseInt(numericDateMatch[3]) : targetDate.getFullYear();
    
    if (year < 100) {
      year += 2000; // Convert 2-digit years
    }
    
    targetDate.setFullYear(year, month, day);
    dateFound = true;
  }
  
  // Handle relative time phrases
  const relativeMatch = input.match(/\bin\s+(\d+)\s+(day|days|week|weeks|month|months)\b/i);
  if (relativeMatch) {
    const amount = parseInt(relativeMatch[1]);
    const unit = relativeMatch[2].toLowerCase();
    
    if (unit.startsWith('day')) {
      targetDate.setDate(targetDate.getDate() + amount);
    } else if (unit.startsWith('week')) {
      targetDate.setDate(targetDate.getDate() + amount * 7);
    } else if (unit.startsWith('month')) {
      targetDate.setMonth(targetDate.getMonth() + amount);
    }
    dateFound = true;
  }
  
  // If we found a date or time, set the time and return
  if (dateFound || hasTime) {
    if (hasTime) {
      targetDate.setHours(hour, minute, 0, 0);
    } else if (dateFound) {
      // If only date is specified, set to end of day
      targetDate.setHours(23, 59, 59, 999);
    }
    return targetDate;
  }
  
  return undefined;
}

export function formatDueDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (taskDate.getTime() === today.getTime()) {
    return `Today, ${timeStr}`;
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${timeStr}`;
  } else {
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
    return `${dateStr}, ${timeStr}`;
  }
}

export function isOverdue(date: Date): boolean {
  return date < new Date();
}

export function isDueToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isDueTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}
