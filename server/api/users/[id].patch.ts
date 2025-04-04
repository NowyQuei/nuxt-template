import { updateUser, getUserById } from '@@/server/services/userService'

export default defineEventHandler(async (event) => {
  logger.info('triggered /api/users/[id].patch.ts')

  const userId = event.context.params?.id

  if (!userId) {
    logger.error('No user ID provided in path')
    return createApiError(event, {
      code: 'missing_user_id',
      message: 'User ID is required in the path.',
      status: 400
    })
  }

  try {
    const session = await getUserSession(event)

    const isAdmin = session?.user?.role === 'admin'
    const isSelf = session?.user?.id === userId

    if (!isAdmin && !isSelf) {
      logger.warn(`Unauthorized update attempt by ${session?.user?.id} on user ${userId}`)
      return createApiError(event, {
        code: 'unauthorized',
        message: 'You are not authorized to update this user.',
        status: 403
      })
    }

    const body = await readBody(event)
    logger.debug(`Updating user ${userId} with data:`, body)

    // ✅ Load current user to compare role
    const currentUser = await getUserById(userId)
    if (!currentUser) {
      logger.debug(`User with ID '${userId}' not found`)
      return createApiError(event, {
        code: 'user_not_found',
        message: `User with ID '${userId}' was not found.`,
        status: 404
      })
    }

    // ✅ Role change attempt (non-admins not allowed)
    if ('role' in body && body.role !== currentUser.role && !isAdmin) {
      logger.warn(`User ${session?.user?.id} attempted to change role to '${body.role}'`)
      return createApiError(event, {
        code: 'forbidden_role_change',
        message: 'Only admins can change user roles.',
        status: 403
      })
    }

    const user = await updateUser(userId, body)

    if (!user) {
      logger.debug(`User with ID '${userId}' not found`)
      return createApiError(event, {
        code: 'user_not_found',
        message: `User with ID '${userId}' was not found.`,
        status: 404
      })
    }

    // ✅ Refresh session if user updated themselves
    if (isSelf) {
      const config = useRuntimeConfig()
      await setUserSession(event, {
        user,
        loggedInAt: new Date(),
        expiresAt: new Date(Date.now() + (config.session.maxAge ?? 60 * 60 * 24 * 7 * 1000)) // 1 week default
      })
    }

    logger.success(`User ${userId} updated successfully`)
    return createApiSuccess(event, {
      status: 200,
      data: user,
      message: 'User updated successfully.'
    })
  } catch (err) {
    logger.error('Failed to update user:', err)
    return createApiError(event, {
      code: 'update_failed',
      message: 'Failed to update user.',
      status: 500
    })
  }
})
