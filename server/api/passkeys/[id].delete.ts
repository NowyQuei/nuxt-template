import CredentialsSchema from '@@/server/models/credentialsSchema'
import { deletePasskey } from '@@/server/services/passkeyService'

export default defineEventHandler(async (event) => {
  logger.debug('triggered /api/passkeys/[passkeyId].delete.ts')

  try {
    const passkeyId = event.context.params?.id

    if (!passkeyId) {
      throw createError({ statusCode: 400, message: 'Missing passkey ID' })
    }

    const passkey: Credentials = await CredentialsSchema.findOne({ id: passkeyId }).populate('user')
    logger.debug(`Found passkey: ${JSON.stringify(passkey)}`)

    if (!passkey) {
      logger.debug('Passkey not found')
      return createApiError(event, {
        code: 'unauthorized',
        message: 'You are not authorized.',
        status: 403
      })
    }

    const session = await getUserSession(event)
    const isOwner = passkey.user?.id === session?.user?.id
    const isAdmin = session?.user?.role === 'admin'

    if (isOwner || isAdmin) {
      logger.debug(`${isOwner ? 'User owns' : 'Admin access to'} passkey`)
      await deletePasskey(passkeyId)

      return createApiSuccess(event, {
        data: { deletedId: passkeyId },
        message: 'Passkey deleted successfully.',
        status: 200
      })
    }

    return createApiError(event, {
      code: 'unauthorized',
      message: 'You are not authorized.',
      status: 403
    })
  } catch (err) {
    logger.error('Error in delete passkey handler:', err)
    return createApiError(event, {
      code: 'internal_error',
      message: 'Something went wrong.',
      status: 500
    })
  }
})
