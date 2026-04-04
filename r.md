# 💰 FinLedger API

A backend system for **finance data processing and access control**, built as part of a backend engineering assessment.

This project demonstrates clean backend architecture, role-based access control (RBAC), financial data handling, and dashboard analytics.

---

## 🚀 Tech Stack

* **Runtime**: Bun + TypeScript
* **Framework**: Express
* **ORM**: Prisma
* **Database**: PostgreSQL (Neon)
* **Auth**: JWT
* **Validation**: Zod
* **Docs**: Swagger
* **Export**: CSV + Excel

---

## 🧠 Features

### 🔐 Authentication

* JWT-based login
* Role embedded in token
* Protected routes with middleware

---

### 👤 User Management

* Create users
* Update user details
* Assign roles (VIEWER, ANALYST, ADMIN)
* Manage status (ACTIVE / INACTIVE)
* Prevent self-role change & self-deactivation

---

### 💸 Financial Records

* Create, update, delete (soft delete)
* Filter by:

  * Type (INCOME / EXPENSE)
  * Category
  * Date range
* Pagination support
* Data validation with Zod

---

### 📊 Dashboard APIs

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Recent activity
* Monthly / Weekly trends
* Combined dashboard endpoint

---

### 📤 Export

* Export records as:

  * CSV
  * Excel (.xlsx with formatting)
* Supports filters

---

### 🧾 Audit Logging

* Tracks:

  * CREATE / UPDATE / DELETE
* Entities:

  * USER
  * FINANCIAL_RECORD
* Stores metadata (old vs new data)

---

## 🔑 Role-Based Access Control (RBAC)

| Action         | Viewer | Analyst | Admin |
| -------------- | ------ | ------- | ----- |
| View Dashboard | ✅      | ✅       | ✅     |
| View Records   | ❌      | ✅       | ✅     |
| Create Record  | ❌      | ❌       | ✅     |
| Update Record  | ❌      | ❌       | ✅     |
| Delete Record  | ❌      | ❌       | ✅     |
| Manage Users   | ❌      | ❌       | ✅     |

---

## 📁 Project Structure

```
src/
 ├── modules/
 │    ├── auth/
 │    ├── user/
 │    ├── record/
 │    ├── dashboard/
 │
 ├── middleware/
 │    ├── auth.middleware.ts
 │    ├── role.middleware.ts
 │    ├── validation.middleware.ts
 │
 ├── utils/
 │    ├── ApiResponse.ts
 │    ├── auditLogger.ts
 │
 ├── config/
 │    ├── db.ts
 │    ├── permissions.ts
 │
 └── app.ts
```

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone <your-repo-url>
cd finledger-api
```

---

### 2. Install Dependencies

```bash
bun install
```

---

### 3. Setup Environment

Create `.env`:

```
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
```

---

### 4. Run Migrations

```bash
bunx prisma migrate dev
```

---

### 5. Seed Data

```bash
bunx prisma db seed
```

---

### 6. Start Server

```bash
bun run dev
```

---

## 📘 API Documentation

Swagger UI available at:

```
http://localhost:3000/docs
```

👉 Use **Authorize** button
👉 Enter: `Bearer <your_token>`

---

## 🧪 Example Flow

1. Login → `/auth/login`
2. Copy token
3. Authorize in Swagger
4. Test:

   * Users
   * Records
   * Dashboard
   * Export

---

## 🧩 Design Decisions

* **Service Layer Pattern** for separation of concerns
* **RBAC via Permissions Enum** (scalable approach)
* **Soft Delete for Records** to preserve history
* **Audit Logs** for traceability
* **Single Combined Dashboard Endpoint** for frontend efficiency

---

## ⚠️ Assumptions


---

## ✨ Possible Improvements

* Refresh tokens
* Email reports (daily/weekly)
* Budget tracking
* Rate limiting
* Unit & integration tests
* Multi-tenant support

---

## 🏁 Conclusion

This project focuses on:

* Clean backend design
* Proper access control
* Real-world financial data handling
* Maintainable and scalable structure

---

## 👨‍💻 Author

Harpalsinh Sindhav

---
