# 🚀 Nuxt 3 Starter Template (MongoDB + Auth Ready)

A modern, scalable **Nuxt 3 starter template** with MongoDB integration, authentication middleware, and reusable UI. Designed for maintainable projects and real-world apps — not just demos.

---

## ✅ What's Included

- 🔐 **User registration** with optional passkey setup (WebAuthn ready)
- 🛡️ **Authentication system** with role-based page & API protection
- 🌍 **Global middleware** for route access control
- 🔄 **MongoDB integration** (via Mongoose)
- 🎨 **Dark mode** support (toggle + persisted)
- 🧱 Component-based structure (`FormUser`, `TableUsers`, etc.)
- 🐳 Docker setup for local MongoDB

---

## ✨ Features

- 🧩 Modular folder structure (Nuxt 4 style)
- 📅 Birthday date picker with `dayjs`
- 🔐 Password strength enforcement
- ⚖️ Username & email availability checks
- ✅ Fully typed with `zod` (validation + inference)
- 📄 Server middleware protects `/api/*` routes
- 🧠 Reusable logic via `composables/`
- 🗂 Role-based access via `auth.global.ts`

---

## 🛡️ Auth & Access Control

Authentication and authorization are **built-in** and enforced via:

| File                              | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `app/middleware/auth.global.ts`   | Protects all pages based on user role |
| `server/middleware/auth.ts`       | Protects all API routes on the server |
| `shared/utils/protectedRoutes.ts` | Defines accessible routes per role    |

Roles:

- `public` – can access `/`, `/registration`
- `user` – can access `/settings` and own API endpoints
- `admin` – full access to all frontend pages and APIs

---

## 📦 Packages Used

| Package                   | Reason                                     |
| ------------------------- | ------------------------------------------ |
| `nuxt`                    | Core Nuxt 3 framework                      |
| `zod`                     | Schema-based form & API validation         |
| `uuid`                    | Generate UUIDs for mock user data          |
| `@nuxt/ui`                | UI components with Tailwind CSS            |
| `@nuxt/image`             | Optimized image handling                   |
| `@nuxt/fonts`             | Font management                            |
| `@nuxt/icon`              | Built-in icon set integration              |
| `@nuxt/device`            | Device type detection                      |
| `@nuxt/scripts`           | Run scripts during Nuxt lifecycle          |
| `@nuxt/test-utils`        | Nuxt testing utilities                     |
| `dayjs-nuxt`              | Lightweight date handling                  |
| `compodium`               | Markdown-driven UI/component documentation |
| `vue` / `vue-router`      | Core Vue 3 + routing                       |
| `typescript`              | Type safety and DX improvements            |
| `mongoose`                | Package to work with mongodb               |
| `nuxt-auth-utils`         | Hybrid auth/session handling               |
| `@internationalized/date` | Precise calendar date support              |
| `@simplewebauthn/server`  | WebAuthn support                           |

---

## 📂 Project Structure

```
.
├── app/                                # Frontend app code
│   ├── pages/                          # Routes (e.g., /settings, /users/[id]/edit)
│   ├── components/                     # UI & form components
│   ├── composables/                    # Composable logic
│   ├── middleware/                     # Route guards (e.g. auth.global.ts)
├── server/                             # Server logic
│   ├── api/                            # API routes
│   ├── middleware/                     # Server-side access control
│   ├── models/                         # Mongoose schemas
│   ├── services/                       # Business logic layer
├── shared/                             # Zod schemas, protectedRoutes, utils
├── public/                             # Static files
├── docker-compose.yml                  # MongoDB container
├── nuxt.config.ts                      # Nuxt config
```

---

## 🧪 Quick Start

### With Docker (Nuxt + MongoDB)

```bash
npm run dev-local
```

→ Runs Nuxt app and MongoDB in Docker.

### Without Docker

```bash
npm run dev
```

→ Requires MongoDB running locally or via Atlas.

---

## 🔐 Auth Logic

User sessions are handled via `nuxt-auth-utils` (hybrid mode). Pages and API routes are protected based on roles:

- Global middleware auto-applies access control
- Admins have full access by default
- Regular users have access to their own data and `/settings`

---

## 📡 Example API Endpoints

| Method | Endpoint                        | Description                 |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/api/users`                    | List all users (admin only) |
| GET    | `/api/users/:id`                | Get user details            |
| PATCH  | `/api/users/:id`                | Update user info            |
| DELETE | `/api/users/:id`                | Delete user (admin only)    |
| POST   | `/api/auth/signup`              | Create a new user           |
| POST   | `/api/users/check-availability` | Check email/username        |

---

## 🌓 Dark Mode

Toggles via `ColorModeButton.vue` and persists between sessions.

---

## ⚠️ Notes

- Passkey support (WebAuthn) is included but optional
- Intended as a **near-production ready** base, not just a demo
- Minimal dependencies — no bloated UI kits
- Default MongoDB URI: `mongodb://localhost:27017/nuxt-template`

---

## 🧡 Built with Nuxt 3, Tailwind CSS, and ❤️
