export async function setSession(event: H3Event, user: User) {
  try {
    logger.debug(`Setting session for user: ${user.username}`)
    const config = useRuntimeConfig()
    logger.debug('initial user:', JSON.stringify(user))
    const sanitizedUser: User = sanitizeUser(user)
    logger.debug('sanitized user:', JSON.stringify(sanitizedUser))
    await setUserSession(event, {
      user: sanitizedUser,
      loggedInAt: new Date(),
      expiresAt: new Date(Date.now() + (config.session.maxAge ?? 60 * 60 * 24 * 7 * 1000)) // 1 week default
    })
    logger.success(`Session set for user ${user.username}`)
  } catch (err) {
    logger.error('Failed to set session:', err)
    throw err
  }
}
