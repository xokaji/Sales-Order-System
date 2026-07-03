# Sales Order System

A simple Sales Order app with two screens:

- **Home** – list of all sales orders (sortable table)
- **Sales Order** – create/edit an order (pick customer, add items, auto calculates totals)

**Backend:** .NET 8 Web API (Clean Architecture) + EF Core + SQL Server
**Frontend:** React + Redux Toolkit + Tailwind CSS

---

## How to run it

### 1. Backend

Requirements: .NET 8 SDK, SQL Server LocalDB

```bash
cd src/SalesOrderApp.API
dotnet restore
dotnet tool install --global dotnet-ef      # first time only
dotnet ef migrations add InitialCreate --project ../SalesOrderApp.Infrastructure --startup-project .
dotnet run
```

API runs at `http://localhost:5203` — Swagger docs at `http://localhost:5203/swagger`.
Demo customers/items are seeded automatically on first run.

### 2. Frontend

Requirements: Node.js 18+

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

**Env file:** `client/.env`

VITE_API_BASE_URL=`http://localhost:xxxx/api`

Change the port here if your backend runs on a different one (check the port `dotnet run` prints).

---

## Notes

- please run `dotnet build` locally to confirm it compiles before submitting.

