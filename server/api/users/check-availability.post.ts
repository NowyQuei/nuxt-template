import { UserSchema } from '@@/server/models/userSchema'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/check-availability')

  const body = await readBody(event)
  const { email, username } = body || {}

  if (!email && !username) {
    return createApiError(event, {
      status: 400,
      message: 'Missing parameters',
      code: 'missing_parameters'
    })
  }

  const conditions: Record<string, string> = {}
  if (email) conditions.email = email
  if (username) conditions.username = username

  const existing = await UserSchema.findOne(conditions).lean()

  return createApiSuccess(event, {
    status: 200,
    data: {
      available: !existing,
      field: email ? 'email' : 'username'
    }
  })
})
