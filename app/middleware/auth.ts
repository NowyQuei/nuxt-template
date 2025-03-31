export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, session } = useUserSession()

  // Redirect unauthenticated users to home page
  if (!loggedIn.value) {
    return navigateTo('/')
  }

  const userRole = session.value?.user?.role

  // **Map Roles to Their Allowed Routes**
  const roleRoutes: Record<string, string[]> = {
    public: publicRoutes,
    user: userRoutes
  }

  // **Check if user has access to the current route**
  if (!roleRoutes[userRole]?.includes(to.path)) {
    return navigateTo('/') // Redirect unauthorized users
  }
})
