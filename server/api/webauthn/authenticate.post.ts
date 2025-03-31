import CredentialsSchema from '@@/server/models/credentialsSchema'
import { UserSchema } from '@@/server/models/userSchema'

export default defineWebAuthnAuthenticateEventHandler({
  // Allow credentials based on provided userName
  async allowCredentials(event, userName) {
    const user = await UserSchema.findOne({
      $or: [{ username: userName }, { email: userName }]
    })

    if (!user) {
      throw createError({ statusCode: 400, message: 'User not found' })
    }

    const credentials = await CredentialsSchema.find({ userId: user.id })
    return credentials.map((cred) => ({ id: cred.credentialId }))
  },

  // Get credential from DB to verify signature
  async getCredential(event, credentialId) {
    const credential = await CredentialsSchema.findOne({ credentialId })

    if (!credential) {
      throw createError({ statusCode: 400, message: 'Credential not found' })
    }

    return {
      id: credential.credentialId,
      publicKey: credential.publicKey,
      counter: credential.counter
    }
  },

  // On success, restore the session and update counter
  async onSuccess(event, { credential, authenticationInfo }) {
    const dbCredential = await CredentialsSchema.findOne({ credentialId: credential.id })

    if (!dbCredential) {
      throw createError({ statusCode: 400, message: 'Linked credential not found' })
    }

    const user = await UserSchema.findById(dbCredential.userId)
    if (!user) {
      throw createError({ statusCode: 400, message: 'User not found' })
    }

    // Update counter
    dbCredential.counter = authenticationInfo.newCounter
    await dbCredential.save()

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      loggedInAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    })
  }
})
