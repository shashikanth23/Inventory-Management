# Inventory Management System (Full-Stack)

A full-stack rebuild of the original Java Swing desktop app into a proper
client-server web application:

- **Backend:** Java 17, Spring Boot 3, Spring Security + JWT, Spring Data JPA, MySQL, Bean Validation, OpenAPI/Swagger docs
- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, React Router, Recharts, Axios

## What changed vs. the original

The original project was a single-machine Swing GUI that talked directly to
MySQL over JDBC, with hardcoded DB credentials, no authentication, no input
validation beyond parsing exceptions, and a `clearFields()` method that was a
no-op. This version turns it into a real client-server app:

| Area | Original | Now |
|---|---|---|
| Architecture | Monolithic desktop app, GUI calls DAO directly | REST API (Spring Boot) + separate SPA (React), talk over HTTP/JSON |
| Auth | None | JWT-based login, protected routes/endpoints |
| Validation | Try/catch around `Integer.parseInt` | Server-side Bean Validation with field-level error messages |
| Data | `id, name, category, quantity, price` | Adds `sku` (unique), `reorderLevel`, `createdAt`/`updatedAt`, low-stock flag |
| Search/filter | None | Keyword search + category filter + pagination, server-side |
| Reporting | None | Dashboard: total products, total units, inventory value, low-stock alerts, category breakdown chart |
| Errors | Stack traces to console | Centralized exception handling, structured JSON errors, HTTP status codes |
| Config | Hardcoded DB password in source | Externalized config via `application.properties` / env vars |
| Deployability | Runs only on a machine with a JVM + local MySQL + Swing | Backend deployable as a standalone JAR/API; frontend deployable as a static SPA to any host |

## Project layout

```
inventory-management-system/
├── backend/          Spring Boot REST API
├── frontend/          React + TypeScript SPA
├── docker-compose.yml Spins up MySQL only (app processes run natively)
└── README.md
```

## Running it locally

### 1. Start MySQL

```bash
docker compose up -d
```

This starts MySQL 8 on `localhost:3306` with database `inventorydb`
(root / `your_password` — change this in `docker-compose.yml` and
`backend/src/main/resources/application.properties` before doing anything
beyond local dev). Alternatively, point `application.properties` at any
MySQL instance you already have running.

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

(Requires Maven and JDK 17+ installed. Add the Maven wrapper with
`mvn -N wrapper:wrapper` if you'd rather not install Maven globally.)

The API starts on `http://localhost:8080`. On first boot it seeds a default
admin user:

```
username: admin
password: admin123
```

Swagger UI (interactive API docs): `http://localhost:8080/swagger-ui.html`

Set a real JWT secret in production via the `APP_JWT_SECRET` environment
variable rather than the default in `application.properties`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and proxies `/api` calls to the
backend on port 8080 (see `vite.config.ts`). Log in with the seeded admin
credentials above.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate, returns a JWT |
| GET | `/api/products` | Paginated list, supports `keyword`, `category`, `page`, `size`, `sort` |
| GET | `/api/products/{id}` | Get one product |
| GET | `/api/products/categories` | Distinct category list |
| GET | `/api/products/dashboard` | Aggregate stats for the dashboard |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

All `/api/products/**` endpoints require `Authorization: Bearer <token>`
except where noted above.

## Possible next steps

- Role-based permissions (viewer vs. admin) instead of a single admin role
- Audit log of stock changes (who changed what, when)
- CSV import/export for bulk stock updates
- Unit/integration tests (JUnit + Mockito for the backend, Vitest + React Testing Library for the frontend)
- CI pipeline (GitHub Actions) running build + tests on push
- Containerize the backend and frontend themselves, not just MySQL
