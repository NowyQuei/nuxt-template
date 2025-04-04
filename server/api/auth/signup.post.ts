import { createUser } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/auth/signup')

  const body = await readBody(event)

  if (!body) {
    logger.error('No request body provided')
    return createApiError(event, {
      code: 'request_error',
      message: 'Request body is empty or undefined',
      status: 400
    })
  }

  try {
    logger.debug('Creating new user...')
    const user = await createUser(body)

    const config = useRuntimeConfig()
    const maxAgeMs = (config.session.maxAge ?? 60 * 60 * 24 * 7) * 1000

    await setUserSession(event, {
      user,
      loggedInAt: new Date(),
      expiresAt: new Date(Date.now() + maxAgeMs)
    })

    logger.success(`User created and logged in: ${user.username}`)

    return createApiSuccess(event, {
      status: 201,
      data: user,
      message: 'User created and logged in successfully'
    })
  } catch (error: any) {
    logger.error('User creation failed:', error)

    return createApiError(event, {
      code: error.cause ? 'validation_error' : 'internal_server_error',
      message: error.message || 'Something went wrong on our end.',
      status: error.cause ? 400 : 500,
      details: error.cause ?? null
    })
  }
})
