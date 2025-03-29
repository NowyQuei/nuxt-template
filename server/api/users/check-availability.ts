import { UserSchema } from '@@/server/models/userSchema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { email, username } = query

  if (!email && !username) {
    return createApiError(event, {
      status: 400,
      message: 'Missing parameters',
      code: 'missing_parameters'
    })
  }

  const conditions: any = {}
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
