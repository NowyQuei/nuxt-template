import { getUserById } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/[id].get.ts')

  const userId = event.context.params?.id

  if (!userId) {
    logger.error('No user ID provided in path')
    return createApiError(event, {
      code: 'missing_user_id',
      message: 'User ID is required in the path.',
      status: 400
    })
  }

  try {
    const session = await getUserSession(event)

    if (session?.user?.role !== 'admin' && session?.user?.id !== userId) {
      logger.warn(`Unauthorized attempt by ${session?.user?.id} to access user ${userId}`)
      return createApiError(event, {
        code: 'unauthorized',
        message: 'You are not authorized to get this user.',
        status: 403
      })
    }

    logger.debug(`Looking up user ${userId}`)
    const user = await getUserById(userId)

    if (!user) {
      logger.debug(`User with ID '${userId}' not found`)
      return createApiError(event, {
        code: 'user_not_found',
        message: `User with ID '${userId}' was not found.`,
        status: 404
      })
    }

    logger.success(`User ${userId} retrieved successfully`)
    return createApiSuccess(event, {
      status: 200,
      data: user,
      message: 'User retrieved successfully.'
    })
  } catch (error) {
    logger.error('Unexpected error during user retrieval:', error)
    return createApiError(event, {
      code: 'internal_server_error',
      message: 'Failed to get user.',
      status: 500
    })
  }
})
