# GrowthHub Vue — Agent Context

This file gives Claude instant project context at the start of every conversation.
Read this before touching any code.

---

## What this project is

**GrowthHub** is a Georgian government business-support platform (`growthhub.gov.ge`).
This repo (`growthub-vue`) is a **Vue 3 + Vite** SPA that replaces the original Laravel/Blade frontend.

- The **old Laravel project** at `C:\Users\pc\Desktop\workspace\work\growthhub` is **read-only reference** — never modify it.
- The Vue project is the active codebase. All new work goes here.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 (Composition API, `<script setup>`) |
| Build | Vite 7 |
| State | Vuex 4 + composables (`useAuth`) |
| HTTP | Axios — proxied via Vite to NestJS |
| Routing | Custom hash-based router in `src/App.vue` (no Vue Router) |
| Backend | **NestJS** at `http://localhost:3000` |
| Auth | JWT Bearer token |

---

## Project Structure

```
src/
  api/
    http.js          ← axios instance, JWT interceptor, 401 handler
    auth.js          ← auth API methods (login, register, forgotPassword, me, logout)
  composables/
    useAuth.js       ← reactive auth state, localStorage persistence, real API calls
  components/
    website/         ← all public-facing pages (~30 components)
    crm/             ← CRM workspace pages (~20 components), role-gated
  data/              ← mock data files (programs, events, etc.) — to be replaced with API calls
  assets/
    main.css         ← all styles (single file)
  App.vue            ← hash router, CRM guard, fetchMe on mount
  main.js            ← app entry
```

---

## Auth System

**JWT flow:**
1. User submits login form in `AuthModal.vue`
2. `useAuth.login(email, password)` calls `POST /auth/login`
3. NestJS returns `{ access_token, user: { id, name, email, role } }`
4. Token stored in `localStorage('auth_token')`, user in `localStorage('auth_user')`
5. Axios interceptor auto-attaches `Authorization: Bearer <token>` to every request
6. On 401 → token cleared, user redirected to `#/`
7. On page refresh → `fetchMe()` re-validates token against `GET /auth/me`

**CRM roles:** `user` | `central` | `bank`
Each role has its own CRM namespace and default route (see `src/data/crm.js`).

**Demo login** (development only) is preserved in `AuthModal.vue` — sets a fake token.

---

## NestJS API — Assumed Endpoints

Adjust in `src/api/auth.js` if the actual routes differ:

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ access_token, user }` |
| POST | `/auth/register` | `{ userType, email, password, phone, region, ... }` | `{ access_token?, user? }` |
| POST | `/auth/forgot-password` | `{ companyId, phone }` | `{ message }` |
| GET | `/auth/me` | — (Bearer) | `{ id, name, email, role, ... }` |
| POST | `/auth/logout` | — (Bearer) | `{ message }` |

---

## Migration Status

### Public pages — DONE (visual only, mock data)
- Home, Programs, Events, Animations, Contact
- Agency, Search, Support, About, FAQ, Team, Partners
- Auth modal: login / register / password recovery

### CRM pages — IN PROGRESS
- Shell + role switch: done
- `user/*`, `central/*`, `bank/*` pages: visual done, not yet API-connected

### Integration — IN PROGRESS
- ✅ Vite proxy `/api` → `http://localhost:3000`
- ✅ Axios instance with JWT interceptor
- ✅ `useAuth.js` — real login/register/forgotPassword/logout/fetchMe
- ✅ `AuthModal.vue` — wired to real API with loading + error states
- ⬜ Public pages: replace `src/data/*.js` mock files with real API calls
- ⬜ CRM pages: connect to real NestJS endpoints

---

## What Remains

1. **Public data API** — replace each `src/data/*.js` file with a matching `src/api/*.js` service and update page components to fetch on mount
2. **CRM API** — connect CRM pages to their NestJS endpoints (employees, companies, reports, messages, calendar, etc.)
3. **Form submissions** — event registration, contact form, support forms
4. **Error boundaries** — loading skeletons and empty states on all pages

---

## Important Rules

- Do **not** use Vue Router — routing is custom hash-based in `App.vue`
- Do **not** modify anything in the Laravel reference project
- All styles go in `src/assets/main.css` — no scoped `<style>` blocks unless necessary
- Georgian language strings stay in Georgian — do not translate UI text
- Keep the Demo login buttons in `AuthModal.vue` until real auth is confirmed working
