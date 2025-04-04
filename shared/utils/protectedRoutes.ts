// Public pages that anyone can access (no login required)
export const publicFrontendRoutes = ['/', '/registration']

// Authenticated user frontend pages
export const userFrontendRoutes = [...publicFrontendRoutes, '/settings']

// Routes accessible without auth on the API (server) level
export const guestServerRoutes = [
  '/', // sanity fallback
  '/api/auth/login',
  '/api/auth/signup',
  '/api/users/check-availability',
  '/api/webauthn/register',
  '/api/webauthn/authenticate'
]

// Public API endpoints
export const publicServerRoutes = [...guestServerRoutes]

// API routes available to logged-in users (non-admin)
export const userServerRoutes = [
  ...publicServerRoutes,
  '/api/users/me',
  '/api/users/:id',
  '/api/passkeys/:id',
  '/api/passkeys'
]

// Built-in Nuxt routes (e.g., _auth, icons)
export const buildInRoutes = ['/api/_auth/session', '/api/_nuxt_icon']

// Convenience exports
export const guestRoutes = [...guestServerRoutes]
export const publicRoutes = [...publicFrontendRoutes, ...publicServerRoutes]
export const userRoutes = [...userFrontendRoutes, ...userServerRoutes]

// API routes that may require dynamic validation
export const genericUserRoutes = ['/api/users', '/api/passkeys']
