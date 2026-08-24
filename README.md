# Base App

Starter monorepo: **React + Vite** frontend, **Fastify + TypeORM + MySQL** backend.

Includes auth, roles, app shell (sidebar/navbar), landing page, dashboard, and user CRUD — without domain-specific features.

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

- Frontend: http://localhost:4175  
- Backend: http://localhost:3005  

Create an admin user via `/register`, then set `role = 'admin'` in the database (or use your seed script).

## Rename / rebrand checklist

Replace **Base App** / **base-app** with your product name:

| What | Where |
|------|-------|
| App title | `frontend/index.html` |
| Package names | `package.json`, `frontend/package.json`, `backend/package.json` |
| Branding text | `frontend/src/components/layout/AppSidebar.tsx`, `AppNavbar.tsx`, `AuthCard.tsx`, `Landing*.tsx` |
| Page meta fallback | `frontend/src/lib/pageMeta.ts` |
| Theme localStorage key | `frontend/src/lib/theme.ts` → `STORAGE_KEY` |
| Dev HTTPS cert CN | `frontend/scripts/gen-dev-cert.js` |
| DB name | `backend/.env` → `DB_NAME`, `backend/docker-compose.yml` |
| SSO app id | `backend/.env` → `SSO_APP_ID`, `backend/src/controllers/auth.controller.ts` |
| JWT/cookie fallbacks | `backend/src/app.ts` |
| Folder name | Rename repo directory when rebranding |

Search the repo for `Base App`, `base-app`, and `base_app` to catch anything missed.

## What's included

**Frontend**
- Landing, login, register, SSO callback
- Protected routes + role guards (`admin`, `staff`, `supervisor`, `user`)
- App shell (sidebar, navbar, theme toggle)
- Dashboard with stat cards
- User directory table (create / edit / archive / restore)
- shadcn/ui components, motion effects, toast provider

**Backend**
- JWT auth (cookie + bearer)
- User entity + CRUD
- Profile photo uploads
- SSO login hook (`SSO_SHARED_SECRET`, `SSO_APP_ID`)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Backend + frontend concurrently |
| `npm run dev:https` | HTTPS frontend (for mobile/LAN testing) |
| `npm run build` | Production build both |
| `npm run start` | Run compiled backend |

## Project structure

```
base-app/
├── frontend/src/
│   ├── components/   # UI, auth, layout, landing
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

## Adding your domain

1. Add entities in `backend/src/entities/`
2. Register them in `backend/src/config/database.ts`
3. Add routes/controllers/services
4. Add frontend pages + nav items in `frontend/src/lib/navigation.ts`
5. Register routes in `frontend/src/App.tsx`
