# Architecture & Technical Design

---

# 1. Architecture Overview

The Employee Salary Management System follows a layered monolithic architecture consisting of a React frontend and an Express-based REST API.

The application is designed around the following engineering principles:

- Separation of concerns
- Maintainability
- Testability
- Simplicity over unnecessary complexity
- Scalability for approximately 10,000 employees

Although implemented as a monolith, the backend follows clear architectural boundaries, allowing the application to evolve without significant restructuring.

---

# 2. High-Level Architecture

```
+-------------------+     HTTP/JSON      +---------------------------+     Prisma ORM     +-----------+
|   React + Vite    |  ------------->    |      Express API (TS)     |  ------------->    | SQLite DB |
|   (shadcn/ui)     |  <-------------    | Controller → Service →    |  <-------------    |           |
|                   |                    | Repository                |                    |           |
+-------------------+                    +---------------------------+                    +-----------+
```

The frontend and backend are developed and deployed independently and communicate through REST APIs.

---

# 3. Technology Stack

| Layer | Technology | Rationale |
|--------|------------|-----------|
| Frontend | React + Vite + TypeScript | Lightweight SPA with strong typing |
| UI Components | shadcn/ui | Modern, accessible, and customizable UI components |
| Backend | Node.js + Express + TypeScript | Lightweight REST API with excellent TypeScript support |
| ORM | Prisma | Type-safe database access and migration management |
| Database | SQLite | Simple setup and sufficient performance for the expected dataset |
| Validation | Zod | Runtime validation with TypeScript integration |
| Testing | Jest + React Testing Library | Fast and maintainable unit testing |
| Deployment | Docker Compose, Render, Vercel | Simple local development and cloud deployment |

---

# 4. Architectural Decisions

## Separate Frontend and Backend

The frontend and backend are implemented as independent applications rather than a full-stack framework.

### Rationale

- Clear separation between UI and business logic
- Independent deployment
- Better API design
- Easier backend testing
- Better maintainability

---

## Layered Backend Architecture

The backend follows a layered architecture.

```
Request
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
Prisma ORM
   │
   ▼
SQLite
```

Each layer has a single responsibility.

| Layer | Responsibility |
|--------|----------------|
| Routes | API endpoint definitions |
| Controllers | Handle HTTP requests and responses |
| Services | Business rules and orchestration |
| Repositories | Database interaction |
| Prisma | ORM abstraction |
| SQLite | Persistent storage |

This separation improves readability, maintainability, and testability.

---

# 5. Data Model Overview

The application stores employee profile information separately from compensation history.

Core entities include:

- Employee
- Salary History
- Department
- Country

Salary updates are implemented using an append-only history model rather than overwriting existing values. This preserves compensation history and enables payroll analytics while keeping a single source of truth.

Detailed schema definitions are documented in the Prisma schema and migration files.

---

# 6. API Design Principles

The backend exposes RESTful APIs with consistent request and response formats.

Key principles include:

- Resource-oriented endpoints
- Stateless communication
- Standard HTTP status codes
- Server-side pagination
- Filtering, sorting, and searching
- Consistent error responses

Detailed endpoint specifications will be maintained alongside the implementation.

---

# 7. Validation Strategy

Validation is performed at multiple layers.

- Client-side validation provides immediate user feedback.
- Server-side validation ensures all incoming requests satisfy business rules.
- Database constraints enforce referential integrity and uniqueness.

Zod is used for request validation before business logic execution.

---

# 8. Performance Considerations

The application is designed for approximately 10,000 employee records.

Performance strategies include:

- Server-side pagination
- Database indexing
- Database-side filtering and sorting
- SQL aggregation for analytics
- Batched seed operations
- React Query caching (frontend)

SQLite is sufficient for the expected workload while minimizing operational complexity.

---

# 9. Deployment Strategy

## Local Development

The application runs locally using Docker Compose.

Services:

- Backend API
- Frontend
- SQLite database volume

This enables the complete application to start with a single command.

---

## Hosted Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | SQLite bundled with backend |

Environment variables are used to configure API endpoints across environments.

---

# 10. Alternatives Considered

## Next.js Full-Stack Application

A single Next.js application using API Routes or Server Actions was considered.

This approach was not selected because it introduces tighter coupling between the frontend and backend and makes architectural boundaries less explicit.

A separate React frontend and Express backend better demonstrate API design, layered architecture, and independent testing.

---

# 11. Engineering Decisions

### SQLite

Chosen because it satisfies the project's scale while keeping setup simple.

### Prisma

Chosen for type-safe queries, migrations, and improved developer experience.

### Layered Architecture

Improves separation of concerns and allows business logic to be tested independently of HTTP and database layers.

### Salary History

Compensation changes are stored as append-only history records rather than updating existing values. This preserves historical salary information and supports payroll analytics without implementing a full audit logging system.

### Lookup Tables

Departments and Countries are modeled as lookup tables to ensure consistent filtering, reporting, and data integrity.

---

# 12. Future Enhancements

The current architecture intentionally keeps the application simple while allowing future expansion.

Potential enhancements include:

- Authentication and authorization
- Role-based access control
- Excel import/export
- Payroll processing
- Notifications
- PostgreSQL migration
- CI/CD pipeline
- Audit logging