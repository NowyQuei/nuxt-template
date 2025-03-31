import CredentialsSchema from '@@/server/models/credentialsSchema'

export default defineEventHandler(async () => {
  const session = await getUserSession(event)

  if (session?.user?.role !== 'admin') {
    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized to get passkeies.',
      status: 403
    })
  }

  const credentials = await CredentialsSchema.find({}, 'name userId')

  return credentials.map((c) => ({
    name: c.name,
    userId: c.userId
  }))
})
