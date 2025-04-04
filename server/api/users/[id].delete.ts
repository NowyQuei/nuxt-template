import { deleteUser } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/[id].delete.ts')

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
      logger.warn(`Unauthorized delete attempt by user ${session?.user?.id} on user ${userId}`)
      return createApiError(event, {
        code: 'unauthorized',
        message: 'You are not authorized to delete this user.',
        status: 403
      })
    }

    logger.debug(`Attempting to delete user ${userId}`)
    const user = await deleteUser(userId)

    if (!user) {
      logger.debug(`User with ID '${userId}' not found`)
      return createApiError(event, {
        code: 'user_not_found',
        message: `User with ID '${userId}' was not found.`,
        status: 404
      })
    }

    logger.success(`User ${userId} deleted successfully`)
    return createApiSuccess(event, {
      status: 200,
      data: { id: userId },
      message: 'User deleted successfully.'
    })
  } catch (error) {
    logger.error('Unexpected error during user deletion:', error)
    return createApiError(event, {
      code: 'internal_server_error',
      message: 'Failed to delete user.',
      status: 500
    })
  }
})
