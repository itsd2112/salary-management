# Employee Salary Management System

A full-stack web application for managing employee compensation and payroll analytics for ACME's HR team.

---

## Problem Statement

HR teams currently manage employee salary information across multiple Excel spreadsheets, making it difficult to:

- Maintain a single source of truth
- Search and update employee records efficiently
- Analyze payroll data
- Answer organization-wide compensation questions

This application replaces the spreadsheet-based workflow with a centralized, searchable, and maintainable solution that enables HR managers to efficiently manage employee compensation and gain meaningful payroll insights.

---

## Features

- Search, filter, and paginate 10,000 employees
- Employee detail with full salary history
- Add employees, update salary, deactivate
- Analytics dashboard — payroll by department/country, salary distribution, top paid

---

## Live Demo

- **Frontend:** https://salary-management-fd2j.vercel.app/
- **Backend:** https://salary-management-uu53.onrender.com

---

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query v5
- **Backend:** Node.js, Express 5, TypeScript, Prisma 6, SQLite, Zod 4
- **Testing:** Jest 29


---

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Runs at `http://localhost:3000`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Runs at `http://localhost:5173`

---

## Seed Script

Generates 10,000 deterministic employees with realistic salary history:

```bash
cd backend
npm run seed
```

---

## Tests

```bash
cd backend
npm test
```

26 unit tests covering employee service business logic and analytics.

---

## Docs

- `docs/requirements.md` — project requirements and scope
- `docs/architecture.md` — architecture, data model, and API contract
- `docs/development-plan.md` — sprint-based development plan