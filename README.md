# 🚀 Nuxt 3 Starter Template

This is a minimal yet functional **Nuxt 3 starter template** with:

- ✅ A **fake user registration form**
- ✅ Reusable, styled **UI components**
- ✅ Full **dark mode** support
- ✅ Simple, organized project structure
- ✅ Useful Nuxt modules & tools pre-installed

---

## ✨ Features

- 🔐 **Fake user registration** with form validation using Zod
- 🎨 **Dark mode toggle** with `UiColorModeButton`
- ♻️ **Reusable components** (`PasswordInput`, `Card`, `MainMenu`, etc.)
- 💬 **Global toast system** via `useAppToast`
- 📁 Structured for easy scaling (app/, server/, shared/, etc.)

---

## 📦 Installed Packages & Why

| Package              | Reason                                              |
| -------------------- | --------------------------------------------------- |
| `nuxt`               | Core Nuxt 3 framework                               |
| `zod`                | Schema-based form & API validation                  |
| `uuid`               | Generate UUIDs for mock user data                   |
| `@nuxt/ui`           | Modern Tailwind-based UI components                 |
| `@nuxt/image`        | Optimized image handling                            |
| `@nuxt/fonts`        | Easy integration of fonts                           |
| `@nuxt/icon`         | Simple icon management with built-in icon sets      |
| `@nuxt/device`       | Detect and adapt to different device types          |
| `@nuxt/scripts`      | Lifecycle hook scripting                            |
| `@nuxt/test-utils`   | Testing utilities for Nuxt apps                     |
| `dayjs-nuxt`         | Lightweight date utility (e.g., birthday selection) |
| `compodium`          | Markdown-driven documentation for components        |
| `vue` / `vue-router` | Vue 3 and routing support                           |
| `typescript`         | Static typing and DX improvements                   |

---

## 📂 Project Structure

This project follows the new folder structure proposed for **Nuxt 4**, where the `app/` directory replaces the traditional root placement of `pages/`, `components/`, and `assets/`.

```
.
├── app/                # Main Nuxt app files (pages, components, etc.)
│   ├── components/     # UI, form, and layout components
│   ├── composables/    # Reusable logic (toast, form state, etc.)
│   ├── pages/          # Nuxt pages (index, registration)
├── server/             # API routes & server utilities
├── shared/             # Shared types, helpers, logger, etc.
├── public/             # Static assets
├── nuxt.config.ts      # Nuxt configuration
├── package.json        # Dependencies & scripts
```

---

## 🧪 Quick Start

```bash
npm install
npm run dev -- -o
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 📧 User Registration Demo

Visit `/registration` to view the fake registration form with:

- 🔐 Password strength meter & validation
- 📅 Birthday selection using `dayjs`
- ✅ Zod validation on all form fields
- 🔔 Toast notifications on success/failure

---

## 🌓 Dark Mode

Click the **color mode toggle button** in the top-right corner to switch between light and dark themes.

---

## 📌 Notes

- This is a **starter** project: adapt it to your backend and authentication needs.
- Great for prototyping, experimenting with Nuxt 3, or creating your own boilerplate.
- ✅ Built on the **new Nuxt 4 folder structure**.

---

## 🧡 Built with Nuxt 3, Tailwind CSS, and ❤️
