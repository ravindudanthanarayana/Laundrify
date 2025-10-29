# Laundry Management Backend (Spring Boot + MySQL)

## Quick start
1. Create MySQL DB:
```sql
CREATE DATABASE laundrydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
2. Update `src/main/resources/application.properties` if your MySQL user/pass differ.
3. Build & run:
```bash
./mvnw spring-boot:run   # if wrapper exists, else: mvn spring-boot:run
```
Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

## Security
- HTTP Basic auth.
- Register a user: `POST /api/auth/register` with JSON:
```json
{ "name":"Admin", "email":"admin@x.com", "passwordHash":"admin123", "role":"ADMIN" }
```
Password is stored as BCrypt hash automatically.
- Use Basic Auth in client: username = email, password = chosen password.

## REST endpoints
- `/api/users` (ADMIN only): CRUD users
- `/api/orders` (ADMIN/STAFF/CS/FINANCE/DELIVERY for GET, others as annotated): CRUD orders
- `/api/tasks` (ADMIN/STAFF): CRUD tasks
- `/api/deliveries` (ADMIN/DELIVERY): CRUD deliveries
- `/api/invoices` (ADMIN/FINANCE): CRUD invoices

CORS allows `http://localhost:3000` by default.
