# finledger-api

A production-style backend for a **Finance Dashboard System** built with
Bun, Express, TypeScript, Prisma, and PostgreSQL. Supports role-based access
control, financial record management, dashboard analytics, audit logging,
CSV/Excel export, and Swagger documentation.

---

## Live Demo

- API Base URL: <deployed-link>
- Swagger: <deployed-link>/docs

---

## Tech Stack

- **Runtime**: Bun (Node.js compatible)
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (Access Token)
- **Validation**: Zod
- **Docs**: Swagger UI

---

## Project Structure

```
src/
├── config/             # DB connection, permissions config
├── middleware/         # auth, RBAC, validation, error handler
├── modules/
│   ├── auth/           # login, register
│   ├── user/           # user management
│   ├── record/         # financial records CRUD + export
│   └── dashboard/      # summary, trends, categories, recent
├── utils/              # ApiResponse, auditLogger, helpers
├── app.ts              # express app setup (middleware, routes)
└── server.ts           # entry point (starts the server)

generated/
└── prisma/             # Prisma generated client
prisma/
├── schema.prisma
└── seed.ts
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/finledger-api.git
cd finledger-api
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/finledger"
JWT_SECRET="your_jwt_secret_here"
PORT=3000
```

### 4. Run database migrations

```bash
bunx prisma migrate dev --name init
```

### 5. Seed the database

```bash
bunx prisma db seed
```

This creates 3 users with hashed passwords:

| Email            | Password    | Role    |
| ---------------- | ----------- | ------- |
| admin@test.com   | password123 | ADMIN   |
| analyst@test.com | password123 | ANALYST |
| viewer@test.com  | password123 | VIEWER  |

### 6. Start the server

```bash
# Development
bun dev

# Production
bun run build && bun start
```

### 7. View API docs (SWAGGER)

```
http://localhost:3000/docs
```

---

## API Overview

### Auth

| Method | Endpoint           | Description    | Access |
| ------ | ------------------ | -------------- | ------ |
| POST   | /api/v1/auth/login | Login, get JWT | Public |

### Users

| Method | Endpoint          | Description                      | Access |
| ------ | ----------------- | -------------------------------- | ------ |
| POST   | /api/v1/users     | Create a new user                | Admin  |
| GET    | /api/v1/users     | List all users                   | Admin  |
| PATCH  | /api/v1/users/:id | Update user (name, role, status) | Admin  |

**Query params for GET /api/v1/users:**

- `role` — filter by role: `VIEWER`, `ANALYST`, `ADMIN`
- `status` — filter by status: `ACTIVE`, `INACTIVE`

### Financial Records

| Method | Endpoint               | Description                    | Access         |
| ------ | ---------------------- | ------------------------------ | -------------- |
| POST   | /api/v1/records        | Create a record                | Admin, Analyst |
| GET    | /api/v1/records        | List records (paginated)       | Admin, Analyst |
| GET    | /api/v1/records/:id    | Get record by ID               | Admin, Analyst |
| PATCH  | /api/v1/records/:id    | Update a record                | Admin          |
| DELETE | /api/v1/records/:id    | Soft delete a record           | Admin          |
| GET    | /api/v1/records/export | Export records as CSV or Excel | Admin, Analyst |

**Query params for GET /api/v1/records:**

- `type` — `INCOME` or `EXPENSE`
- `category` — e.g. `SALARY`, `FOOD`, `TRANSPORT`, etc.
- `startDate` — ISO date string
- `endDate` — ISO date string
- `page` — page number (default: 1)
- `limit` — records per page (default: 10, max: 100)

**Query params for GET /api/v1/records/export:**

- Same filter params as GET /api/v1/records — export respects active filters
- format — `csv` (default) or `excel`

**Available Categories (ENUM):**

`SALARY` `FREELANCE` `INVESTMENT` `RENT` `FOOD`
`TRANSPORT` `UTILITIES` `HEALTHCARE` `ENTERTAINMENT` `EDUCATION` `OTHER`

### Dashboard

| Method | Endpoint                     | Description                         | Access    |
| ------ | ---------------------------- | ----------------------------------- | --------- |
| GET    | /api/v1/dashboard            | All summary data in one call        | All roles |
| GET    | /api/v1/dashboard/summary    | Total income, expenses, net balance | All roles |
| GET    | /api/v1/dashboard/categories | Category-wise income/expense totals | All roles |
| GET    | /api/v1/dashboard/recent     | 5 most recently added records       | All roles |
| GET    | /api/v1/dashboard/trends     | Monthly or weekly trends            | All roles |

**Query params for GET /api/v1/dashboard/recent:**

- `limit` — `5` (default) or `capped at max 20`

**Query params for GET /api/v1/dashboard/trends:**

- `period` — `monthly` (default) or `weekly`

---

## Role & Permission Model

### User Module

Create User → Admin
Get Users → Admin
Update User → Admin
Update Role → Admin
Update Status → Admin

### Records Module

Create Record → Admin  
Update Record → Admin  
Delete Record → Admin (soft delete)  
Get All Records → Analyst + Admin  
Get One Record → Analyst + Admin  
Export Records → Analyst + Admin

### Dashboard Module

Get Summary (income/expense/net) → Viewer + Analyst + Admin
Get Category Breakdown → Viewer + Analyst + Admin
Get Recent Activity → Viewer + Analyst + Admin
Get Trends (monthly/weekly) → Analyst + Admin

