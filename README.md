# Base App

Full-stack base application derived from the inmobiliaria template. It includes:

- **Frontend:** Vite + React, Tailwind, shadcn-style UI, sidebar + dashboard with menu cards, Landing (placeholder copy), Login, user management (Usuarios), and Statistics (login counts).
- **Backend:** Fastify + TypeORM, MySQL, JWT auth, user CRUD, and a stats endpoint for "logins in the app."

No properties, brokers, chat, or agent applications — only the core stack and the features above.

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # if you have one; otherwise set DB_* and JWT_SECRET
npm install
npm run dev
```

Default port: `3000`. Ensure MySQL is running and the database exists (e.g. `base_app`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` (or `VITE_API_IP`) in `.env` to your backend URL (e.g. `http://localhost:3000`).

## Environment (backend)

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (default: `base_app`)
- `JWT_SECRET`
- `PORT` (default: 3000)
- `CORS_ORIGIN` (optional, comma-separated)

## Features

- **Auth:** Login, logout, optional register; JWT + cookie; `GET /auth/profile`.
- **Users:** List, create, edit users (Usuarios page); table components and modals.
- **Statistics:** Logins in the app — backend records each login in `login_logs`; `GET /stats/logins` returns counts by month and total; Statistics page shows an area chart and total.
- **Landing:** Placeholder text and structure; no "Explorar" link.
- **UI:** ImageViewer (yet-another-react-lightbox), table components, MenuCard grid, sidebar with `menuItems` pattern for easy extension.

## Database

With `synchronize: true` (e.g. in development), TypeORM creates:

- `users` — id, email, password, first_name, last_name, role, phone, description, license, broker_id, created_at, updated_at
- `login_logs` — id, user_id, created_at
