# HRMS Lite – Human Resource Management System

A lightweight, web-based HR management tool that allows an admin to manage employee records and track daily attendance.

**Live hosted app — open in browser:** [http://80.225.204.112](http://80.225.204.112)

---

## Live Demo

| Service    | URL |
|------------|-----|
| **App (access here)** | [http://80.225.204.112](http://80.225.204.112) |

---

## Tech Stack

| Layer   | Technology                    |
|---------|-------------------------------|
| Frontend| React, Vite, TailwindCSS, React Query |
| Backend | Python, FastAPI               |
| Database| PostgreSQL (e.g. Supabase)   |
| Frontend Deployment | Vercel   |
| Backend Deployment  | Render   |

---

## Features

### Core
- **Employee Management** – Add, view, edit, and delete employees with auto-generated Employee IDs (EMP-2001, EMP-2002, …)
- **Attendance Management** – Mark daily attendance (Present / Absent) per employee, view and edit records

### Dashboard
- Summary cards: total employees, today’s present, absent, and pending (not yet marked)
- Stats refresh automatically when employees or attendance change (no page refresh needed)

### Attendance
- Filter records by employee, date range, status (present/absent), department, and search
- Pagination for large lists

---

## Project Structure

```
assessment/
├── backend/
│   ├── main.py                 # FastAPI app, lifespan, CORS, router registration
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py        # Pydantic settings (env validation)
│   │   └── database.py        # SQLAlchemy engine, session, get_db
│   ├── models/
│   │   ├── __init__.py
│   │   ├── employee.py
│   │   └── attendance.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── employee.py        # Pydantic request/response
│   │   └── attendance.py
│   ├── routers/
│   │   ├── __init__.py        # Router registry
│   │   ├── employees.py
│   │   ├── attendance.py
│   │   └── dashboard.py
│   ├── validators/
│   │   ├── __init__.py
│   │   ├── employee_validator.py
│   │   └── attendance_validator.py
│   ├── utils/
│   │   ├── __init__.py
│   │   └── response.py       # success_response, error_response
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── config/            # PATHS, constants, routes
    │   ├── utils/             # date, toast helpers
    │   ├── layouts/           # MainLayout
    │   ├── routes/             # AppRoutes (React Router)
    │   ├── components/
    │   │   ├── layout/        # Sidebar
    │   │   ├── ui/            # Button, Badge, Modal, Toast, ApiErrorBanner
    │   │   ├── Employees/     # Table, modals, header
    │   │   └── Attendance/    # Mark form, records table, edit modal
    │   ├── pages/             # Dashboard, Employees, Attendance, Settings
    │   ├── services/          # API client, employee, attendance, dashboard
    │   └── hooks/             # useEmployees, useAttendance, useAttendanceStats
    ├── .env.example
    └── package.json
```

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (or Supabase account)

---

### Backend

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env
# Fill in DATABASE_URL (required). Other vars are optional.

# 6. Run the server
uvicorn main:app --reload
```

Backend: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

---

### Frontend

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Set VITE_API_URL=http://127.0.0.1:8000 (or your backend URL)

# 4. Run the dev server
npm run dev
```

Frontend: `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

| Variable        | Required | Description |
|----------------|----------|-------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/dbname`) |
| `APP_NAME`     | No       | API title (default: HRMS Lite API) |
| `API_VERSION`  | No       | API version (default: 1.0.0) |
| `API_PREFIX`   | No       | Global route prefix (e.g. `/api/v1`) |
| `CORS_ORIGINS` | No       | Comma-separated origins (default: localhost:5173) |
| `LOG_LEVEL`    | No       | Logging level: DEBUG, INFO, WARNING, ERROR |
| `DEBUG`        | No       | Debug mode (default: false) |
| `DB_POOL_SIZE` | No       | DB pool size (default: 5) |
| `DB_MAX_OVERFLOW` | No    | DB max overflow (default: 10) |

### Frontend `.env`

| Variable        | Description |
|----------------|-------------|
| `VITE_API_URL` | Backend API base URL, no trailing slash (e.g. `http://127.0.0.1:8000`) |

---

## API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/employees` | List all employees |
| GET    | `/employees/{employee_id}` | Get single employee |
| POST   | `/employees` | Create employee |
| PATCH  | `/employees/{employee_id}` | Update employee |
| DELETE | `/employees/{employee_id}` | Delete employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/attendance` | List attendance (supports filters, pagination) |
| GET    | `/attendance/stats` | Stats for a date (total_employees, marked_count) |
| GET    | `/attendance/{id}` | Get single record |
| POST   | `/attendance` | Mark attendance |
| PATCH  | `/attendance/{id}` | Update attendance |
| DELETE | `/attendance/{id}` | Delete record |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/dashboard` | Aggregated stats: total_employees, today_present, today_absent, today_pending |

### Query params (GET /attendance)
| Param        | Type   | Description |
|-------------|--------|-------------|
| `employee_id` | int  | Filter by employee |
| `from`      | date   | Start date (YYYY-MM-DD) |
| `to`        | date   | End date (YYYY-MM-DD) |
| `department`| string| Filter by department |
| `status`    | string| `present` or `absent` |
| `search`    | string| Search in name/department |
| `page`      | int   | Page number (default 1) |
| `limit`     | int   | Page size (default 10, max 100) |

---

## Assumptions & Limitations

- Single admin user — no authentication
- Employee IDs are auto-generated (EMP-2001, EMP-2002, …)
- One attendance record per employee per day
- Future-date attendance is not allowed
- Leave management, payroll, and multi-user auth are out of scope
