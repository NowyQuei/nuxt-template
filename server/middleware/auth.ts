export default defineEventHandler(async (event) => {
  const path = event.path

  // 🛑 Only protect /api/* routes on the server side
  if (!path.startsWith('/api/')) return

  // ✅ Allow public or built-in routes
  if (publicRoutes.includes(path) || buildInRoutes.some((route) => path.startsWith(route))) {
    return
  }

  const session = await getUserSession(event)

  if (!session || !session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  event.context.user = session.user

  if (session.user.role === 'admin') return

  const isAllowed = userRoutes.some((route) => isMatchingProtectedRoute(route, path))

  if (session.user.role === 'user' && isAllowed) return

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
})
