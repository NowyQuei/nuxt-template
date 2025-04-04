export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/me')

  try {
    const { user } = event.context

    if (!user) {
      logger.warn('Unauthorized access to /api/users/me')
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    logger.debug('Current user:', user)

    return createApiSuccess(event, {
      status: 200,
      data: user
    })
  } catch (error) {
    logger.error('Error in /api/users/me:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch current user'
    })
  }
})
