import { getUsers } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('GET /api/users')
  const session = await getUserSession(event)

  if (session?.user?.role !== 'admin') {
    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized.',
      status: 403
    })
  }

  try {
    const users = await getUsers()

    return createApiSuccess(event, {
      data: users
    })
  } catch (error) {
    logger.error('Error fetching users:', error)

    return createApiError(event, {
      code: 'internal_error',
      message: 'Failed to load users',
      status: 500
    })
  }
})
