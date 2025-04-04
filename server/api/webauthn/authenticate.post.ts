import {
  getAllPasskeysByUserId,
  getCredentialByCredentialId
} from '@@/server/services/passkeyService'
import { getUserById, getUserByUsername } from '@@/server/services/userService'
import { setSession } from '@@/server/services/sessionService'

export default defineWebAuthnAuthenticateEventHandler({
  /**
   * Retrieves the list of allowed credentials for a given username.
   *
   * @param event - The event object for the WebAuthn request.
   * @param userName - The username for which credentials are being retrieved.
   * @returns An array of allowed credentials with their IDs.
   * @throws An error if the user or credentials are not found.
   */
  async allowCredentials(event, userName) {
    logger.debug('WebAuthn: allowCredentials triggered', { userName })

    try {
      const user = await getUserByUsername(userName)
      if (!user) {
        logger.warn('User not found for allowCredentials', { userName })
        throw createError({ statusCode: 400, message: 'User not found' })
      }

      const credentials = await getAllPasskeysByUserId(user.id)
      if (!credentials.length) {
        logger.warn('No passkeys found for user', { userId: user.id })
        throw createError({ statusCode: 400, message: 'No passkeys registered' })
      }

      logger.debug(
        'Allowed credentials',
        credentials.map((c) => c.credentialId)
      )
      return credentials.map((cred) => ({ id: cred.credentialId }))
    } catch (error) {
      logger.error('Error in allowCredentials:', error)
      throw createError({ statusCode: 500, message: 'Failed to load credentials' })
    }
  },

  /**
   * Fetches a specific credential by its credential ID.
   *
   * @param event - The event object for the WebAuthn request.
   * @param credentialId - The ID of the credential to retrieve.
   * @returns An object containing the credential's ID, public key, and counter.
   * @throws An error if the credential is not found.
   */
  async getCredential(event, credentialId) {
    logger.debug('WebAuthn: getCredential triggered', { credentialId })

    try {
      const credential = await getCredentialByCredentialId(credentialId)
      if (!credential) {
        logger.warn('Credential not found', { credentialId })
        throw createError({ statusCode: 400, message: 'Credential not found' })
      }

      // Attach to event context for reuse
      event.context.webauthnCredential = credential

      return {
        id: credential.credentialId,
        publicKey: credential.publicKey,
        counter: credential.counter
      }
    } catch (error) {
      logger.error('Error in getCredential:', error)
      throw createError({ statusCode: 500, message: 'Failed to fetch credential' })
    }
  },

  /**
   * Handles the success event after a WebAuthn authentication attempt.
   * Updates the credential counter, links the credential to the user, and sets the user session.
   *
   * @param event - The event object for the WebAuthn request.
   * @param param1 - An object containing the credential and authentication information.
   * @throws An error if the credential or user is not found, or if session setup fails.
   */
  async onSuccess(event, { credential, authenticationInfo }) {
    logger.debug('WebAuthn: onSuccess triggered', { credentialId: credential.id })

    try {
      const dbCredential =
        event.context.webauthnCredential || (await getCredentialByCredentialId(credential.id))

      if (!dbCredential) {
        logger.warn('Linked credential not found', { credentialId: credential.id })
        throw createError({ statusCode: 400, message: 'Credential not linked to user' })
      }

      const user = await getUserById(dbCredential.user)
      if (!user) {
        logger.warn('User not found for credential', { userId: dbCredential.user })
        throw createError({ statusCode: 400, message: 'User not found' })
      }

      dbCredential.counter = authenticationInfo.newCounter
      await dbCredential.save()

      await setSession(event, user)

      logger.success('WebAuthn login successful', { email: user.email })
    } catch (error) {
      logger.error('Error in onSuccess:', error)
      throw createError({ statusCode: 500, message: 'WebAuthn login failed' })
    }
  }
})
