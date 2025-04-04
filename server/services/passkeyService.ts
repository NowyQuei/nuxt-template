import CredentialsSchema from '@@/server/models/credentialsSchema'
import { UserSchema } from '@@/server/models/userSchema'

/**
 * Adds a new passkey (credential) for a user.
 *
 * @param userId - The ID of the user to associate the passkey with.
 * @param credential - The credential data to be added.
 * @throws Will throw an error if the credential already exists or if the passkey name is duplicated.
 */
export async function addPasskey(userId: string, credential: zCredentials) {
  try {
    logger.debug('Checking if credential already exists...')
    const existing = await CredentialsSchema.findOne({
      user: userId,
      publicKey: credential.publicKey
    })

    if (existing) {
      throw new Error('Credential already exists')
    }

    logger.debug('Checking for duplicate name...')
    const sameName = await CredentialsSchema.findOne({ user: userId, name: credential.name })

    if (sameName) {
      const error = new Error(`Passkey name "${credential.name}" already exists for this user`)
      error.cause = { name: 'Duplicate passkey name' }
      throw error
    }

    logger.debug('Creating new credential...')
    const newCredential = await CredentialsSchema.create({
      user: userId,
      credentialId: credential.credentialId,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp ? 1 : 0,
      transports: credential.transports.join(','),
      name: credential.name
    })

    logger.debug('Linking credential to user...')
    await UserSchema.findByIdAndUpdate(userId, {
      $addToSet: { credentials: newCredential._id }
    })

    logger.success(`Passkey "${newCredential.name}" added to user ${userId}`)
  } catch (err) {
    logger.error('Error adding passkey:', err)
    throw err
  }
}

/**
 * Deletes a passkey (credential) by its ID.
 *
 * @param passkeyId - The ID of the passkey to delete.
 * @throws Will throw an error if the passkey is not found.
 */
export async function deletePasskey(passkeyId: string) {
  try {
    logger.debug(`Finding passkey with ID: ${passkeyId}`)
    const passkey = await CredentialsSchema.findById(passkeyId).populate('user')

    if (!passkey) {
      throw new Error(`Passkey with ID ${passkeyId} not found`)
    }

    logger.debug('Deleting passkey...')
    await CredentialsSchema.deleteOne({ id: passkeyId })

    logger.debug('Removing passkey reference from user...')
    await UserSchema.updateOne({ id: passkey.user.id }, { $pull: { credentials: passkeyId } })

    logger.success(`Passkey ${passkeyId} deleted`)
  } catch (err) {
    logger.error('Error deleting passkey:', err)
    throw err
  }
}

/**
 * Retrieves all passkeys associated with a specific user.
 *
 * @param userId - The ID of the user whose passkeys are to be fetched.
 * @returns An array of passkeys associated with the user.
 * @throws Will throw an error if the operation fails.
 */
export async function getAllPasskeysByUserId(userId: string) {
  try {
    logger.debug(`Fetching passkeys for user ${userId}`)
    return await CredentialsSchema.find({ user: userId })
  } catch (err) {
    logger.error('Failed to fetch passkeys by user ID:', err)
    throw err
  }
}

/**
 * Retrieves all passkeys in the system.
 *
 * @returns An array of all passkeys.
 * @throws Will throw an error if the operation fails.
 */
export async function getAllPasskeys() {
  try {
    logger.debug('Fetching all passkeys')
    return await CredentialsSchema.find({})
  } catch (err) {
    logger.error('Failed to fetch all passkeys:', err)
    throw err
  }
}

/**
 * Retrieves a specific credential by its ID.
 *
 * @param id - The ID of the credential to fetch.
 * @returns The credential object if found, otherwise null.
 * @throws Will throw an error if the operation fails.
 */
export async function getCredentialById(id: string) {
  try {
    logger.debug(`Fetching credential by ID: ${id}`)
    return await CredentialsSchema.findOne({ id })
  } catch (err) {
    logger.error('Failed to fetch credential by ID:', err)
    throw err
  }
}

/**
 * Retrieves a specific credential by its credential ID.
 *
 * @param credentialId - The credential ID to fetch.
 * @returns The credential object if found, otherwise null.
 * @throws Will throw an error if the operation fails.
 */
export async function getCredentialByCredentialId(credentialId: string) {
  try {
    logger.debug(`Fetching credential by credentialId: ${credentialId}`)
    return await CredentialsSchema.findOne({ credentialId })
  } catch (err) {
    logger.error('Failed to fetch credential by credentialId:', err)
    throw err
  }
}
