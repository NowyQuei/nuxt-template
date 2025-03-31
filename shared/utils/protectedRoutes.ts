const publicFrontendRoutes = ['/', '/registration']
const userFrontendRoutes = [...publicFrontendRoutes, '/settings']

const guestServerRoutes = [
  '/',
  '/api/auth/login',
  '/api/users/check-availability',
  '/api/auth/signup',
  '/api/webauthn/register',
  '/api/webauthn/authenticate'
]
const publicServerRoutes = [...guestServerRoutes]
const userServerRoutes = [...publicServerRoutes, '/api/users/:id', '/api/users/me']

export const buildInRoutes = ['/api/_auth/session', '/api/_nuxt_icon']
export const guestRoutes = [...guestServerRoutes]
export const publicRoutes = [...publicFrontendRoutes, ...publicServerRoutes]
export const userRoutes = [...userFrontendRoutes, ...userServerRoutes]
export const genericUserRoutes = ['/api/users', '/api/passkeys']
