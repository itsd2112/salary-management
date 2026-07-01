# Employee Salary Management System – Requirements Document

## 1. Goal

Build a web-based Employee Salary Management System that enables ACME's HR team to efficiently manage salary information for approximately 10,000 employees across multiple countries. The application should replace the current Excel-based workflow with a centralized, searchable, and maintainable solution while providing useful payroll insights for HR decision-making.

---

## 2. Problem Statement

The HR team currently manages employee salary data using multiple Excel spreadsheets. This approach results in:

* Difficulty maintaining a single source of truth
* Slow searching and updating of employee records
* Increased risk of manual errors
* Limited visibility into payroll trends and salary distribution
* No centralized reporting or analytics

The proposed application will simplify salary management and provide actionable insights through a modern web interface.

---

## 3. Target User

**Primary User:** HR Manager

The HR Manager should be able to:

* View employee salary information
* Add new employees
* Update salary details
* Remove (deactivate) employees
* Search and filter employees
* View payroll analytics and organization-wide salary statistics

---

## 4. Functional Requirements

### Employee Management

* View employees with pagination
* Search employees by name or employee ID
* Filter employees by department and country
* Sort employees by name, current salary, and hire date
* Add a new employee (creates an initial salary record)
* Edit employee details and salary (see *Salary Change Behavior* below)
* Soft delete (deactivate) an employee

### Compensation Model

* Each employee has a **base salary** and an optional **bonus**, tracked as separate fields.
* "Total compensation" = base salary + bonus. Dashboard metrics (average, highest, lowest, payroll totals) are computed on **base salary** by default, with total compensation available as a secondary view. This avoids ambiguity in what "average salary" means.
* Department and Country are **fixed lookup values** (enum/reference table), not free text — required for reliable filtering and grouping at 10,000-record scale, and to keep seed data consistent.

### Salary Change Behavior

* Editing an employee's salary does **not** overwrite the existing value. Instead, it creates a new entry in a lightweight `salary_history` table (amount, bonus, effective_date, reason — e.g., new hire / raise / promotion / correction).
* The employee's "current salary" is always the most recent entry in this history.
* This is not a general-purpose audit log. It records compensation changes only (amount, bonus, effective date, and reason) to preserve salary history and support compensation analytics. Actor tracking, field-level auditing, and undo capabilities are outside the scope of this project.

### Salary Analytics Dashboard

Display organization-wide metrics including:

* Total employees
* Total payroll (base salary; total comp shown separately)
* Average salary
* Highest salary
* Lowest salary

Provide analytical views such as:

* Payroll by department
* Payroll by country
* Salary distribution (banded/histogram)
* Top highest-paid employees

> **Note:** A "highest-paid employees" view is included because it directly supports the HR Manager's need to answer organization-wide payroll questions. Access control and role-based permissions are intentionally outside the scope of this project.

### Data Management

* Seed the application with 10,000 employee records, including realistic distribution across departments, countries, and salary bands, and a small amount of synthetic salary history per employee (to make analytics/history views meaningful, not empty).
* Persist data using a relational database.
* Validate all user inputs before saving (e.g., non-negative salary, valid department/country values, required fields).

---

## 5. Non-Functional Requirements

* Responsive web application
* Search and list endpoints respond in under 300ms server-side at 10,000 records (server-side pagination and indexed queries; no full-table loads to the client)
* Clean and maintainable codebase
* Layered backend architecture
* Well-defined REST APIs
* Unit tests for core business logic
* Deterministic seed data generation
* Easy local setup using SQLite
* Runnable end-to-end with a single command locally (e.g., Docker Compose), with a deployed instance (e.g., Render/Vercel) for review

---

## 6. Scope

### Included

* Employee CRUD operations
* Salary management, including base salary, bonus, and effective-dated salary history
* Dashboard with payroll analytics
* Search, filtering, sorting, and pagination
* REST API
* SQLite database
* Seed script for 10,000 employees
* Unit tests
* Deployment of frontend and backend

### Explicitly Out of Scope

* Authentication and authorization
* Multiple user roles
* Payroll processing
* Tax calculations
* Currency conversion
* Employee self-service portal
* General-purpose audit logging (actor tracking, field-level diffs, undo) — salary change history is in scope and tracked separately; see Section 4
* File uploads (Excel import/export)
* Email or notification services
* Microservices architecture

---

## 7. Assumptions

* A single HR Manager uses the application.
* Salary values are stored in the employee's local currency.
* Currency conversion is outside the scope.
* The dataset consists of approximately 10,000 employees.
* SQLite provides sufficient performance for this scale.
* Internet connectivity is available during application use.
* Department and country are drawn from a fixed, predefined set of values rather than free text, to keep filtering and analytics reliable.

---

## 8. Success Criteria

The project will be considered successful if the HR Manager can:

* Efficiently manage employee salary records
* Quickly locate employees using search and filters
* View meaningful payroll insights through the dashboard
* Manage 10,000 employee records with good performance
* Use a responsive and intuitive web application

Additionally, the solution should demonstrate:

* Clear architecture
* Production-quality code
* Good test coverage
* Maintainable project structure
* Thoughtful engineering decisions
* Appropriate use of AI during development

---

## 9. Key Engineering Decisions

* **React** for a modern, responsive frontend.
* **Node.js + TypeScript** for a strongly typed backend.
* **Express.js** to keep the API lightweight and easy to understand.
* **SQLite** as the relational database because it is simple to set up and sufficient for 10,000 employee records.
* **Layered Architecture (Controller → Service → Repository)** to improve maintainability and testability.
* **Prisma ORM** for type-safe database access and simplified migrations.
* **Append-only `salary_history` table** instead of mutable salary fields, so compensation-over-time questions are answerable without a full audit system.