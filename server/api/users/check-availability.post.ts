import { UserSchema } from '@@/server/models/userSchema'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/check-availability')

  try {
    const body = await readBody(event)
    const { email, username } = body || {}

    if (!email && !username) {
      logger.warn('Missing parameters: email or username')
      return createApiError(event, {
        status: 400,
        message: 'Missing parameters',
        code: 'missing_parameters'
      })
    }

    const conditions: Record<string, string> = {}
    if (email) conditions.email = email
    if (username) conditions.username = username

    logger.debug('Checking availability for:', conditions)

    const existing = await UserSchema.findOne(conditions).lean()

    logger.success('Availability check complete')
    return createApiSuccess(event, {
      status: 200,
      data: {
        available: !existing,
        field: email ? 'email' : 'username'
      }
    })
  } catch (err) {
    logger.error('Error during availability check:', err)
    return createApiError(event, {
      status: 500,
      code: 'availability_check_failed',
      message: 'Failed to check availability.'
    })
  }
})
