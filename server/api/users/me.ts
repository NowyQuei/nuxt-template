export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/me')
  const { user } = event.context
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  logger.debug('user', user)

  return createApiSuccess(event, {
    status: 200,
    data: user
  })
})
