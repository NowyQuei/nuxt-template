const publicFrontendRoutes = ['/', '/registration']
const userFrontendRoutes = [...publicFrontendRoutes, '/settings']

const guestServerRoutes = [
  '/',
  '/api/auth/login',
  '/api/_auth/session',
  '/api/users/check-availability',
  '/api/auth/signup',
  '/api/webauthn/register'
]
const publicServerRoutes = [...guestServerRoutes]
const userServerRoutes = [...publicServerRoutes, '/api/users/me']

export const guestRoutes = [...guestServerRoutes]
export const publicRoutes = [...publicFrontendRoutes, ...publicServerRoutes]
export const userRoutes = [...userFrontendRoutes, ...userServerRoutes]
