import { getUserByUsernameWithPassword } from '@@/server/services/userService'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/auth/login')

  try {
    const body = await readBody(event) // Retrieve request body
    if (!body) {
      logger.error('Request body is empty or undefined')
      return createError({
        statusCode: 400,
        statusMessage: 'Request body is empty or undefined'
      })
    }

    const { username, password } = body

    if (!username || !password) {
      logger.error('Username or password missing')
      return createError({
        statusCode: 400,
        statusMessage: 'Username and password are required'
      })
    }

    const user = await getUserByUsernameWithPassword(username)
    const isValid = await bcrypt.compare(password, user.password)

    if (!user || !isValid) {
      logger.error(`Invalid username or password for user: ${username}`)
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid username or password'
      })
    } else {
      const config = useRuntimeConfig()
      await setUserSession(event, {
        user: user,
        loggedInAt: new Date(),
        expiresAt: new Date(Date.now() + (config.session.maxAge ?? 60 * 60 * 24 * 7)) // Default to 1 week session if undefined
      })
    }

    return createApiSuccess(event, {
      status: 200,
      data: user
    })
  } catch (error) {
    logger.error('Error handling login request:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to process request'
    })
  }
})
