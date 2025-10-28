# BudgetTracker
This is a Personal Budget Tracker application where users can track their income, expenses, and overall  budget. For reference: Monthly Budget.

# 💰 Budget Tracker – Full Stack Application

A **full-featured budget management system** built with **Django REST Framework (backend)** and **React + TypeScript + Vite (frontend)**.  
It helps users efficiently track their **income, expenses, and budgets**, all through an elegant dashboard with D3.js visualizations.

---

## 🚀 Features

✅ **User Authentication** (Login system)  
✅ **Add / Edit / Delete Transactions**  
✅ **Categorize income and expenses**  
✅ **Dynamic Dashboard** with:
   - Income vs Expense (D3 Donut Chart)
   - Budget vs Actual (D3 Bar Chart)
   - Latest 5 transactions preview  
✅ **Responsive & modern UI (TailwindCSS)**  
✅ **RESTful API** built with Django REST Framework  
✅ **Secure, modular, and scalable structure**

---

## 🗂️ Project Structure

D:\DotProduct
│
├── budget-tracker-backend
│ ├── backend\ # Django project folder
│ ├── finance\ # Django app folder
│ ├── .venv\ # Virtual environment
│ ├── manage.py
│ └── requirements.txt
│
└── budget-tracker-frontend
├── src\ # React TypeScript source
├── public
├── package.json
├── vite.config.ts
└── tsconfig.json



---

## ⚙️ Backend Setup (Django API)

```bash
# Navigate to backend directory
cd D:\DotProduct\budget-tracker-backend

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Django server
cd backend
py manage.py runserver



🎨 Frontend Setup (React + Vite + TypeScript)

# Navigate to frontend directory
cd budget-tracker-frontend

# Install dependencies
npm install

# Start development server
npm run dev


🔑 Demo Credentials

Use these credentials to log in and test the app:

Username: Admin
Password: Admin123



🧠 Tech Stack

Frontend: React + TypeScript + TailwindCSS + Vite + D3.js
Backend: Django + Django REST Framework
Database: SQLite (default, easy setup)
Authentication: Token-based authentication (DRF)



📸 Dashboard Preview

The dashboard includes:

Income vs Expense (green for income, red for expense)

Budget vs Actual comparison

Recent transactions table

Link to full transaction history


✅ Author: Usaib Peer
📍 Project Path:

Backend → D:\DotProduct\budget-tracker-backend

Frontend → D:\DotProduct\budget-tracker-frontend
