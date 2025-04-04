import { getAllPasskeys } from '@@/server/services/passkeyService'

export default defineEventHandler(async (event) => {
  logger.debug('triggered /api/passkeys/index.get.ts')

  try {
    const session = await getUserSession(event)
    logger.debug('Session user:', session?.user)

    if (session?.user?.role !== 'admin') {
      return createApiError(event, {
        code: 'unauthorized',
        message: 'You are not authorized to get passkeys.',
        status: 403
      })
    }

    const credentials = await getAllPasskeys()
    logger.success(`Fetched ${credentials.length} total passkeys`)

    return createApiSuccess(event, {
      data: credentials,
      message: 'Passkeys retrieved successfully.',
      status: 200
    })
  } catch (err) {
    logger.error('Failed to fetch all passkeys:', err)
    return createApiError(event, {
      code: 'internal_error',
      message: 'Could not fetch passkeys.',
      status: 500
    })
  }
})
