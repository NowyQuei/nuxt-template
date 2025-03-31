export default defineEventHandler(async (event) => {
  // Allow unauthenticated access to public pages
  if (publicRoutes.includes(event.path)) {
    return // ✅ Allow access without authentication
  }

  const session = await getUserSession(event)
  if (!session || !session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  event.context.user = session.user // Attach user to request context

  if (session.user.role === 'user' && userRoutes.includes(event.path)) {
    return // ✅ Allow access for authenticated users
  }

  if (session.user.role === 'admin' && event.path.startsWith('/api/')) {
    return // ✅ Allow access for authenticated admins
  }

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
})
