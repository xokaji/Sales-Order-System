# Architecture

## Backend (Clean Architecture)

```
src/
├── SalesOrderApp.Domain          // Entities
├── SalesOrderApp.Application     // DTOs, Services, Interfaces, Business Logic
├── SalesOrderApp.Infrastructure  // EF Core, SQL Server, Repositories
└── SalesOrderApp.API             // Controllers, Middleware, Swagger
```

### Dependency Flow

```
API
 ↓
Application
 ↓
Domain

Infrastructure → Implements Application Interfaces
```

The **Domain** project contains only business entities and has no dependencies on other projects.

### Request Flow

```
Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
EF Core
  ↓
SQL Server
```

---

# Data Model

```
Customer
    │
    ├──── SalesOrder ──── SalesOrderLine ──── Item
```

### Business Rules

* Selecting a **Customer** fills the address automatically.
* Entering an **Item Code** fills Description, Price, and Tax.
* Price and Tax are copied to the order line when it is created.
* All totals are calculated on the server.

---

# Frontend (React)

```
client/src/
├── app/
├── routes/
├── features/
│   ├── home/
│   └── salesOrder/
├── components/common/
└── services/
```

### State Management

* Redux Toolkit
* One slice per feature
* Each feature contains its own API calls and business logic
