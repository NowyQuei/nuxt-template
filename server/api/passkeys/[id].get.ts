import { getAllPasskeysByUserId } from '@@/server/services/passkeyService'

export default defineEventHandler(async (event) => {
  logger.debug('triggered /api/passkeys/[id].get.ts')

  try {
    const userId = event.context.params?.id
    logger.debug('userId param:', userId)

    if (!userId) {
      return createApiError(event, {
        code: 'bad_request',
        message: 'Missing user ID',
        status: 400
      })
    }

    const session = await getUserSession(event)
    logger.debug('Session user:', session?.user)

    if (session?.user?.role !== 'admin' && session?.user?.id !== userId) {
      return createApiError(event, {
        code: 'unauthorized',
        message: 'You are not authorized to get the passkeys for this user.',
        status: 403
      })
    }

    const credentials = await getAllPasskeysByUserId(userId)
    logger.success(`Found ${credentials.length} passkeys for user ${userId}`)

    return createApiSuccess(event, {
      data: credentials,
      message: 'Passkeys fetched successfully.',
      status: 200
    })
  } catch (err) {
    logger.error('Failed to fetch passkeys:', err)
    return createApiError(event, {
      code: 'internal_error',
      message: 'Could not fetch passkeys.',
      status: 500
    })
  }
})
