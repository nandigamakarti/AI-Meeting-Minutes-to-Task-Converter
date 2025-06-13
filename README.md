# 📝 AI-Meeting-Minutes-to-Task-Converter

Transform your meeting minutes into actionable tasks with AI! This app leverages Google Gemini AI to extract, organize, and manage tasks directly from meeting transcripts, streamlining your workflow and boosting productivity.

---

## 🚀 Features

- **Meeting Minutes to Tasks**: Paste or upload meeting transcripts and let AI extract, summarize, and structure actionable tasks.
- **Manual Task Entry**: Add tasks in natural language; AI parses details like priority, deadline, and assignee.
- **Bulk Add & Edit**: Preview and edit tasks before adding them to your board.
- **AI Confidence Indicators**: See how certain the AI is about each extracted detail.
- **Modern UI/UX**: Clean, responsive interface for desktop and mobile.
- **Local-First**: All data is stored securely in your browser (no backend required).

---

## ⚡ Quick Start

1. **Clone the repository**
    ```bash
    git clone https://github.com/nandigamakarti/AI-Meeting-Minutes-to-Task-Converter.git
    cd AI-Meeting-Minutes-to-Task-Converter
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Run the development server**
    ```bash
    npm run dev
    ```

---

**No environment variables or API keys are required for setup.**

---

## 🖼️ Screenshots

Below are example output pages from the app:

1. ![Meeting Minutes Input](https://github.com/user-attachments/assets/2572002a-adc9-45e8-9552-8ac468428b0f)
2. ![AI-Extracted Tasks Preview](https://github.com/user-attachments/assets/ce203bfe-7d2d-4161-bd73-93b868284b98)
3. ![Task Board](https://github.com/user-attachments/assets/2c962574-7111-496f-a799-58792721e291)
4. ![Edit Task Modal](https://github.com/user-attachments/assets/7ebc9a62-982d-4771-aaca-e14f350c5558)
5. ![Mobile Responsive View](https://github.com/user-attachments/assets/473a7093-bf33-48d2-b100-15065af5440e)

---

## 📚 About

AI-Meeting-Minutes-to-Task-Converter is designed for teams and professionals who want to automate the tedious process of turning meeting notes into actionable plans. Powered by Google Gemini AI, it ensures accuracy, speed, and ease of use.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)

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







