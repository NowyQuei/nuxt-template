import { getUserById } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/[id].get.ts')
  const userId = event.context.params?.id

  // ! Both ifs are used here in a user friendly way to return the correct error message. This should be avoided in production because it can leak information about the system (security risk).
  if (!userId) {
    return createApiError(event, {
      code: 'missing_user_id',
      message: 'User ID is required in the path.'
    })
  }

  const session = await getUserSession(event)

  if (session?.user?.role !== 'admin' && session?.user?.id !== userId) {
    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized to get this user.',
      status: 403
    })
  }

  const user = await getUserById(userId)

  if (user === null) {
    return createApiError(event, {
      code: 'user_not_found',
      message: `User with ID '${userId}' was not found.`,
      status: 404
    })
  }

  return createApiSuccess(event, {
    status: 200,
    data: user
  })
})
