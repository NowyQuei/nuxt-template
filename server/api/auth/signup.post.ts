import { createUser } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/auth/signup')

  const body = await readBody(event) // Retrieve request body
  if (!body) {
    return createApiError(event, {
      code: 'request_error',
      message: 'Request body is empty or undefined',
      status: 400
    })
  }

  try {
    const user = await createUser(body) // Handles validation + DB save

    const config = useRuntimeConfig()
    await setUserSession(event, {
      user,
      loggedInAt: new Date(),
      expiresAt: new Date(Date.now() + (config.session.maxAge ?? 60 * 60 * 24 * 7)) // Default to 1 week session if undefined
    })
    return createApiSuccess(event, {
      status: 201,
      data: user,
      message: 'User created and logged in successfully'
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
