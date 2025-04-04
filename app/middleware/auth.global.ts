export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, session } = useUserSession()

  // ✅ Always allow public routes
  if (publicFrontendRoutes.includes(to.path)) return

  // ✅ Require login
  if (!loggedIn.value) {
    return navigateTo('/')
  }

  const role = session.value?.user?.role

  // ✅ Admin can access everything
  if (role === 'admin') return

  // ✅ Allow "user" role only to routes defined in userFrontendRoutes
  const isAllowedUserRoute = userFrontendRoutes.some((pattern) =>
    isMatchingProtectedRoute(pattern, to.path)
  )

  if (role === 'user' && isAllowedUserRoute) return

  // ❌ Block anything else
  return navigateTo('/')
})
