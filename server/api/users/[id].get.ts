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
