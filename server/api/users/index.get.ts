import { getUsers } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/index.get.ts')

  const session = await getUserSession(event)

  if (session?.user?.role !== 'admin') {
    logger.warn(`Unauthorized access attempt by user ${session?.user?.id}`)
    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized.',
      status: 403
    })
  }

  try {
    logger.debug('Fetching all users...')
    const users = await getUsers()
    logger.success(`Fetched ${users.length} users`)

    return createApiSuccess(event, {
      status: 200,
      data: users,
      message: 'Users retrieved successfully.'
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
