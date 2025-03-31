import CredentialsSchema from '@@/server/models/credentialsSchema'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/passkeys/[id]')
  const userId = event.context.params?.id

  if (!userId) {
    return createError({ statusCode: 400, message: 'Missing user ID' })
  }

  const session = await getUserSession(event)

  if (session?.user?.role !== 'admin' && session?.user?.id !== userId) {
    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized to get the passkey for this user.',
      status: 403
    })
  }

  const credentials = await CredentialsSchema.find({ userId })
  return credentials
})
