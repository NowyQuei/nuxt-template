# 🚀 Nuxt 3 Starter Template (with MongoDB)

A minimal yet practical **Nuxt 3 starter template** with MongoDB integration. Focused on clean architecture, scalability, and sensible defaults.

### ✅ Included:

- Fake **user registration** (frontend + backend)
- **MongoDB integration**: create, list, delete users
- Full **dark mode** support
- Reusable UI components
- Scalable folder structure (Nuxt 4 style)
- Docker setup for local development with MongoDB

---

## ✨ Features

- 🔐 Registration form with Zod validation
- 📅 Birthday picker via `dayjs`
- ✅ Password strength check, username availability, toast notifications
- ♻️ Reusable components like `PasswordInput`, `Card`, `TableUsers`
- 🌗 Dark mode toggle via `ColorModeButton`
- 🔥 MongoDB CRUD for users (via Mongoose)
- 📁 Clear separation of app/server/shared code

---

## 📦 Packages Used (selected)

| Package              | Purpose                            |
| -------------------- | ---------------------------------- |
| `nuxt`               | Core framework                     |
| `zod`                | Form & API validation              |
| `uuid`               | Fake user ID generation            |
| `@nuxt/ui`           | Tailwind-based UI components       |
| `@nuxt/image`        | Image optimization                 |
| `@nuxt/fonts`        | Font integration                   |
| `@nuxt/icon`         | Icon management with built-in sets |
| `@nuxt/device`       | Device detection                   |
| `@nuxt/scripts`      | Lifecycle scripting                |
| `@nuxt/test-utils`   | Testing utilities                  |
| `dayjs-nuxt`         | Lightweight date library           |
| `mongoose`           | MongoDB ODM                        |
| `vue` / `vue-router` | Frontend framework and routing     |
| `typescript`         | Static typing and better DX        |

---

## 📂 Project Structure (Nuxt 4 style)

```
.
├── app/                # Frontend: pages, components, composables
│   ├── pages/          # Routes: /, /registration, /users
│   ├── components/     # UI, form, menu components
│   ├── composables/    # Reusable logic
├── server/             # API endpoints, DB models, services
│   ├── api/users/      # GET, POST, DELETE, availability check
│   ├── plugins/        # MongoDB plugin
│   ├── models/         # Mongoose schema
│   ├── services/       # User logic abstraction
├── shared/             # Types, utilities, logger
├── public/             # Static assets
├── docker-compose.yml  # Dockerized MongoDB for dev
├── nuxt.config.ts      # Nuxt config
```

---

## 🧪 Quick Start

### With MongoDB (Docker):

```bash
npm run dev-local
```

→ Starts Nuxt app **and** MongoDB in a Docker container.

### Without Docker (just the app):

```bash
npm run dev
```

→ You need to run MongoDB separately (e.g. local install or Atlas).

---

## 🔧 MongoDB Features

Available at `/users`:

- 👤 **Create user** via registration
- 📄 **List users** (`TableUsers`)
- ❌ **Delete users** (via button)

> Note: This is a mock/demo system — no real authentication.

---

## 🌓 Dark Mode

Top-right toggle button switches light/dark themes (`ColorModeButton.vue`). Settings are persisted automatically.

---

## 📡 Example API Endpoints

- `GET    /api/users` – List all users
- `POST   /api/users` – Create user
- `DELETE /api/users/[id]` – Delete user
- `GET    /api/users/check-availability` – Check username availability

---

## ⚠️ Notes

- No authentication – this is for demonstration purposes only.
- Intended as a dev boilerplate, not a production-ready app.
- Uses the proposed Nuxt 4 folder structure.
- MongoDB default connection: `mongodb://localhost:27017/nuxt-users`

---

## 🧡 Built with Nuxt 3, Tailwind CSS, and ❤️
