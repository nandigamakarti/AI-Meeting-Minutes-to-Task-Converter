
import { ParsedTask } from '../types/task';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function parseWithGemini(input: string, apiKey: string): Promise<ParsedTask> {
  const prompt = `
You are an intelligent task management assistant. Analyze the following task input and extract structured information with enhanced understanding. Return ONLY valid JSON with this exact structure:

{
  "name": "main task description",
  "assignee": "person name or null",
  "dueDate": "ISO date string or null",
  "priority": "P1, P2, P3, or P4"
}

Rules for intelligent parsing:
1. Task Name:
   - Extract the core objective/action
   - Expand abbreviations (e.g., "q2" → "Q2 2024")
   - Make it more specific and actionable
   - Maintain professional tone

2. Assignee:
   - Look for names after "assign", "@", "by", or before "next"
   - Consider context clues for implied assignees
   - Standardize name format (e.g., "sneha" → "Sneha")

3. Due Date:
   - Convert relative dates (today, tomorrow, next Friday) to actual dates
   - Consider business context (e.g., "next" might mean next business day)
   - Handle date ranges by using the end date
   - Format as ISO date string

4. Priority (P1-P4):
   - P1: Critical/Urgent tasks, deadlines within 24-48 hours
   - P2: High priority, deadlines within a week
   - P3: Medium priority, deadlines within 2 weeks
   - P4: Low priority, no immediate deadline
   - Consider task context, deadlines, and business impact

Input: "${input}"

JSON:`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 1,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and convert the response
    return {
      name: parsed.name || 'Untitled Task',
      assignee: parsed.assignee || undefined,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
      priority: ['P1', 'P2', 'P3', 'P4'].includes(parsed.priority) ? parsed.priority : 'P3'
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to parse with AI. Please check your API key and try again.');
  }
}
