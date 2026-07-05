# Development Plan — Employee Salary Management System

## Overview

This document outlines the sprint-based development plan for the Employee Salary Management System.
Each sprint delivers a working, testable increment of the application.

---

## Sprint 1 — Project Foundation

**Goal:** Establish the technical foundation for both frontend and backend.

**Backend**
- Initialize Node.js + Express + TypeScript project with strict configuration
- Define database schema using Prisma ORM with SQLite
- Set up environment configuration, error handling, and request validation middleware
- Implement deterministic seed script generating 10,000 employees with realistic salary history

**Frontend**
- Initialize React + Vite + TypeScript project
- Configure Tailwind CSS v4, React Router v7, and TanStack Query v5
- Set up shared TypeScript types, Axios API client, and application layout with sidebar navigation

**Outcome:** Backend and frontend running locally. Database seeded with 10,000 employees across 8 departments and 6 countries.

---

## Sprint 2 — Core Backend APIs

**Goal:** Build all REST endpoints required by the frontend using a layered Controller → Service → Repository architecture.

**Employee Endpoints**
- List employees with server-side search, filtering, sorting, and pagination
- Get single employee with full salary history
- Create employee with initial salary entry (transactional)
- Update employee non-salary fields
- Soft delete (deactivate) employee
- Append new salary history entry

**Lookup Endpoints**
- List departments
- List countries with currency codes

**Analytics Endpoints**
- Organisation-wide summary (headcount, total payroll, avg/min/max salary)
- Payroll breakdown by department
- Payroll breakdown by country
- Salary distribution histogram (10 bands)
- Top N highest paid employees

**Outcome:** All API endpoints tested and returning correct data. Consistent error responses and HTTP status codes enforced throughout.

---

## Sprint 3 — Employee UI

**Goal:** Build all employee-facing pages and complete the full employee management flow end to end.

**Employee List Page**
- Paginated table with search, department filter, country filter, and sort
- Search with debounce to avoid unnecessary API calls
- Column sorting by name and hire date
- Pagination controls with record count

**Employee Detail Page**
- Employee profile, current compensation, and full salary history
- Deactivate employee with confirmation dialog
- Add salary entry form with validation

**New Employee Page**
- Create employee form with department and country dropdowns
- Client-side validation mirroring backend Zod schemas
- Redirect to detail page on success

**Outcome:** HR Manager can view, create, update, and deactivate employees entirely through the UI.

---

## Sprint 4 — Analytics Dashboard

**Goal:** Build the analytics dashboard giving HR Manager org-wide payroll visibility.

- Summary cards: headcount, total payroll, average salary, highest and lowest salary
- Payroll by department — horizontal bar chart
- Headcount by country — horizontal bar chart
- Salary distribution — histogram
- Top 10 highest paid employees — ranked table

**Outcome:** HR Manager can answer org-wide payroll questions without opening a spreadsheet.

---

## Sprint 5 — Tests

**Goal:** Meaningful, fast, and deterministic test coverage of core business logic and API behaviour.

**Backend Unit Tests**
- Employee service: create, update, deactivate, duplicate email rejection, salary validation
- Analytics repository: correct grouping and aggregation logic

**Outcome:** Core business logic covered by a fast, reliable test suite. 26 tests passing.

---

## Sprint 6 — Polish & Deployment

**Goal:** Production-ready, deployed application ready for review.

**Polish**
- Loading states and empty states across all pages
- Global error handling

**Deployment**
- Docker Compose for one-command local setup
- Backend deployed to Render, frontend deployed to Vercel
- Environment variables documented in `.env.example`

**Documentation**
- README with local setup, seed, and test instructions
- Architecture document
- Development plan

**Outcome:** Fully deployed application with a shareable link and complete documentation.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5, TypeScript |
| Database | SQLite via Prisma ORM |
| Validation | Zod |
| Frontend | React 19, Vite, TypeScript |
| UI | shadcn/ui, Tailwind CSS v4 |
| Server State | TanStack Query v5 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Testing | Jest 29 |
| Deployment | Render (backend), Vercel (frontend) |

---

## Out of Scope (v1)

- Authentication and authorization
- Role-based access control
- Payroll processing and tax calculations
- Currency conversion
- Excel import / export
- Email notifications
- General-purpose audit logging
- CI/CD pipeline  s