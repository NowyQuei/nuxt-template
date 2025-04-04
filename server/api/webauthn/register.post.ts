import { z } from 'zod'
import { addPasskey } from '@@/server/services/passkeyService'

export default defineWebAuthnRegisterEventHandler({
  async validateUser(userBody, event) {
    try {
      logger.debug('WebAuthn: validateUser triggered', { userBody })

      const session = await getUserSession(event)

      if (!session?.user || session.user.email !== userBody.userName) {
        logger.warn('Email does not match session', {
          sessionEmail: session?.user?.email,
          bodyEmail: userBody.userName
        })
        throw createError({ statusCode: 400, message: 'Email does not match the current session' })
      }

      const parsed = z
        .object({
          userName: z.string().email(),
          name: z.string().min(1, 'Name is required')
        })
        .parse(userBody)

      logger.debug('User data validated', parsed)

      return parsed
    } catch (error) {
      logger.error('WebAuthn validateUser error:', error)
      throw createError({ statusCode: 400, message: 'Invalid user data' })
    }
  },

  async onSuccess(event, { credential, user }) {
    logger.debug('WebAuthn: onSuccess triggered')

    try {
      const session = await getUserSession(event)
      const userId = session?.user?.id
      const body = await readBody(event)

      if (!userId) {
        logger.error('User not found in session')
        throw createError({ statusCode: 400, message: 'User not found in session' })
      }

      await addPasskey(userId, {
        credentialId: credential.id,
        publicKey: credential.publicKey,
        counter: credential.counter,
        backedUp: credential.backedUp,
        transports: credential.transports,
        name: body.user.name
      })

      await setUserSession(event, {
        ...session,
        loggedInAt: new Date()
      })

      logger.success(`Passkey "${body.user.name}" added for user ${userId}`)
    } catch (error) {
      logger.error('WebAuthn onSuccess error:', error)
      throw createError({ statusCode: 500, message: 'Failed to register passkey' })
    }
  }
})
