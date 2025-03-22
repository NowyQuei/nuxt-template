import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const users: Record<string, z.infer<typeof UserSchema>> = {}

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/index.post.ts')
  try {
    const body = await readBody(event)

    const { success, data, errors } = validateUserInput(body)

    if (!success || !data) {
      return createApiError(event, {
        code: 'validation_error',
        message: 'Invalid user data.',
        details: errors ?? null
      })
    }

    const user: User = { id: uuidv4(), ...data }
    users[user.id] = user

    return createApiSuccess(event, {
      status: 201,
      data: sanitizeUser(user),
      message: 'User created successfully'
    })
  } catch (error) {
    logger.error('Unexpected error in user creation:', error)
    return createApiError(event, {
      code: 'internal_server_error',
      message: 'Something went wrong on our end.',
      status: 500
    })
  }
})
