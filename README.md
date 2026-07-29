# Todo Webapp

A full-stack todo app with JWT authentication, an Express API, and PostgreSQL via Prisma. The frontend is a static HTML/CSS/JS client served by the same Node server.

## Stack

- **Runtime:** Node.js (ES modules)
- **Server:** Express 5
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** bcrypt password hashing, JWT (24h expiry)
- **Deploy/dev:** Docker Compose

## Features

- Register / login with username and password
- Create, list, update (complete), and delete todos
- Todos are scoped to the authenticated user
- New accounts get a default welcome todo

## Getting started

### Prerequisites

- Node.js 22+
- Docker and Docker Compose (recommended), or a local PostgreSQL instance

### Option A: Docker Compose

```bash
docker compose up --build
```

The app is available at [http://localhost:3000](http://localhost:3000). Postgres runs on port `5432`.

Apply migrations inside the app container if the schema is not yet applied:

```bash
docker compose exec app npx prisma migrate deploy
```

### Option B: Local development

1. Copy env vars into a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp
JWT_SECRET=your_jwt_secret
PORT=3000
```

2. Start Postgres (e.g. only the `db` service from Compose):

```bash
docker compose up db -d
```

3. Install dependencies and set up the database:

```bash
npm install
npx prisma migrate deploy
npx prisma generate
```

4. Start the server:

```bash
npm run dev
```

## API

Todo routes require an `Authorization` header with the JWT returned from register/login.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | No | Create account (`username`, `password`) → `{ token }` |
| `POST` | `/auth/login` | No | Log in → `{ token }` |
| `GET` | `/todos` | Yes | List current user's todos |
| `POST` | `/todos` | Yes | Create todo (`task`) |
| `PUT` | `/todos/:id` | Yes | Update completion (`completed`) |
| `DELETE` | `/todos/:id` | Yes | Delete todo |

Example requests are in [`todo-app.rest`](todo-app.rest).

## Project structure

```
├── public/           # Static frontend (HTML, CSS, JS)
├── prisma/           # Schema and migrations
├── src/
│   ├── server.js     # Express entrypoint
│   ├── prismaClient.js
│   ├── middleware/   # JWT auth middleware
│   └── routes/       # Auth and todo routes
├── docker-compose.yaml
└── Dockerfile
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with `--watch` and `.env` loaded |
| `npx prisma migrate deploy` | Apply migrations |
| `npx prisma studio` | Browse data in Prisma Studio |
