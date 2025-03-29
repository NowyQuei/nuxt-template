import { deleteUser } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/[id].delete.ts')
  const userId = event.context.params?.id

  if (!userId) {
    return createApiError(event, {
      code: 'missing_user_id',
      message: 'User ID is required in the path.'
    })
  }

  const user = await deleteUser(userId)

  if (user === null) {
    return createApiError(event, {
      code: 'user_not_found',
      message: `User with ID '${userId}' was not found.`,
      status: 404
    })
  }

  return createApiSuccess(event, {
    status: 200,
    data: null
  })
})
