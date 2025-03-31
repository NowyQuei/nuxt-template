import { z } from 'zod'
import { addPasskey } from '@@/server/services/userService'

export default defineWebAuthnRegisterEventHandler({
  async validateUser(userBody, event) {
    const session = await getUserSession(event)

    if (!session?.user || session.user.email !== userBody.userName) {
      throw createError({ statusCode: 400, message: 'Email does not match the current session' })
    }

    return z
      .object({
        userName: z.string().email(),
        name: z.string().min(1, 'Name is required')
      })
      .parse(userBody)
  },

  async onSuccess(event, { credential, user }) {
    const session = await getUserSession(event)
    const userId = session?.user?.id
    const body = await readBody(event)

    if (!userId) {
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
  }
})
