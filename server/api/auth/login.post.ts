import { getUserByUsernameWithPassword } from '@@/server/services/userService'
import { setSession } from '@@/server/services/sessionService'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/auth/login')

  try {
    const body = await readBody(event)

    if (!body) {
      logger.error('Request body is empty or undefined')
      return createApiError(event, {
        code: 'bad_request',
        message: 'Request body is missing',
        status: 400
      })
    }

    const { username, password } = body

    if (!username || !password) {
      logger.error('Username or password missing')
      return createApiError(event, {
        code: 'bad_request',
        message: 'Username and password are required',
        status: 400
      })
    }

    logger.debug(`Trying to log in user: ${username}`)

    const user = await getUserByUsernameWithPassword(username)

    if (!user) {
      logger.error(`No user found for username: ${username}`)
      return createApiError(event, {
        code: 'unauthorized',
        message: 'Invalid username or password',
        status: 401
      })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      logger.error(`Invalid password for user: ${username}`)
      return createApiError(event, {
        code: 'unauthorized',
        message: 'Invalid username or password',
        status: 401
      })
    }

    await setSession(event, user)

    logger.success(`User ${username} successfully logged in`)
    return createApiSuccess(event, {
      status: 200,
      data: user,
      message: 'Login successful'
    })
  } catch (error) {
    logger.error('Error handling login request:', error)
    return createApiError(event, {
      code: 'internal_error',
      message: 'Failed to process login',
      status: 500
    })
  }
})
