# Project Task Management System

A complete full-stack **Project Task Management System** developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Bootstrap and Axios.

---

## 🌐 Live Production URL

- **Deployed Application**: [https://project-task-manager-gules.vercel.app](https://project-task-manager-gules.vercel.app)
- **Hosting Platform**: Vercel
- **GitHub Repository**: [https://github.com/deekshikhaarun0604/projectmanager](https://github.com/deekshikhaarun0604/projectmanager)

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

.
  