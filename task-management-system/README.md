# Project Task Management System

A complete full-stack **Project Task Management System** developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Bootstrap and Axios.

---

## 📁 Project Structure

```
task-management-system/
├── backend/
│   ├── server.js          # Express app, Mongoose schemas, REST API endpoints
│   ├── package.json       # Backend dependencies (express, mongoose, cors)
│   └── .gitignore
└── task-manager-frontend/
    ├── public/
    │   └── index.html     # HTML entry point with responsive meta tags
    ├── src/
    │   ├── App.js         # React task dashboard, Axios calls, state updates
    │   ├── App.css        # Responsive styling and status column themes
    │   └── index.js       # React 18 createRoot & Bootstrap CSS imports
    ├── package.json       # Frontend dependencies (react, axios, bootstrap)
    └── .gitignore
```

---

## ⚙️ Prerequisites

1. **Node.js & npm**: Installed on Windows (`node -v`, `npm -v` or `npm.cmd -v`).
2. **MongoDB**: Local MongoDB community server running on port `27017`.

### How to verify or start MongoDB on Windows:

Check service status in PowerShell:
```powershell
Get-Service -Name MongoDB
```

If it is stopped, start it with:
```powershell
Start-Service -Name MongoDB
```
*(Or launch Command Prompt as Administrator and run `net start MongoDB`)*.

---

## 🚀 How to Run the Application

### Terminal 1: Start Backend (Port 5000)

```powershell
cd d:\html\Project_Manger\task-management-system\backend
npm install
node server.js
```
*Expected Console Output:*
```
Server running on port 5000
MongoDB connected successfully
```

> **Note for Windows PowerShell users:** If PowerShell shows a script execution error for `npm`, run `npm.cmd install` instead.

---

### Terminal 2: Start Frontend (Port 3000)

```powershell
cd d:\html\Project_Manger\task-management-system\task-manager-frontend
npm install
npm start
```
*(Or `npm.cmd start` if PowerShell execution policy blocks `.ps1`)*.

This will automatically open the dashboard in your default browser at `http://localhost:3000`.

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/tasks`

| Method | Endpoint | Description | Request Body | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Retrieve all tasks from MongoDB | None | `200 OK` |
| **POST** | `/tasks` | Create a new task (default status: `Pending`) | `{ "title": "Task name" }` | `201 Created` / `400 Bad Request` |
| **PATCH** | `/tasks/:id` | Update task status (`Pending`, `Ongoing`, `Completed`) | `{ "status": "Ongoing" }` | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/tasks/:id` | Delete task by MongoDB ID | None | `200 OK` / `404 Not Found` |

---

## ✨ Features & Practical Examination Checklist

- [x] **Database Connection**: Automatic connection to `mongodb://localhost:27017/taskmanager` with clear error logging.
- [x] **Schema Validation**: Title required, status restricted to `Pending`, `Ongoing`, `Completed`. Automatic timestamps (`createdAt`, `updatedAt`).
- [x] **Blank Task Prevention**: Client-side check and backend 400 rejection for blank or whitespace-only titles.
- [x] **Three Categorized Columns**: Pending, Ongoing, and Completed columns with live task count badges and empty states.
- [x] **Dynamic Card Buttons**:
  - `Mark as Ongoing` (hidden if task is already Ongoing)
  - `Mark as Completed` (hidden if task is already Completed)
  - `Delete Task` (available on all cards)
- [x] **Asynchronous State Updates**: Immediate React state updates via Axios without reloading the page.
- [x] **Feedback Alerts**: Clear success and error notifications for all actions.
- [x] **Responsive Layout**: Bootstrap grid with card elevation effects, soft shadows, and clean modern accents.
