# 💼 Enhanced AI-Powered Natural Language Task Manager with Meeting Minutes Parser

An intelligent task management application that allows users to:
- Add tasks using natural language
- Automatically parse meeting transcripts into actionable tasks using **Gemini API**
- Seamlessly manage all tasks from a unified interface

---

## 🚀 Overview

This project enhances a traditional task manager by integrating **Google Gemini AI** to transform raw, unstructured meeting transcripts into well-structured task lists. The application supports:

- ✅ **Manual Task Addition** using natural language with AI-assisted or regex fallback parsing  
- 🎙️ **Meeting Minutes Parsing** to convert full meeting transcripts into multiple tasks using advanced AI  
- 🎯 Priority & deadline recognition (e.g., "by Friday 6pm", "next Monday", "tonight")  
- 👤 Assignee name recognition from conversation context  
- 📊 Preview & bulk-add extracted tasks  
- 🔍 Confidence indicators on AI-extracted data  
- 💾 Client-side persistence using `localStorage`  
- 📱 Responsive, mobile-friendly layout  
- 💡 Professional UI/UX, modern design, animated transitions

---

## 🛠️ Setup Instructions

Follow the steps below to set up the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/srujana-namburu/ai-task-craftsman.git
cd ai-task-craftsman
```
### 2. Install dependencies
Make sure you have Node.js installed, then run:
```
npm install
```
### 3. Create .env file
Create a .env file in the root directory with your Gemini API key:
```
GEMINI_API_KEY=your_google_gemini_api_key_here
```
### 4. Run the development server
```
npm run dev

```

### ✨ Features
#### 🔹 Manual Task Entry
Add tasks using natural language

Gemini or regex-based parsing

Smart due date, assignee, and priority extraction

#### 🔹 Meeting Minutes Parser
Paste meeting transcript in a dedicated tab

AI processes transcript using Gemini to extract multiple tasks

Tasks previewed with option to edit and bulk-add

#### 🔹 Enhanced Task Cards
Unified task board for manual and meeting-derived tasks

Task metadata: description, assignee, deadline, priority

Source indicators: Manual / Meeting

AI confidence indicators (High/Med/Low)

#### 🔹 Client-Side Storage
All tasks stored in localStorage

No backend required

#### 🎨 UI Highlights
Modern, enterprise-grade interface

Tabs for "Add Task" and "Meeting Parser"

Animations on parsing, task addition, and editing

Color-coded priorities and confidence scores

Responsive layout for desktop, mobile, and tablet

## Output Screenshots

1. ![image](https://github.com/user-attachments/assets/2572002a-adc9-45e8-9552-8ac468428b0f)
2. ![image](https://github.com/user-attachments/assets/ce203bfe-7d2d-4161-bd73-93b868284b98)
3. ![image](https://github.com/user-attachments/assets/2c962574-7111-496f-a799-58792721e291)
4. ![image](https://github.com/user-attachments/assets/7ebc9a62-982d-4771-aaca-e14f350c5558)
5. ![image](https://github.com/user-attachments/assets/473a7093-bf33-48d2-b100-15065af5440e)
6. ![image](https://github.com/user-attachments/assets/6fadb494-f61b-40aa-85e2-c4202f28f34e)
7. ![image](https://github.com/user-attachments/assets/06561eea-4dd6-41ce-af6c-50cd811a9d9a)







