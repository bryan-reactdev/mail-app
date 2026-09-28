# Mail App

Monorepo: **React + Vite** frontend, **Fastify + TypeORM + MySQL** backend.

Auth, roles, app shell, dashboard, and user CRUD — cloned from [base-app](https://github.com/bryan-reactdev/base-app) without a public landing page.

## Quick start

```bash
# 1. Install dependencies
npm install --prefix backend
npm install --prefix frontend

# 2. Start MySQL (Docker)
cd backend && docker compose up -d

# 3. Configure env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Run dev (backend + frontend)
cd .. && npm run dev
```

- Frontend: http://localhost:4181  
- Backend: http://localhost:3007  
- MySQL (Docker): localhost:3310 → `mail-app-db`

Create an admin user via `/register`, then set `role = 'admin'` in the database.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Backend + frontend concurrently |
| `npm run dev:https` | HTTPS frontend (for mobile/LAN testing) |
| `npm run build` | Production build both |
| `npm run start` | Run compiled backend |

## Project structure

```
mail-app/
├── frontend/src/
│   ├── components/   # UI, auth, layout
│   ├── pages/        # Route pages
│   ├── lib/          # Auth, roles, navigation, theme
│   ├── stores/       # Zustand user store
│   └── dashboard/    # Dashboard building blocks
└── backend/src/
    ├── entities/     # TypeORM entities (User)
    ├── routes/       # API routes
    ├── controllers/
    ├── services/
    └── middlewares/  # Auth, roles, validation
```

## SSO / hub

Set `SSO_APP_ID=mail-app` and register the app in hub-app when wiring SSO.