---

## Data Model

### FinancialRecord

| Field     | Type     | Notes                          |
| --------- | -------- | ------------------------------ |
| id        | UUID     | Primary key                    |
| amount    | Decimal  | 12,2 precision — no float      |
| type      | Enum     | `INCOME` or `EXPENSE`          |
| category  | Enum     | `SALARY`, `FOOD`, `RENT`, etc. |
| date      | DateTime | Actual transaction date        |
| notes     | String?  | Optional description           |
| isDeleted | Boolean  | Soft delete flag               |
| userId    | UUID     | Owner of the record            |

### User

| Field        | Type   | Notes                         |
| ------------ | ------ | ----------------------------- |
| id           | UUID   | Primary key                   |
| name         | String |                               |
| email        | String | Unique                        |
| passwordHash | String | bcrypt hashed, never returned |
| role         | Enum   | `VIEWER`, `ANALYST`, `ADMIN`  |
| status       | Enum   | `ACTIVE`, `INACTIVE`          |

### AuditLog

Every create, update, and delete on users and records is logged with the acting user's ID, the affected entity, and a metadata diff of old vs new values.

---

## Assumptions

- Categories are predefined enums
- Single-tenant system (no org-level separation)
- JWT auth without refresh tokens (kept simple)

---

## Design Decisions

**Recent activity uses `createdAt` not `date`**
`GET /dashboard/recent` orders by `createdAt` (when the record was entered into the system) rather than the transaction `date`. This reflects actual system activity — if 10 January records are bulk-imported today, those are the recent activity. A finance dashboard feed should show what just happened in the system, not the oldest transaction date.

**Category is an enum, not a free-text field**
Categories are defined as a PostgreSQL enum (`SALARY`, `FOOD`, `TRANSPORT`, etc.) for data consistency and query performance. The tradeoff is reduced flexibility for custom categories. This would be migrated to a `Category` table in a production system.

**Soft delete over hard delete**
Records are never physically deleted — `isDeleted: true` is set instead. This preserves audit trails and allows recovery. All queries filter `isDeleted: false` by default.

**`PATCH /users/:id` handles role and status**
Role assignment and status management go through the same `PATCH /users/:id` endpoint. Separate endpoints (`/role`, `/status`) were considered but removed — all three operations are admin-only with no permission differentiation, so a single update endpoint keeps the API clean without losing any control.

**Fire-and-forget audit logging**
Audit logs are written asynchronously and errors are caught with `.catch(console.error)`. Audit failures should never block the main response — the user's operation succeeds regardless.

**Decimal for money**
`Decimal(12, 2)` is used for the `amount` field instead of `Float`. Floating point arithmetic is unsuitable for financial data due to precision errors.

**Trends aggregate in the DB, not in JS**
`getTrendsService` uses Prisma `groupBy` to aggregate at the database level, then groups by month/week in JS. This avoids loading all records into memory and scales correctly with large datasets.

**`GET /dashboard` — Single Combined Endpoint**
Instead of making the frontend call 4 separate dashboard endpoints, `GET /dashboard` runs all of them in parallel via `Promise.all` and returns everything in one response. Reduces round trips and keeps the frontend implementation simple.

---

## Optional Enhancements Implemented

| Enhancement           | Details                                                    |
| --------------------- | ---------------------------------------------------------- |
| JWT Authentication    | Access token on login, required on all protected routes    |
| Pagination            | `page` + `limit` on `GET /records`, capped at 100          |
| Soft delete           | `isDeleted` flag on all financial records                  |
| Audit logging         | Full create/update/delete trail with metadata diffs        |
| CSV or Excel export   | GET /api/v1/records/export → Export records (CSV or Excel) |
| Swagger docs          | Available at `/docs`                                       |
| User filtering        | `GET /users?role=ADMIN&status=ACTIVE`                      |
| Weekly/monthly trends | `GET /dashboard/trends?period=weekly`                      |

---

## Error Response Format

All API errors follow a consistent top-level structure:

```json
{
  "success": false,
  "data": null,
  "error": {}
}
```

---

### Error Types

#### 1. Validation Errors

Returned when request input fails schema validation.

```json
{
  "success": false,
  "data": null,
  "error": [
    {
      "field": "amount",
      "message": "Amount must be a number"
    }
  ]
}
```

- `error` is an **array**
- Each item represents a specific field issue

---

#### 2. Business / Application Errors

Returned when a valid request fails due to business rules.

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "You cannot deactivate yourself"
  }
}
```

- `error` is a **single object**
- No `field` since it’s not tied to a specific input

---

### Error Type Definition

```ts
export type ErrorMessage = {
  field?: string;
  message: string;
};
```

---

### Status Codes

| Status Code | Description                               |
| ----------- | ----------------------------------------- |
| 400         | Validation error or bad input             |
| 401         | Missing or invalid JWT                    |
| 403         | Authenticated but insufficient permission |
| 404         | Resource not found                        |
| 500         | Unexpected server error                   |

---

## Possible Improvements

- Refresh tokens
- Email reports (daily/weekly)
- Budget tracking
- Rate limiting
- Unit & integration tests
- Multi-tenant support

## Example Flow

1. Login → `/auth/login`
2. Copy token
3. Authorize in Swagger
4. Test:
   - Users
   - Records
   - Dashboard
   - Export

---
