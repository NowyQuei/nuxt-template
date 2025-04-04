import { createUser } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/index.post.ts')
  const session = await getUserSession(event)

  if (session?.user?.role !== 'admin') {
    logger.warn(`Unauthorized user creation attempt by user ${session?.user?.id}`)
    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized.',
      status: 403
    })
  }

  try {
    logger.debug('Reading request body for user creation...')
    const body = await readBody(event)

    logger.debug('Creating user with provided data...')
    const user = await createUser(body)

    logger.success(`User created successfully: ${user.id}`)

    return createApiSuccess(event, {
      status: 201,
      data: user,
      message: 'User created successfully'
    })
  } catch (error: any) {
    logger.error('Unexpected error in user creation:', error)

    return createApiError(event, {
      code: error.cause ? 'validation_error' : 'internal_server_error',
      message: error.message || 'Something went wrong on our end.',
      status: error.cause ? 400 : 500,
      details: error.cause ?? null
    })
  }
})
