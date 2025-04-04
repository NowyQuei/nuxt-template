# 🚀 Nuxt 3 Starter Template

> ⚠️ The `master` branch is a **Work In Progress**.  
> Check other branches for finalized starter templates.

---

## ✅ Currently Implemented

- reusable user registration form
- Form validation using **Zod**
- Password strength validation
- Reusable UI components (`PasswordInput`, `Card`, etc.)
- Dark mode toggle (`UiColorModeButton`)
- Global toast composable (`useAppToast`)
- New **Nuxt 4 folder structure** (`app/`, `server/`, `shared/`, etc.)
- MongoDB integration
- Schema validation
- Authentication (username + password - with hashing)
- Authentication (passkey)
- Page protection (global middleware with user role check)
- Basic RBAC

---

## 🔧 Work in Progress

- WebSockets
  maybe:
- Global state management using **Pinia**

---

## 📦 Installed Packages & Why

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

## 🧪 Local Development without DB

```bash
npm install
npm run dev
```

## 🧪 Local Development with DB

> 🐳 Requires **Docker to be installed and running**.

```bash
npm install
npm run dev-local
```

---
